import { Dispatcher, Pool, ProxyAgent, request } from 'undici';
import { z } from 'zod';
import BodyReadable from 'undici/types/readable';

import { API_HEADERS, BASE_URL, EMPTY_BODY, GENERATORS_HEADERS, GENERATORS_URL } from '../constants';
import { HeadersType, MayUndefined, Safe } from '../private';
import { generateHMAC } from '../utils/crypt';
import { BufferRequestConfig, DeleteRequestConfig, GenerateECDSAResponseSchema, GetElapsedRealtime, GetElapsedRealtimeSchema, GetPublicKeyCredentialsResponse, GetPublicKeyCredentialsResponseSchema, GetRequestConfig, PostRequestConfig, RawRequestConfig, UrlEncodedRequestConfig } from '../schemas/httpworkflow';
import { BasicResponseSchema } from '../schemas/responses/basic';
import { LOGGER } from '../utils/logger';
import { isStatusOk } from '../utils/utils';
import { AminoDorksAPIError } from '../exceptions/api';
import { socksDispatcher, SocksProxies } from 'fetch-socks';
import { DorksAPIError } from '../exceptions/dorks';

export class HttpWorkflow {
    private __headers: HeadersType = API_HEADERS;
    private __generatorsHeaders: HeadersType = GENERATORS_HEADERS;

    private readonly __generatorsPool: Pool;
    private __currentDispatcher: MayUndefined<ProxyAgent>;

    constructor(apiKey: string, deviceId: string) {
        this.__generatorsHeaders['Authorization'] = apiKey;
        this.headers = { NDCDEVICEID: deviceId };

        this.__generatorsPool = new Pool(GENERATORS_URL);
    };

    set headers(headers: HeadersType) {
        this.__headers = {
            ...this.__headers,
            ...headers
        };
    };

    set proxy(proxy: SocksProxies) {
        if (this.__currentDispatcher) this.__currentDispatcher.close();

        this.__currentDispatcher = socksDispatcher(proxy, {
            connect: {
                rejectUnauthorized: false
            }
        });
        LOGGER.info({ proxy }, 'Set proxy.');
    };

    private __generateECDSA = async (payloadBody: Safe<string>): Promise<string> => {
        const { body } = await this.__generatorsPool.request({
            path: '/api/v1/signature/ecdsa',
            method: 'POST',
            headers: this.__generatorsHeaders,
            body: JSON.stringify({
                payload: payloadBody,
                userId: this.__headers['AUID']
            })
        });

        const response = GenerateECDSAResponseSchema.parse(await body.json());

        if (!response.ECDSA) throw new DorksAPIError(response.message);

        return response.ECDSA;
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

        configuredHeaders['NDC-MESSAGE-SIGNATURE'] = (await this.__generateECDSA(body.toString('utf-8')));

        return configuredHeaders;
    };

    private __handleResponse = async <T>(statusCode: number, fullPath: string, body: BodyReadable & Dispatcher.BodyMixin, schema: z.ZodSchema): Promise<T> => {
        let rawBody;
        
        try {
            rawBody = await body.json();
        } catch {
            if (!isStatusOk(statusCode)) AminoDorksAPIError.throw(statusCode);
            rawBody = await body.text();
        };

        const responseSchema = BasicResponseSchema.parse(rawBody);
        LOGGER.child({ path: fullPath }).info(responseSchema['api:statuscode']);

        if (responseSchema['api:statuscode'] != 0) AminoDorksAPIError.throw(responseSchema['api:statuscode']);

        return schema.parse(rawBody) as T;
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

        const response = GetPublicKeyCredentialsResponseSchema.parse(await body.json());

        if (!response.credentials) throw new DorksAPIError(response.message);

        return response;
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
        const { statusCode, body } = await request(`${BASE_URL}/api/v1${config?.path}`, {
            method: config?.method || 'GET',
            headers: {
                ...this.__headers,
                ...config?.headers
            },
            dispatcher: this.__currentDispatcher
        });

        return await this.__handleResponse<T>(statusCode, `${BASE_URL}/api/v1${config?.path}`, body, schema);
    };

    public sendGet = async <T>(config: GetRequestConfig, schema: z.ZodSchema): Promise<T> => {
        const mergedHeaders: HeadersType = JSON.parse(JSON.stringify(this.__headers));

        if (config.contentType) mergedHeaders['Content-Type'] = config.contentType
        
        const { statusCode, body } = await request(`${BASE_URL}/api/v1${config?.path}`, {
            method: 'GET',
            headers: mergedHeaders,
            dispatcher: this.__currentDispatcher
        });

        return await this.__handleResponse<T>(statusCode, `${BASE_URL}/api/v1${config.path}`, body, schema);
    };

    public sendDelete = async <T>(config: DeleteRequestConfig, schema: z.ZodSchema): Promise<T> => {
        const { statusCode, body } = await request(`${BASE_URL}/api/v1${config?.path}`, {
            method: 'DELETE',
            headers: this.__headers,
            dispatcher: this.__currentDispatcher
        });

        return await this.__handleResponse<T>(statusCode, `${BASE_URL}/api/v1${config.path}`, body, schema);
    };

    public sendPost = async <T>(config: PostRequestConfig, schema: z.ZodSchema): Promise<T> => {
        const { statusCode, body } = await request(`${BASE_URL}/api/v1${config?.path}`, {
            method: 'POST',
            headers: await this.__configurePostHeaders(Buffer.from(config.body), config.contentType),
            body: config.body,
            dispatcher: this.__currentDispatcher
        });

        return await this.__handleResponse<T>(statusCode, `${BASE_URL}/api/v1${config.path}`, body, schema);
    };

    public sendEarlyPost = async <T>(config: PostRequestConfig, schema: z.ZodSchema): Promise<T> => {
        const bufferedBody = Buffer.from(config.body);

        const { statusCode, body } = await request(`${BASE_URL}/api/v1${config?.path}`, {
            method: 'POST',
            headers: this.__configureHeaders(bufferedBody, config.contentType),
            body: bufferedBody,
            dispatcher: this.__currentDispatcher
        });

        return await this.__handleResponse<T>(statusCode, `${BASE_URL}/api/v1${config.path}`, body, schema);
    }

    public sendUrlEncoded = async <T>(config: UrlEncodedRequestConfig, schema: z.ZodSchema): Promise<T> => {
        return this.sendEarlyPost<T>({
            path: config.path,
            body: EMPTY_BODY,
            contentType: config.contentType
        }, schema);
    };

    public sendBuffer = async <T>(config: BufferRequestConfig, schema: z.ZodSchema): Promise<T> => {
        const { statusCode, body } = await request(`${BASE_URL}/api/v1${config?.path}`, {
            method: 'POST',
            headers: this.__configureHeaders(config.body, config.contentType),
            body: config.body,
            dispatcher: this.__currentDispatcher
        });

        return await this.__handleResponse<T>(statusCode, `${BASE_URL}/api/v1${config.path}`, body, schema);
    };
};