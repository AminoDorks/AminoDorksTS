import { z } from 'zod';

import { UserSchema } from './user';

export const BlogSchema = z.object({
  globalVotesCount: z.number(),
  globalVotedValue: z.number(),
  votedValue: z.number(),
  keywords: z.string(),
  mediaList: z.nullable(z.array(z.tuple([z.number(), z.string(), z.null()]))),
  style: z.number(),
  totalQuizPlayCount: z.number(),
  title: z.string(),
  tipInfo: z.object({
    tipMaxCoin: z.number(),
    tippersCount: z.number(),
    tippable: z.boolean(),
    tipMinCoin: z.number(),
    tippedCoins: z.number(),
  }),
  contentRating: z.number(),
  content: z.string(),
  needHidden: z.boolean(),
  guestVotesCount: z.number(),
  type: z.number(),
  status: z.number(),
  globalCommentsCount: z.number(),
  modifiedTime: z.string().optional(),
  totalPollVoteCount: z.number(),
  blogId: z.string(),
  viewCount: z.number(),
  language: z.nullable(z.string()),
  author: UserSchema,
  votesCount: z.number(),
  ndcId: z.number(),
  createdTime: z.string(),
  endTime: z.nullable(z.string()),
  commentsCount: z.number(),
});

export type Blog = z.infer<typeof BlogSchema>;