import { z } from 'zod';

import { UserSchema } from './user';

export const ItemSchema = z.object({
  itemId: z.string(),
  status: z.number(),
  style: z.number(),
  globalCommentsCount: z.number(),
  modifiedTime: z.string(),
  votedValue: z.number(),
  globalVotesCount: z.number(),
  globalVotedValue: z.number(),
  author: UserSchema,
  contentRating: z.number(),
  label: z.string(),
  content: z.string(),
  keywords: z.string().nullable(),
  needHidden: z.boolean(),
  guestVotesCount: z.number(),
  votesCount: z.number(),
  createdTime: z.string(),
  mediaList: z.array(z.tuple([z.number(), z.string(), z.null()])).nullable(),
  commentsCount: z.number(),
});

export type Item = z.infer<typeof ItemSchema>;