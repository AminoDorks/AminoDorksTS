import { APIManager } from '../interfaces/manager';
import { HttpWorkflow } from '../core/httpworkflow';
import { MayUndefined, Safe } from '../private';
import { CommentsSorting, EditProfileBuilder, EnviromentContext, StartSize, UsersType } from '../public';
import { User } from '../schemas/aminoapps/user';
import { GetCommentsResponse, GetCommentsResponseSchema, GetUserResponse, GetUserResponseSchema, GetUsersResponse, GetUsersResponseSchema } from '../schemas/responses/implementary';
import { BasicResponse, BasicResponseSchema } from '../schemas/responses/basic';
import { Comment } from '../schemas/aminoapps/comment';
import { Account } from '../schemas/aminodorks';
import { LOGGER } from '../utils/logger';
import { formatMedia } from '../utils/utils';
import { MembersResponse, MembersResponseSchema } from '../schemas/responses/ndc';

export class UserManager implements APIManager {
    endpoint: Safe<string> = '/g/s';

    private readonly __account: Account;
    private readonly __ndcId: MayUndefined<number>;
    private readonly __httpWorkflow: HttpWorkflow;

    constructor(context: EnviromentContext, account: Account, httpWorkflow: HttpWorkflow) {
        if (context.ndcId) this.endpoint = `/x${context.ndcId}/s`;
        this.__ndcId = context.ndcId
        this.__account = account;
        this.__httpWorkflow = httpWorkflow;
    };

    public get = async (userId: Safe<string>): Promise<User> => {
        return (await this.__httpWorkflow.sendGet<GetUserResponse>({
            path: `${this.endpoint}/user-profile/${userId}`
        }, GetUserResponseSchema)).userProfile;
    };

    public getMany = async (startSize: StartSize = { start: 0, size: 50 }, usersType: UsersType = 'recent'): Promise<User[]> => {
        return (await this.__httpWorkflow.sendGet<GetUsersResponse>({
            path: `${this.endpoint}/user-profile?type=${usersType}&start=${startSize.start}&size=${startSize.size}`
        }, GetUsersResponseSchema)).userProfileList;
    };

    public getInOnline = async (startSize: StartSize = { start: 0, size: 50 }): Promise<User[]> => {
        if (!this.__ndcId) LOGGER.fatal('ndcId is not defined. Use .as to set ndcId.');

        return (await this.__httpWorkflow.sendGet<GetUsersResponse>({
            path: `${this.endpoint}/live-layer?topic=ndtopic:x${this.__ndcId}:online-members&start=${startSize.start}&size=${startSize.size}`
        }, GetUsersResponseSchema)).userProfileList;
    };
    
    public getThreadUsers = async (threadId: Safe<string>, startSize: StartSize = { start: 0, size: 100 }): Promise<User[]> => {
        if (!this.__ndcId) LOGGER.fatal('ndcId is not defined. Use .as to set ndcId.');

        return (await this.__httpWorkflow.sendGet<MembersResponse>({
            path: `${this.endpoint}/chat/thread/${threadId}/member?start=${startSize.start}&size=${startSize.size}&type=default&cv=1.2`
        }, MembersResponseSchema)).memberList;
    };

    public edit = async (builder: EditProfileBuilder): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/user-profile/${this.__account.user.uid}`,
            body: JSON.stringify({
                timestamp: Date.now(),
                nickname: builder.nickname,
                icon: builder.avatar,
                content: builder.about,
                extensions: {
                    style: {
                        backgroundMediaList: formatMedia(builder.backgroundMediaList),
                        backgroundColor: builder.backgroundColor
                    }
                }
            })
        }, BasicResponseSchema);
    };

    public applyFrame = async (frameId: Safe<string>, applyToAll: Safe<boolean> = false): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/avatar-frame/apply`,
            body: JSON.stringify({
                frameId: frameId,
                applyToAll: Number(applyToAll),
                timestamp: Date.now()
            })
        }, BasicResponseSchema)
    };

    public kick = async (userId: Safe<string>, threadId: Safe<string>, allowRejoin: Safe<boolean> = false): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendDelete<BasicResponse>({
            path: `${this.endpoint}/chat/thread/${threadId}/member/${userId}?allowRejoin=${Number(allowRejoin)}`
        }, BasicResponseSchema);
    };

    public getFollowing = async (userId: Safe<string>, startSize: StartSize = { start: 0, size: 25 }): Promise<User[]> => {
        return (await this.__httpWorkflow.sendGet<GetUsersResponse>({
            path: `${this.endpoint}/user-profile/${userId}/joined?start=${startSize.start}&size=${startSize.size}`
        }, GetUsersResponseSchema)).userProfileList;
    };

    public getFollowers = async (userId: Safe<string>, startSize: StartSize = { start: 0, size: 25 }): Promise<User[]> => {
        return (await this.__httpWorkflow.sendGet<GetUsersResponse>({
            path: `${this.endpoint}/user-profile/${userId}/member?start=${startSize.start}&size=${startSize.size}`
        }, GetUsersResponseSchema)).userProfileList;
    };

    public getWallComments = async (userId: Safe<string>, sorting: CommentsSorting = 'newest', startSize: StartSize = { start: 0, size: 25 }): Promise<Comment[]> => {
        return (await this.__httpWorkflow.sendGet<GetCommentsResponse>({
            path: `${this.endpoint}user-profile/${userId}/comment?sort=${sorting}&start=${startSize.start}&size=${startSize.size}`
        }, GetCommentsResponseSchema)).commentList;
    };

    public follow = async (userId: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendUrlEncoded<BasicResponse>({
            path: `${this.endpoint}/user-profile/${userId}/member`,
            contentType: 'application/x-www-form-urlencoded'
        }, BasicResponseSchema);
    };

    public followMany = async (userIds: Safe<string[]>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/user-profile/${this.__account.user.uid}/joined`,
            body: JSON.stringify({
                targetUidList: userIds,
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public unfollow = async (userId: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendDelete<BasicResponse>({
            path: `${this.endpoint}/user-profile/${this.__account.user.uid}/joined/${userId}`
        }, BasicResponseSchema);
    };

    public sendComment = async (userId: Safe<string>, content: Safe<string>, respondTo?: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/user-profile/${userId}/comment`,
            body: JSON.stringify({
                content: content,
                type: 0,
                eventSource: 'UserProfileView',
                respondTo: respondTo,
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };
};