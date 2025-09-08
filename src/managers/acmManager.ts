import { APIManager } from '../interfaces/manager';
import { HttpWorkflow } from '../core/httpworkflow';
import { Safe } from '../private';
import { BasicResponse, BasicResponseSchema } from '../schemas/responses/basic';
import { getIconCredentials, getMediaCredentials } from '../utils/utils';

export class ACMManager implements APIManager {
    endpoint: Safe<string>;

    private readonly __httpWorkflow: HttpWorkflow;

    constructor(ndcId: Safe<number>, httpWorkflow: HttpWorkflow) {
        this.endpoint = `/x${ndcId}/s`;
        this.__httpWorkflow = httpWorkflow;
    };

    public setEndpoint = async (enpoint: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/community/settings`,
            body: JSON.stringify({
                enpoint,
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public icon = async (icon: Safe<string>, width: Safe<number>, height: Safe<number>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/community/settings`,
            body: JSON.stringify({
                icon: getIconCredentials(icon, width, height),
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public media = async (media: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/community/settings`,
            body: JSON.stringify({
                promotionalMediaList: getMediaCredentials(media),
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public name = async (name: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/community/settings`,
            body: JSON.stringify({
                name,
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public tagline = async (tagline: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/community/settings`,
            body: JSON.stringify({
                tagline,
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public content = async (content: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/community/settings`,
            body: JSON.stringify({
                content,
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public giveCuratorship = async (userId: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendUrlEncoded<BasicResponse>({
            path: `${this.endpoint}/user-profile/${userId}/curator`,
            contentType: 'application/x-www-form-urlencoded',
        }, BasicResponseSchema);
    };

    public giveLeadership = async (userId: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendUrlEncoded<BasicResponse>({
            path: `${this.endpoint}/user-profile/${userId}/leader`,
            contentType: 'application/x-www-form-urlencoded',
        }, BasicResponseSchema);
    };
};