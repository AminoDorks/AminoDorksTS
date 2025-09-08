import { z } from 'zod';

import { BasicResponseSchema } from './basic';
import { UserSchema } from '../aminoapps/user';
import { CommentSchema } from '../aminoapps/comment';

export const GetUserResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    userProfile: UserSchema
});

export const GetUsersResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    userProfileList: z.array(UserSchema)
});

export const GetCommentsResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    commentList: z.array(CommentSchema)
});

export type GetUserResponse = z.infer<typeof GetUserResponseSchema>;
export type GetUsersResponse = z.infer<typeof GetUsersResponseSchema>;
export type GetCommentsResponse = z.infer<typeof GetCommentsResponseSchema>;