import { z } from 'zod';

import { BasicResponseSchema } from './basic';
import { UserSchema } from '../aminoapps/user';
import { LinkInfoSchema } from '../aminoapps/link';
import { CommunitySchema } from '../aminoapps/community';
import { WalletSchema } from '../aminoapps/wallet';
import { TransactionSchema } from '../aminoapps/transaction';

export const LoginResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    sid: z.string(),
    userProfile: UserSchema
});

export const GetAccountResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    account: UserSchema
});

export const UploadMediaResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    mediaValue: z.string()
});

export const LinkResolutionResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    linkInfoV2: z.object({
        path: z.string(),
        extensions: z.object({
            linkInfo: LinkInfoSchema
        })
    })
});

export const CommunityResolutionResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    linkInfoV2: z.object({
        path: z.string(),
        extensions: z.object({
            community: CommunitySchema
        })
    })
});

export const GetCommunitiesResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    communityList: z.array(CommunitySchema)
});

export const SearchCommunityResponseSchema = z.object({
    resultList: z.array(z.object({
        objectType: z.number(),
        refObject: CommunitySchema,
        aminoId: z.string(),
        objectId: z.string(),
        ndcId: z.number()
    }))
});

export const GetWalletResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    wallet: WalletSchema
});

export const GetWalletHistoryResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    coinHistoryList: z.array(TransactionSchema)
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type GetAccountResponse = z.infer<typeof GetAccountResponseSchema>;
export type UploadMediaResponse = z.infer<typeof UploadMediaResponseSchema>;
export type LinkResolutionResponse = z.infer<typeof LinkResolutionResponseSchema>;
export type CommunityResolutionResponse = z.infer<typeof CommunityResolutionResponseSchema>;
export type GetCommunitiesResponse = z.infer<typeof GetCommunitiesResponseSchema>;
export type SearchCommunityResponse = z.infer<typeof SearchCommunityResponseSchema>;
export type GetWalletResponse = z.infer<typeof GetWalletResponseSchema>;
export type GetWalletHistoryResponse = z.infer<typeof GetWalletHistoryResponseSchema>;