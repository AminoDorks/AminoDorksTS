import { z } from 'zod';

import { UserSchema } from './user';

export const CommentSchema = z.object({
    modifiedTime: z.string(),
    ndcId: z.number(),
    votedValue: z.number(),
    parentType: z.number(),
    commentId: z.string(),
    parentNdcId: z.number(),
    votesSum: z.number(),
    author: UserSchema,
    content: z.string(),
    parentId: z.string(),
    createdTime: z.string(),
    subcommentsCount: z.number(),
    type: z.number()
});

export type Comment = z.infer<typeof CommentSchema>;