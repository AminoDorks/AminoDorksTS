import { Dispatcher, Pool, ProxyAgent, request } from 'undici';
import { z } from 'zod';
import BodyReadable from 'undici/types/readable';

import { API_HEADERS, BASE_URL, EMPTY_BODY, GENERATORS_HEADERS, GENERATORS_URL } from '../constants';
import { HeadersType, MayUndefined, Safe } from '../private';
import { generateHMAC } from '../utils/crypt';
import { AllConfigs, BufferRequestConfig, DeleteRequestConfig, GenerateECDSAResponse, GenerateECDSAResponseSchema, GetElapsedRealtime, GetElapsedRealtimeSchema, GetPublicKeyCredentialsResponse, GetPublicKeyCredentialsResponseSchema, GetRequestConfig, PostRequestConfig, RawRequestConfig, UrlEncodedRequestConfig } from '../schemas/httpworkflow';
import { BasicResponseSchema } from '../schemas/responses/basic';
import { LOGGER } from '../utils/logger';
import { convertProxy } from '../utils/utils';
import { AminoDorksAPIError } from '../exceptions/api';
import { socksDispatcher } from 'fetch-socks';

export class HttpWorkflow {
    private __headers: HeadersType = API_HEADERS;
    private __generatorsHeaders: HeadersType = GENERATORS_HEADERS;

    private readonly __proxies: string[];
    private readonly __generatorsPool: Pool;
    private __currentDispatcher: MayUndefined<ProxyAgent>;

    constructor(apiKey: string, deviceId: string, proxies: string[] = []) {
        this.__generatorsHeaders['Authorization'] = apiKey;
        this.headers = { NDCDEVICEID: deviceId };
        this.__proxies = proxies;

        if (proxies.length) this.__switchProxy();
        this.__generatorsPool = new Pool(GENERATORS_URL);
    };

    set headers(headers: HeadersType) {
        this.__headers = {
            ...this.__headers,
            ...headers
        };
    };

    // TODO: add catching of errors
    private __switchProxy = () => {
        if (this.__currentDispatcher) this.__currentDispatcher.close();
        const randomProxy = this.__proxies[Math.floor(Math.random() * this.__proxies.length)];
        this.__proxies.splice(this.__proxies.indexOf(randomProxy), 1);

        this.__currentDispatcher = socksDispatcher(convertProxy(randomProxy), {
            connect: {
                rejectUnauthorized: false
            }
        });
        LOGGER.info({socks: randomProxy}, 'Switched proxy.');
    };

    private __generateECDSA = async (payloadBody: Safe<string>): Promise<GenerateECDSAResponse> => {
        const { body } = await this.__generatorsPool.request({
            path: '/api/v1/signature/ecdsa',
            method: 'POST',
            headers: this.__generatorsHeaders,
            body: JSON.stringify({
                payload: payloadBody,
                userId: this.__headers['AUID']
            })
        });

        return GenerateECDSAResponseSchema.parse(await body.json());
    };

    private __configureHeaders = (body: Buffer, contentType?: string): HeadersType => {
        const mergedHeaders: HeadersType = JSON.parse(JSON.stringify(this.__headers));

        mergedHeaders['Content-Length'] = `${body.length}`;
        mergedHeaders['NDC-MSG-SIG'] = generateHMAC(body);

        if (contentType) mergedHeaders['Content-Type'] = contentType;

        return mergedHeaders;
    };

    private __configurePostHeaders = async (body: Buffer, contentType?: string): Promise<HeadersType> => {
        const configuredHeaders = this.__configureHeaders(body, contentType);

        configuredHeaders['NDC-MESSAGE-SIGNATURE'] = (await this.__generateECDSA(body.toString('utf-8'))).ECDSA;

        return configuredHeaders;
    };

    private __handleResponse = async <T>(fullPath: string, body: BodyReadable & Dispatcher.BodyMixin, schema: z.ZodSchema): Promise<T> => {
        let rawBody: unknown;
        
        try {
            rawBody = await body.json();
        } catch {
            rawBody = JSON.parse(await body.text());
        };

        const responseSchema = BasicResponseSchema.parse(rawBody);
        LOGGER.child({ path: fullPath }).info(responseSchema['api:statuscode']);

        if (responseSchema['api:statuscode'] != 0) AminoDorksAPIError.throw(responseSchema['api:statuscode']);

        return schema.parse(rawBody) as T;
    };

    private __withErrorHandler = async <T>(requestFunction: (config: AllConfigs, schema: z.ZodSchema) => Promise<T>) => {
        return async (config: AllConfigs, schema: z.ZodSchema): Promise<T> => {
            try {
                return await requestFunction(config, schema);
            } catch (error) {
                if (this.__currentDispatcher && this.__proxies.length) {
                    this.__switchProxy();
                    return await (await this.__withErrorHandler(requestFunction))(config, schema);
                } else if (this.__currentDispatcher && !this.__proxies.length) {
                    LOGGER.info('No proxies left. Swtiched to no proxy mode.');
                    this.__currentDispatcher = undefined;
                };

                AminoDorksAPIError.throw((error as AminoDorksAPIError).code);
            }
        };
    };

    public getHeader = (header: string): string => {
        return this.__headers[header];
    };

    public getPublicKeyCredentials = async (userId: Safe<string>): Promise<GetPublicKeyCredentialsResponse> => {
        const { body } = await this.__generatorsPool.request({
            path: `/api/v1/signature/credentials/${userId}`,
            method: 'GET',
            headers: this.__generatorsHeaders
        });

        return GetPublicKeyCredentialsResponseSchema.parse(await body.json());
    };

    public getElapsedRealtime = async (): Promise<GetElapsedRealtime> => {
        const { body } = await this.__generatorsPool.request({
            path: `/api/v1/signature/getElapsed`,
            method: 'GET',
            headers: this.__generatorsHeaders
        });

        return GetElapsedRealtimeSchema.parse(await body.json());
    };

    public sendRaw = async <T>(config: RawRequestConfig, schema: z.ZodSchema): Promise<T> => {
        const callback = async (config: RawRequestConfig, schema: z.ZodSchema) => {
            const { body } = await request(`${BASE_URL}/api/v1${config?.path}`, {
                method: config?.method || 'GET',
                headers: {
                    ...this.__headers,
                    ...config?.headers
                },
                dispatcher: this.__currentDispatcher
            });
            return await this.__handleResponse<T>(`${BASE_URL}/api/v1${config?.path}`, body, schema);
        };
        
        const handler = await this.__withErrorHandler(callback as (config: AllConfigs, schema: z.ZodSchema) => Promise<T>);

        return await handler(config, schema);
    };

    public sendGet = async <T>(config: GetRequestConfig, schema: z.ZodSchema): Promise<T> => {
        const callback = async (config: GetRequestConfig, schema: z.ZodSchema) => {
            const mergedHeaders: HeadersType = JSON.parse(JSON.stringify(this.__headers));

            if (config.contentType) mergedHeaders['Content-Type'] = config.contentType
            
            const { body } = await request(`${BASE_URL}/api/v1${config?.path}`, {
                method: 'GET',
                headers: mergedHeaders,
                dispatcher: this.__currentDispatcher
            });

            return await this.__handleResponse<T>(`${BASE_URL}/api/v1${config.path}`, body, schema);
        };

        const handler = await this.__withErrorHandler(callback as (config: AllConfigs, schema: z.ZodSchema) => Promise<T>);

        return await handler(config, schema);
    };

    public sendDelete = async <T>(config: DeleteRequestConfig, schema: z.ZodSchema): Promise<T> => {
        const callback = async (config: DeleteRequestConfig, schema: z.ZodSchema) => {
            const { body } = await request(`${BASE_URL}/api/v1${config?.path}`, {
                method: 'DELETE',
                headers: this.__headers,
                dispatcher: this.__currentDispatcher
            });

            return await this.__handleResponse<T>(`${BASE_URL}/api/v1${config.path}`, body, schema);
        };

        const handler = await this.__withErrorHandler(callback as (config: AllConfigs, schema: z.ZodSchema) => Promise<T>);

        return await handler(config, schema);
    };

    public sendPost = async <T>(config: PostRequestConfig, schema: z.ZodSchema): Promise<T> => {
        const callback = async (config: PostRequestConfig, schema: z.ZodSchema): Promise<T> => {
            const { body } = await request(`${BASE_URL}/api/v1${config?.path}`, {
                method: 'POST',
                headers: await this.__configurePostHeaders(Buffer.from(config.body), config.contentType),
                body: config.body,
                dispatcher: this.__currentDispatcher
            });

            return await this.__handleResponse<T>(`${BASE_URL}/api/v1${config.path}`, body, schema);
        };

        const handler = await this.__withErrorHandler(callback as (config: AllConfigs, schema: z.ZodSchema) => Promise<T>);

        return await handler(config, schema);
    };

    public sendEarlyPost = async <T>(config: PostRequestConfig, schema: z.ZodSchema): Promise<T> => {
        const callback = async (config: PostRequestConfig, schema: z.ZodSchema): Promise<T> => {
            const bufferedBody = Buffer.from(config.body);

            const { body } = await request(`${BASE_URL}/api/v1${config?.path}`, {
                method: 'POST',
                headers: this.__configureHeaders(bufferedBody, config.contentType),
                body: bufferedBody,
                dispatcher: this.__currentDispatcher
            });

            return await this.__handleResponse<T>(`${BASE_URL}/api/v1${config.path}`, body, schema);
        };

        const handler = await this.__withErrorHandler(callback as (config: AllConfigs, schema: z.ZodSchema) => Promise<T>);

        return await handler(config, schema);
    }

    public sendUrlEncoded = async <T>(config: UrlEncodedRequestConfig, schema: z.ZodSchema): Promise<T> => {
        return this.sendEarlyPost<T>({
            path: config.path,
            body: EMPTY_BODY,
            contentType: config.contentType
        }, schema);
    };

    public sendBuffer = async <T>(config: BufferRequestConfig, schema: z.ZodSchema): Promise<T> => {
        const callback = async (config: BufferRequestConfig, schema: z.ZodSchema): Promise<T> => {
            const { body } = await request(`${BASE_URL}/api/v1${config?.path}`, {
                method: 'POST',
                headers: this.__configureHeaders(config.body, config.contentType),
                body: config.body,
                dispatcher: this.__currentDispatcher
            });

            return await this.__handleResponse<T>(`${BASE_URL}/api/v1${config.path}`, body, schema);
        };

        const handler = await this.__withErrorHandler(callback as (config: AllConfigs, schema: z.ZodSchema) => Promise<T>);

        return await handler(config, schema);
    };
};