import { APIManager } from '../interfaces/manager';
import { HttpWorkflow } from '../core/httpworkflow';
import { MayUndefined, Safe } from '../private';
import { EnviromentContext, StartSize, Timers } from '../public';
import { CreateInviteCodeResponse, CreateInviteCodeResponseSchema, GetCommunityResponse, GetCommunityResponseSchema, GetInviteCodesResponse, GetInviteCodesResponseSchema, IdentifyInvitationResponse, IdentifyInvitationResponseSchema } from '../schemas/responses/ndc';
import { GetCommunitiesResponse, GetCommunitiesResponseSchema, SearchCommunityResponse, SearchCommunityResponseSchema } from '../schemas/responses/global';
import { BasicResponse, BasicResponseSchema } from '../schemas/responses/basic';
import { InviteCode } from '../schemas/aminoapps/inviteCode';
import { INVITE_CODE_DEFAULT_DURATION, ONLINE_DEFAULT_DURATION } from '../constants';
import { LOGGER } from '../utils/logger';
import { getTimezone } from '../utils/utils';
import { Account } from '../schemas/aminodorks';
import { Community } from '../schemas/aminoapps/community';

export class CommunityManager implements APIManager {
    endpoint: Safe<string>;

    private readonly __ndcId: MayUndefined<number>;
    private readonly __account: Account;
    private readonly __httpWorkflow: HttpWorkflow;

    constructor(context: EnviromentContext, account: Account, httpWorkflow: HttpWorkflow) {
        this.endpoint = `/g/s-x${context.ndcId}`;
        this.__ndcId = context.ndcId;
        this.__account = account;
        this.__httpWorkflow = httpWorkflow;
    };

    public get = async (ndcId: Safe<number>): Promise<Community> => {
        return (await this.__httpWorkflow.sendGet<GetCommunityResponse>({
            path: `/g/s-x${ndcId}/community/info?withInfluencerList=1&withTopicList=true&influencerListOrderStrategy=fansCount`
        }, GetCommunityResponseSchema)).community
    };

    public getMany = async (startSize: StartSize = { start: 0, size: 25 }): Promise<Community[]> => {
        return (await this.__httpWorkflow.sendGet<GetCommunitiesResponse>({
            path: `/g/s/community/joined?v=1&start=${startSize.start}&size=${startSize.size}`
        }, GetCommunitiesResponseSchema)).communityList
    };

    public search = async (title: Safe<string>): Promise<SearchCommunityResponse> => {
        return await this.__httpWorkflow.sendGet<SearchCommunityResponse>({
            path: `/g/s/search/amino-id-and-link?q=${title}`
        }, SearchCommunityResponseSchema);
    };

    public join = async (ndcId: Safe<number>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/x${ndcId}/s/community/join`,
            body: JSON.stringify({
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public joinWithInvite = async (ndcId: Safe<number>, inviteCode: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/x${ndcId}/s/community/join`,
            body: JSON.stringify({
                timestamp: Date.now(),
                invitationId: (await this.identifyInvitation(inviteCode)).invitation.invitationId
            })
        }, BasicResponseSchema);
    };

    public leave = async (ndcId: Safe<number>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendUrlEncoded<BasicResponse>({
            path: `/x${ndcId}/s/community/leave`,
            contentType: 'application/x-www-form-urlencoded'
        }, BasicResponseSchema);
    };

    public sendMembershipRequest = async (ndcId: Safe<number>, message?: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/x${ndcId}/s/community/membership-request`,
            body: JSON.stringify({
                    message: message,
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public identifyInvitation = async (inviteCode: Safe<string>): Promise<IdentifyInvitationResponse> => {
        return await this.__httpWorkflow.sendGet<IdentifyInvitationResponse>({
            path: `/g/s/community/link-identify?q=http%3A%2F%2Faminoapps.com%2Finvite%2F${inviteCode}`
        }, IdentifyInvitationResponseSchema);
    };

    public getInviteCodes = async (startSize: StartSize): Promise<InviteCode[]> => {
        if (!this.__ndcId) LOGGER.fatal('ndcId is not defined. Use .as to set ndcId.');

        return (await this.__httpWorkflow.sendGet<GetInviteCodesResponse>({
            path: `${this.endpoint}/community/invitation?status=normal&start=${startSize.start}&size=${startSize.size}`
        }, GetInviteCodesResponseSchema)).communityInvitationList;
    };

    public createInviteCode = async (duration: Safe<number> = INVITE_CODE_DEFAULT_DURATION): Promise<InviteCode> => {
        if (!this.__ndcId) LOGGER.fatal('ndcId is not defined. Use .as to set ndcId.');

        return (await this.__httpWorkflow.sendPost<CreateInviteCodeResponse>({
            path: `${this.endpoint}/community/invitation`,
            body: JSON.stringify({
                duration: duration,
                force: true,
                timestamp: Date.now()
            })
        }, CreateInviteCodeResponseSchema)).communityInvitation;
    };

    public deleteInviteCode = async (invitationId: Safe<string>): Promise<BasicResponse> => {
        if (!this.__ndcId) LOGGER.fatal('ndcId is not defined. Use .as to set ndcId.');

        return await this.__httpWorkflow.sendDelete<BasicResponse>({
            path: `${this.endpoint}/community/invitation/${invitationId}`
        }, BasicResponseSchema);
    };

    public status = async (online: Safe<boolean>, duration: Safe<number> = ONLINE_DEFAULT_DURATION): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/user-profile/${this.__account.user.uid}/online-status`,
            body: JSON.stringify({
                onlineStatus: Number(online),
                duration: duration,
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public sendTimeChunks = async (timers: Timers): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/community/stats/user-active-time`,
            body: JSON.stringify({
                userActiveTimeChunkList: timers,
                optInAdsFlags: 2147483647,
                timezone: getTimezone(),
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };
};