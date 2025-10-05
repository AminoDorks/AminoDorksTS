import { APIManager } from '../interfaces/manager';
import { HttpWorkflow } from '../core/httpworkflow';
import { AminoDorksConfig } from '../schemas/configs';
import { MayUndefined, Safe } from '../private';
import { Account, AccountSchema, CachedAccount } from '../schemas/aminodorks';
import { GetAccountResponse, GetAccountResponseSchema, LoginResponse, LoginResponseSchema } from '../schemas/responses/global';
import { BasicResponse, BasicResponseSchema } from '../schemas/responses/basic';
import { RegisterBuilder, UpdateEmailBuilder } from '../public';
import { LOGGER } from '../utils/logger';
import { cacheSet, QUICKLRU } from '../utils/qucklru';
import { decodeSession } from '../utils/crypt';
import { SessionData } from '../schemas/crypt';
import { User } from '../schemas/aminoapps/user';

export class SecurityManager implements APIManager {
    endpoint: Safe<string> = '/g/s';

    private __config: AminoDorksConfig;
    private readonly __httpWorkflow: HttpWorkflow;
    public account?: Account;

    constructor(config: AminoDorksConfig, httpWorkflow: HttpWorkflow) {
        this.__config = config;
        this.__httpWorkflow = httpWorkflow;
    };

    private __updatePublicKey = async (userId: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/security/public_key`,
            body: JSON.stringify(
                (await this.__httpWorkflow.getPublicKeyCredentials(userId)).credentials
            )
        }, BasicResponseSchema);
    };

    private __loginFromCache = async (cachedAccount: CachedAccount, updateKey: boolean): Promise<LoginResponse> => {
        this.account = cachedAccount.account;
        this.__httpWorkflow.headers = {
            AUID: cachedAccount.account.user.uid,
            NDCDEVICEID: cachedAccount.account.deviceId,
            NDCAUTH: `sid=${cachedAccount.account.sessionId}`
        };
        LOGGER.info({ nickname: cachedAccount.account.user.nickname }, 'Logged from cache.');

        if (updateKey) await this.__updatePublicKey(cachedAccount.account.user.uid);

        return LoginResponseSchema.parse({
            sid: cachedAccount.account.sessionId,
            userProfile: cachedAccount.account.user
        });
    };

    private __getAccountWithSession = async (account: CachedAccount): Promise<MayUndefined<boolean>> => {
        try {
            const rawResponse = await this.__httpWorkflow.sendRaw<BasicResponse>({
                method: 'GET',
                path: `${this.endpoint}/account`,
                headers: {
                    NDCAUTH: `sid=${account.account.sessionId}`,
                    NDCDEVICEID: account.account.deviceId,
                    AUID: account.account.user.uid
                },
                body: ''
            }, BasicResponseSchema);

            return rawResponse['api:statuscode'] == 0;
        } catch {
            return false;
        };
    };

    public getAccount = async (): Promise<MayUndefined<User>> => {
        const getAccountResponse = await this.__httpWorkflow.sendGet<GetAccountResponse>({
            path: `${this.endpoint}/account`
        }, GetAccountResponseSchema);

        if (getAccountResponse['api:statuscode'] != 0) return;

        return getAccountResponse.account;
    };

    public login = async (email: Safe<string>, password: Safe<string>, updateKey = true, loginType = 100): Promise<LoginResponse> => {
        const cachedAccount = QUICKLRU.get(`${email}-${password}`);
        if (cachedAccount && (await this.__getAccountWithSession(cachedAccount))) return this.__loginFromCache(cachedAccount, updateKey);

        const loginResponse = await this.__httpWorkflow.sendEarlyPost<LoginResponse>({
            path: `${this.endpoint}/auth/login`,
            body: JSON.stringify({
                email: email,
                v: 2,
                secret: `0 ${password}`,
                deviceID: this.__config.deviceId,
                clientType: loginType,
                action: 'normal',
                timestamp: Date.now()
            })
        }, LoginResponseSchema);

        if (loginType != 300) {
                this.account = AccountSchema.parse({
                sessionId: loginResponse.sid,
                deviceId: this.__config.deviceId,
                user: loginResponse.userProfile
            });

            this.__httpWorkflow.headers = {
                AUID: loginResponse.userProfile.uid,
                NDCAUTH: `sid=${loginResponse.sid}`
            };

            cacheSet(`${email}-${password}`, {
                account: this.account,
                email: email,
                password: password
            });
        };

        if (updateKey) await this.__updatePublicKey(loginResponse.userProfile.uid);
        
        return LoginResponseSchema.parse({
            sid: loginResponse.sid,
            userProfile: loginResponse.userProfile
        });
    };

    public loginPhone = async (phone: Safe<string>, password: Safe<string>, loginType: Safe<number> = 100, updateKey = true): Promise<LoginResponse> => {
        const loginResponse = await this.__httpWorkflow.sendEarlyPost<LoginResponse>({
            path: `${this.endpoint}/auth/login`,
            body: JSON.stringify({
                phoneNumber: phone,
                v: 2,
                secret: `0 ${password}`,
                deviceID: this.__config.deviceId,
                clientType: loginType,
                action: 'normal',
                timestamp: Date.now()
            })
        }, LoginResponseSchema);

        this.account = AccountSchema.parse({
            sessionId: loginResponse.sid,
            deviceId: this.__config.deviceId,
            user: loginResponse.userProfile
        });

        this.__httpWorkflow.headers = {
            AUID: loginResponse.userProfile.uid,
            NDCAUTH: `sid=${loginResponse.sid}`
        };

        if (updateKey) await this.__updatePublicKey(loginResponse.userProfile.uid);

        return loginResponse;
    };

    public loginWithSession = async (sessionId: Safe<string>, deviceId: Safe<string>, updateKey = true): Promise<MayUndefined<BasicResponse>> => {
        let sessionData: SessionData;

        try {
            sessionData = decodeSession(sessionId);
        } catch {
            LOGGER.error('Invalid session.');
            return;
        };

        this.__httpWorkflow.headers = {
            AUID: sessionData.userId,
            NDCDEVICEID: deviceId,
            NDCAUTH: `sid=${sessionId}`
        };

        const accountInfo = await this.getAccount();
        if (!accountInfo) return;
        this.account = AccountSchema.parse({
            sessionId: sessionId,
            deviceId: deviceId,
            user: accountInfo
        })

        if (updateKey) return await this.__updatePublicKey(sessionData.userId);
    };

    public register = async (builder: RegisterBuilder): Promise<BasicResponse> => {
        const chosenDeviceId = builder.deviceId || this.__httpWorkflow.getHeader('NDCDEVICEID');

        return await this.__httpWorkflow.sendEarlyPost<BasicResponse>({
            path: `${this.endpoint}/auth/login`,
            body: JSON.stringify({
                secret: `${builder.tokenType} ${builder.token}`,
                secret2: `0 ${builder.password}`,
                deviceID: chosenDeviceId,
                clientType: 100,
                nickname: builder.nickname,
                latitude: 0,
                longitude: 0,
                address: null,
                clientCallbackURL: 'aminoapp://relogin',
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public checkAccountExist = async (token: Safe<string>, deviceId?: Safe<string>): Promise<BasicResponse> => {
        const chosenDeviceId = deviceId || this.__httpWorkflow.getHeader('NDCDEVICEID');

        return await this.__httpWorkflow.sendEarlyPost<BasicResponse>({
            path: `${this.endpoint}/auth/account_exist_check`,
            body: JSON.stringify({
                secret: `30 ${token}`,
                deviceID: chosenDeviceId,
                clientType: 100,
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public requestSecurityValidation = async (email: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendEarlyPost<BasicResponse>({
            path: `${this.endpoint}/auth/request-security-validation`,
            body: JSON.stringify({
                identity: email,
                type: 1,
                deviceID: this.__httpWorkflow.getHeader('NDCDEVICEID'),
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public checkSecurityValidation = async (email: Safe<string>, code: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/auth/check-security-validation`,
            body: JSON.stringify({
                validationContext: {
                    type: 1,
                    identity: email,
                    data: {code: code}},
                deviceID: this.__httpWorkflow.getHeader('NDCDEVICEID'),
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public updateEmail = async (builder: UpdateEmailBuilder): Promise<BasicResponse> => {
        const deviceId = this.__httpWorkflow.getHeader('NDCDEVICEID');
        
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/auth/update-email`,
            body: JSON.stringify({
                deviceID: deviceId,
                secret: `0 ${builder.password}`,
                newValidationContext: {
                    identity: builder.newEmail,
                    data: {
                    code: builder.newCode
                    },
                    level: 1,
                    type: 1,
                    deviceID: deviceId
                },
                oldValidationContext: {
                    identity: builder.email,
                    data: {
                    code: builder.code
                    },
                    level: 1,
                    type: 1,
                    deviceID: deviceId
                },
                timestamp: Date.now(),
                uid: this.account?.user.uid
            })
        }, BasicResponseSchema);
    };

    public deleteAccount = async (email: Safe<string>, password: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/account/delete-request`,
            body: JSON.stringify({
                deviceID: this.__httpWorkflow.getHeader('NDCDEVICEID'),
                secret: `0 ${password}`,
                email: email,
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public restoreAccount = async (email: Safe<string>, password: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendEarlyPost<BasicResponse>({
            path: `${this.endpoint}/account/delete-request/cancel`,
            body: JSON.stringify({
                deviceID: this.__httpWorkflow.getHeader('NDCDEVICEID'),
                secret: `0 ${password}`,
                email: email,
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public disconnectGoogle = async (password: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/auth/disconnect`,
            body: JSON.stringify({
                deviceID: this.__httpWorkflow.getHeader('NDCDEVICEID'),
                secret: `0 ${password}`,
                type: 30,
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };
};