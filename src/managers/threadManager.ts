import { APIManager } from '../interfaces/manager';
import { HttpWorkflow } from '../core/httpworkflow';
import { Safe } from '../private';
import { Thread } from '../schemas/aminoapps/thread';
import { MessagesResponse, MessagesResponseSchema, ThreadResponse, ThreadResponseSchema, ThreadsResponse, ThreadsResponseSchema } from '../schemas/responses/ndc';
import { CreateThreadBuilder, EditThreadBuilder, Embed, LinkSnippet, MessageSettings, StartSize, Status, ThreadType } from '../public';
import { BasicResponse, BasicResponseSchema } from '../schemas/responses/basic';
import { Account } from '../schemas/aminodorks';
import { formatMedia } from '../utils/utils';

export class ThreadManager implements APIManager {
    endpoint: Safe<string>;

    private readonly __account: Account;
    private readonly __httpWorkflow: HttpWorkflow;

    constructor(ndcId: Safe<number>, account: Account, httpWorkflow: HttpWorkflow) {
        this.endpoint = `/x${ndcId}/s`;
        this.__account = account;
        this.__httpWorkflow = httpWorkflow;
    };

    public get = async (threadId: Safe<string>): Promise<Thread> => {
        return (await this.__httpWorkflow.sendGet<ThreadResponse>({
            path: `${this.endpoint}/chat/thread/${threadId}`
        }, ThreadResponseSchema)).thread;
    };

    public getMany = async (startSize: StartSize = { start: 0, size: 25 }): Promise<Thread[]> => {
        return (await this.__httpWorkflow.sendGet<ThreadsResponse>({
            path: `${this.endpoint}/chat/thread?type=joined-me&start=${startSize.start}&size=${startSize.size}`
        }, ThreadsResponseSchema)).threadList;
    };

    public getManyPublic = async (startSize: StartSize = { start: 0, size: 25 }, threadType: ThreadType = 'recommended'): Promise<Thread[]> => {
        return (await this.__httpWorkflow.sendGet<ThreadsResponse>({
            path: `${this.endpoint}/chat/thread?type=public-all&filterType=${threadType}&start=${startSize.start}&size=${startSize.size}`
        }, ThreadsResponseSchema)).threadList;
    };

    public join = async (threadId: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendUrlEncoded<BasicResponse>({
            path: `${this.endpoint}/chat/thread/${threadId}/member/${this.__account.user.uid}`,
            contentType: 'application/x-www-form-urlencoded'
        }, BasicResponseSchema);
    };

    public leave = async (threadId: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendDelete<BasicResponse>({
            path: `${this.endpoint}/chat/thread/${threadId}/member/${this.__account.user.uid}`
        }, BasicResponseSchema);
    };

    public create = async (builder: CreateThreadBuilder): Promise<Thread> => {
        return (await this.__httpWorkflow.sendPost<ThreadResponse>({
            path: `${this.endpoint}/chat/thread`,
            body: JSON.stringify({
                ...builder,
                timestamp: Date.now(),
                type: 0,
                publishToGlobal: 0
            })
        }, ThreadResponseSchema)).thread;
    };

    public edit = async (threadId: Safe<string>, builder: EditThreadBuilder): Promise<Thread> => {
        return (await this.__httpWorkflow.sendPost<ThreadResponse>({
            path: `${this.endpoint}/chat/thread/${threadId}`,
            body: JSON.stringify({
                timestamp: Date.now(),
                title: builder.title,
                content: builder.content,
                icon: builder.thumbnail,
                keywords: builder.keywords,
                extensions: {
                    announcement: builder.announcement,
                    pinAnnouncement: builder.pinAnnouncement
                }
            })
        }, ThreadResponseSchema)).thread;
    };

    public setBackground = async (threadId: Safe<string>, url: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/chat/thread/${threadId}/member/${this.__account.user.uid}/background`,
            body: JSON.stringify({
                media: [100, url, null],
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public addCoHosts = async (threadId: Safe<string>, coHosts: Safe<string[]>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/chat/thread/${threadId}/co-host`,
            body: JSON.stringify({
                uidList: coHosts,
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public setViewOnly = async (threadId: Safe<string>, status: Status): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendUrlEncoded<BasicResponse>({
            path: `${this.endpoint}/chat/thread/${threadId}/view-only/${status}`,
            contentType: 'application/x-www-form-urlencoded'
        }, BasicResponseSchema);
    };

    public setCanInvite = async (threadId: Safe<string>, status: Status): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendUrlEncoded<BasicResponse>({
            path: `${this.endpoint}/chat/thread/${threadId}/members-can-invite/${status}`,
            contentType: 'application/x-www-form-urlencoded'
        }, BasicResponseSchema);
    };

    public setCanTip = async (threadId: Safe<string>, status: Status): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendUrlEncoded<BasicResponse>({
            path: `${this.endpoint}/chat/thread/${threadId}/tipping-perm-status/${status}`,
            contentType: 'application/x-www-form-urlencoded'
        }, BasicResponseSchema);
    };

    public invite = async (threadId: Safe<string>, userIds: Safe<string[]>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/chat/thread/${threadId}/member/invite`,
            body: JSON.stringify({
                uids: userIds,
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public messages = async (threadId: Safe<string>, size: Safe<number> = 25): Promise<MessagesResponse> => {
        return await this.__httpWorkflow.sendGet<MessagesResponse>({
            path: `${this.endpoint}/chat/thread/${threadId}/message?v=2&pagingType=t&size=${size}`
        }, MessagesResponseSchema);
    };

    public pagedMessages = async (threadId: Safe<string>, pageToken: Safe<string>, size: Safe<number> = 25): Promise<MessagesResponse> => {
        return await this.__httpWorkflow.sendGet<MessagesResponse>({
            path: `${this.endpoint}/chat/thread/${threadId}/message?v=2&pagingType=t&pageToken=${pageToken}&size=${size}`
        }, MessagesResponseSchema);
    };

    public sendMessage = async (threadId: Safe<string>, content: Safe<string>, settings: MessageSettings = { messageType: 0 }): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/chat/thread/${threadId}/message`,
            body: JSON.stringify({
                type: settings.messageType || 0,
                content: content,
                attachedObject: null,
                clientRefId: 404354928,
                timestamp: Date.now(),
                uid: this.__account.user.uid,
                extensions: {mentionedArray: settings.mentionedArray || []},
                replyMessageId: settings.replyMessageId
            })
        }, BasicResponseSchema);
    };

    public sendEmbed = async (threadId: Safe<string>, content: Safe<string>, embed: Embed, settings: MessageSettings = { messageType: 0 }): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/chat/thread/${threadId}/message`,
            body: JSON.stringify({
                type: settings.messageType,
                content: content,
                attachedObject: {
                    objectId: embed.id,
                    objecttype: embed.type,
                    link: embed.link,
                    title: embed.title,
                    content: embed.content,
                    mediaList: formatMedia(embed.thumbnail)
                },
                clientRefId: 404354928,
                timestamp: Date.now(),
                uid: this.__account.user.uid,
                extensions: {mentionedArray: settings.mentionedArray || []},
                replyMessageId: settings.replyMessageId
            })
        }, BasicResponseSchema);
    };

    public sendLinkSnippet = async (threadId: Safe<string>, content: Safe<string>, linkSnippet: LinkSnippet, settings: MessageSettings = { messageType: 0 }): Promise<BasicResponse> => {
         return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/chat/thread/${threadId}/message`,
            body: JSON.stringify({
                type: settings.messageType,
                content: content,
                attachedObject: null,
                clientRefId: 404354928,
                timestamp: Date.now(),
                uid: this.__account.user.uid,
                extensions: {
                    mentionedArray: settings.mentionedArray || [],
                    linkSnippetList: [
                        {
                            link: linkSnippet.link,
                            mediaType: 100,
                            mediaUploadValue: linkSnippet.media.toString('base64'),
                            mediaUploadValueContentType: 'image/jpg'
                        }
                    ]
                },
                replyMessageId: settings.replyMessageId
            })
        }, BasicResponseSchema);
    };

    public sendImage = async (threadId: Safe<string>, file: Safe<Buffer>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/chat/thread/${threadId}/message`,
            body: JSON.stringify({
                type: 0,
                mediaType: 100,
                mediaUploadValueContentType: 'image/jpg',
                mediaUhqEnabled: true,
                mediaUploadValue: file.toString('base64'),
                content: null,
                clientRefId: 404354928,
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };
    
    public sendAudio = async (threadId: Safe<string>, file: Safe<Buffer>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/chat/thread/${threadId}/message`,
            body: JSON.stringify({
                type: 2,
                mediaType: 110,
                mediaUploadValue: file.toString('base64'),
                content: null,
                clientRefId: 404354928,
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public deleteMessage = async (threadId: Safe<string>, messageId: Safe<string>): Promise<BasicResponse> => {
        return this.__httpWorkflow.sendDelete<BasicResponse>({
            path: `${this.endpoint}/chat/thread/${threadId}/message/${messageId}`
        }, BasicResponseSchema);
    };

    public transferHost = async (threadId: Safe<string>, userIds: Safe<string[]>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/chat/thread/${threadId}/transfer-organizer`,
            body: JSON.stringify({
                uidList: userIds,
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public acceptHost = async (threadId: Safe<string>, requestId: Safe<string>): Promise<BasicResponse> => {
        return this.__httpWorkflow.sendUrlEncoded<BasicResponse>({
            path: `${this.endpoint}/chat/thread/${threadId}/transfer-organizer/${requestId}/accept`,
            contentType: 'application/x-www-form-urlencoded'
        }, BasicResponseSchema);
    };

    public inviteToVoice = async (threadId: Safe<string>, userId: Safe<string>): Promise<BasicResponse> => {
        return this.__httpWorkflow.sendUrlEncoded<BasicResponse>({
            path: `${this.endpoint}/chat/thread/${threadId}/member/${userId}/invite-av-chat`,
            contentType: 'application/x-www-form-urlencoded'
        }, BasicResponseSchema);
    };
};