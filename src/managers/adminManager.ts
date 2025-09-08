import { APIManager } from '../interfaces/manager';
import { HttpWorkflow } from '../core/httpworkflow';
import { Safe } from '../private';
import { FeatureDuration, PostType } from '../public';
import { BasicResponse, BasicResponseSchema } from '../schemas/responses/basic';
import { CustomTitle } from '../schemas/aminoapps/customTitle';

export class AdminManager implements APIManager {
    endpoint: Safe<string>;

    private readonly __httpWorkflow: HttpWorkflow;

    constructor(ndcId: Safe<number>, httpWorkflow: HttpWorkflow) {
        this.endpoint = `/x${ndcId}/s`;
        this.__httpWorkflow = httpWorkflow;
    };

    public ban = async (userId: Safe<string>, reason?: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/user-profile/${userId}/ban`,
            body: JSON.stringify({
                reasonType: null,
                note: {
                    content: reason
                },
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public unban = async (userId: Safe<string>, reason?: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/user-profile/${userId}/unban`,
            body: JSON.stringify({
                note: {
                    content: reason
                },
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public hideUser = async (userId: Safe<string>, reason?: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/user-profile/${userId}/admin`,
            body: JSON.stringify({
                adminOpName: 18,
                adminOpNote: {
                    content: reason
                },
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public unhideUser = async (userId: Safe<string>, reason?: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/user-profile/${userId}/admin`,
            body: JSON.stringify({
                adminOpName: 19,
                adminOpNote: {
                    content: reason
                },
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public hideThread = async (threadId: Safe<string>, reason?: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/chat/thread/${threadId}/admin`,
            body: JSON.stringify({
                adminOpName: 110,
                adminOpValue: 9,
                adminOpNote: {
                    content: reason
                },
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public unhideThread = async (threadId: Safe<string>, reason?: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/chat/thread/${threadId}/admin`,
            body: JSON.stringify({
                adminOpName: 110,
                adminOpValue: 0,
                adminOpNote: {
                    content: reason
                },
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public hidePost = async (objectId: Safe<string>, postType: PostType, reason?: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/${postType}/${objectId}/admin`,
            body: JSON.stringify({
                adminOpName: 110,
                adminOpValue: 9,
                adminOpNote: {
                    content: reason
                },
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public unhidePost = async (objectId: Safe<string>, postType: PostType, reason?: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/${postType}/${objectId}/admin`,
            body: JSON.stringify({
                adminOpName: 110,
                adminOpValue: 0,
                adminOpNote: {
                    content: reason
                },
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public addFeature = async (userId: Safe<string>, days: FeatureDuration = 1): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/user-profile/${userId}/admin`,
            body: JSON.stringify({
                adminOpName: 114,
                adminOpValue: {
                    featuredType: 4,
                    featuredDuration: days * 86400
                },
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public deleteFeature = async (userId: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/user-profile/${userId}/admin`,
            body: JSON.stringify({
                adminOpName: 114,
                adminOpValue: {
                    featuredType: 0
                },
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public manageTitles = async (userId: Safe<string>, titles: Safe<CustomTitle[]>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/user-profile/${userId}/admin`,
            body: JSON.stringify({
                adminOpName: 207,
                adminOpValue: {
                    titles: [...titles]
                },
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public warn = async (userId: Safe<string>, title: Safe<string>, content: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/notice`,
            body: JSON.stringify({
                targetUid: userId,
                title: title,
                content: content,
                attachedObject: {
                    objectId: userId,
                    objectType: 0
                },
                penaltyType: 0,
                adminOpNote: {},
                noticeType: 7,
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public strike = async (userId: Safe<string>, title: Safe<string>, content: Safe<string>, duration: Safe<number> = 86400): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/notice`,
            body: JSON.stringify({
                targetUid: userId,
                title: title,
                content: content,
                attachedObject: {
                    objectId: userId,
                    objectType: 0
                },
                penaltyType: 1,
                penaltyValue: duration,
                adminOpNote: {},
                noticeType: 7,
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };
};