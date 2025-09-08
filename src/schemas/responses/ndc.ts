import { z } from 'zod';

import { BasicResponseSchema } from './basic';
import { CommunitySchema } from '../aminoapps/community';
import { InviteCodeSchema } from '../aminoapps/inviteCode';
import { WalletSchema } from '../aminoapps/wallet';
import { LotteryLogSchema } from '../aminoapps/lotteryLog';
import { BlogSchema } from '../aminoapps/blog';
import { ItemSchema } from '../aminoapps/item';
import { ThreadSchema } from '../aminoapps/thread';
import { MessageSchema } from '../aminoapps/message';
import { UserSchema } from '../aminoapps/user';

export const GetCommunityResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    community: CommunitySchema
});

export const GetInviteCodesResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    communityInvitationList: z.array(InviteCodeSchema)
});

export const CreateInviteCodeResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    communityInvitation: InviteCodeSchema
});

export const PlayLotteryResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    lotteryLog: LotteryLogSchema,
    wallet: WalletSchema
});

export const BlogResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    blog: BlogSchema
});

export const ItemResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    item: ItemSchema
});

export const BlogsResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    blogList: z.array(BlogSchema)
});

export const ItemsResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    itemList: z.array(ItemSchema)
})

export const PublicBlogsResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    blogList: z.array(BlogSchema),
    paging: z.object({
        nextPageToken: z.string(),
        prevPageToken: z.string()
    })
});

export const ThreadResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    thread: ThreadSchema
});

export const ThreadsResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    threadList: z.array(ThreadSchema)
});

export const MessagesResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    messageList: z.array(MessageSchema),
    paging: z.object({
        nextPageToken: z.string(),
        prevPageToken: z.string()
    })
});

export const IdentifyInvitationResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    invitation: InviteCodeSchema
});

export const MembersResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    memberList: z.array(UserSchema)
});

export type GetCommunityResponse = z.infer<typeof GetCommunityResponseSchema>;
export type GetInviteCodesResponse = z.infer<typeof GetInviteCodesResponseSchema>;
export type CreateInviteCodeResponse = z.infer<typeof CreateInviteCodeResponseSchema>;
export type PlayLotteryResponse = z.infer<typeof PlayLotteryResponseSchema>;
export type BlogResponse = z.infer<typeof BlogResponseSchema>;
export type ItemResponse = z.infer<typeof ItemResponseSchema>;
export type BlogsResponse = z.infer<typeof BlogsResponseSchema>;
export type ItemsResponse = z.infer<typeof ItemsResponseSchema>;
export type PublicBlogsResponse = z.infer<typeof PublicBlogsResponseSchema>;
export type ThreadResponse = z.infer<typeof ThreadResponseSchema>;
export type ThreadsResponse = z.infer<typeof ThreadsResponseSchema>;
export type MessagesResponse = z.infer<typeof MessagesResponseSchema>;
export type IdentifyInvitationResponse = z.infer<typeof IdentifyInvitationResponseSchema>;
export type MembersResponse = z.infer<typeof MembersResponseSchema>;