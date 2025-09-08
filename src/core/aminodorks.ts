import { AminoDorksConfig } from '../schemas/configs';
import { HttpWorkflow } from './httpworkflow';
import { SecurityManager } from '../managers/securityManager';
import { Account } from '../schemas/aminodorks';
import { MediaType } from '../public';
import { Safe } from '../private';
import { CommunityResolutionResponse, CommunityResolutionResponseSchema, LinkResolutionResponse, LinkResolutionResponseSchema, UploadMediaResponse, UploadMediaResponseSchema } from '../schemas/responses/global';
import { CommunityManager } from '../managers/communityManager';
import { WalletManager } from '../managers/walletManager';
import { UserManager } from '../managers/userManager';
import { LinkInfo } from '../schemas/aminoapps/link';
import { Community } from '../schemas/aminoapps/community';
import { PostManager } from '../managers/postManager';
import { ThreadManager } from '../managers/threadManager';
import { AdminManager } from '../managers/adminManager';
import initLogger, { LOGGER } from '../utils/logger';
import initQuickLRU from '../utils/qucklru';
import { SocketWorkflow } from './socketsworkflow';
import { generateDeviceId } from '../utils/crypt';
import { ACMManager } from '../managers/acmManager';

export class AminoDorks {
    private __config: AminoDorksConfig;
    private readonly __httpWorkflow: HttpWorkflow;

    private readonly __account?: Account;
    private __socketWorkflow?: SocketWorkflow;
    private __securityManager?: SecurityManager;
    private __communityManager?: CommunityManager;
    private __walletManager?: WalletManager;
    private __userManager?: UserManager;
    private __postManager?: PostManager;
    private __threadManager?: ThreadManager;
    private __adminManager?: AdminManager;
    private __acmManager?: ACMManager;

    constructor(config: AminoDorksConfig) {
        this.__config = config;
        this.__config.deviceId = this.__config.deviceId || generateDeviceId();
        this.__account = config.account;
        
        initLogger(!!config.enableLogging);
        initQuickLRU(config.quicklru?.maxAge, config.quicklru?.maxSize);
        
        this.__httpWorkflow = config.httpWorkflow || new HttpWorkflow(config.apiKey, this.__config.deviceId, this.__config.proxies);
    };

    public get account(): Account {
        const pureAccount = this.__account || this.__securityManager?.account;

        if (!pureAccount) {
            LOGGER.error(this.__securityManager?.account, 'Account is not defined.');
            process.exit(0);
        };

        return pureAccount;
    };

    get security(): SecurityManager {
        if (!this.__securityManager) return this.__securityManager = new SecurityManager(this.__config, this.__httpWorkflow);

        return this.__securityManager;
    };

    get community(): CommunityManager {
        if (!this.__communityManager) return this.__communityManager = new CommunityManager(this.__config.context, this.account, this.__httpWorkflow);

        return this.__communityManager;
    };

    get wallet(): WalletManager {
        if (!this.__walletManager) return this.__walletManager = new WalletManager(this.__config.context, this.__httpWorkflow);

        return this.__walletManager;
    };

    get user(): UserManager {
        if (!this.__userManager) return this.__userManager = new UserManager(this.__config.context, this.account, this.__httpWorkflow);
        
        return this.__userManager;
    };

    get post(): PostManager {
        if (!this.__postManager) {
            if (!this.__config.context.ndcId) {
                LOGGER.fatal(this.__config.context.ndcId, 'ndcId is not defined. Use .as to set ndcId.');
                process.exit(0);
            };
            return this.__postManager = new PostManager(this.__config.context.ndcId, this.__httpWorkflow);
        };
        
        return this.__postManager;
    };

    get thread(): ThreadManager {
        if (!this.__threadManager) {
            if (!this.__config.context.ndcId) {
                LOGGER.fatal(this.__config.context.ndcId, 'ndcId is not defined. Use .as to set ndcId.');
                process.exit(0);
            };
            return this.__threadManager = new ThreadManager(this.__config.context.ndcId, this.account, this.__httpWorkflow);
        };
        
        return this.__threadManager;
    };

    get admin(): AdminManager {
        if (!this.__adminManager) {
            if (!this.__config.context.ndcId) {
                LOGGER.fatal(this.__config.context.ndcId, 'ndcId is not defined. Use .as to set ndcId.');
                process.exit(0);
            };
            return this.__adminManager = new AdminManager(this.__config.context.ndcId, this.__httpWorkflow);
        };
        
        return this.__adminManager;
    };

    get acm(): ACMManager {
        if (!this.__acmManager) {
            if (!this.__config.context.ndcId) {
                LOGGER.fatal(this.__config.context.ndcId, 'ndcId is not defined. Use .as to set ndcId.');
                process.exit(0);
            };
            return this.__acmManager = new ACMManager(this.__config.context.ndcId, this.__httpWorkflow);
        };
        
        return this.__acmManager;
    };

    get socket(): SocketWorkflow {
        if (!this.__socketWorkflow) return this.__socketWorkflow = new SocketWorkflow(this);

        return this.__socketWorkflow;
    };

    private __basicUpload = async (path: Safe<string>, file: Safe<Buffer>, type: Safe<MediaType>): Promise<UploadMediaResponse> => {
        return await this.__httpWorkflow.sendBuffer<UploadMediaResponse>({
            path: path,
            body: file,
            contentType: `${type}; application/octet-stream`
        }, UploadMediaResponseSchema);
    };

    public uploadMedia = async (file: Safe<Buffer>, type: Safe<MediaType>): Promise<UploadMediaResponse> => {
        return await this.__basicUpload('/g/s/media/upload', file, type);
    };

    public getLinkResolution = async (link: Safe<string>): Promise<LinkInfo> => {
        return (await this.__httpWorkflow.sendGet<LinkResolutionResponse>({
            path: `/g/s/link-resolution?q=${link.split('/')[4]}`
        }, LinkResolutionResponseSchema)).linkInfoV2.extensions.linkInfo;
    };

    public getCommunityResolution = async (link: Safe<string>): Promise<Community> => {
        return (await this.__httpWorkflow.sendGet<CommunityResolutionResponse>({
            path: `/g/s/link-resolution?q=${link}`
        }, CommunityResolutionResponseSchema)).linkInfoV2.extensions.community;
    };

    public getElapsedRealtime = async (): Promise<string> => {
        return (await this.__httpWorkflow.getElapsedRealtime()).elapsedRealtime;
    };

    as = (ndcId: number): AminoDorks => {
        return new AminoDorks({
            ...this.__config,
            context: {
                enviroment: 'ndc',
                ndcId: ndcId
            },
            account: this.security.account,
            httpWorkflow: this.__httpWorkflow
        });
    };
};