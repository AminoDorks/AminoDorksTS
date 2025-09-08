import { z } from 'zod';

import { UserSchema } from './user';

export const ThreadSchema = z.object({
  uid: z.string(),
  membersQuota: z.number(),
  membersSummary: z.array(
    z.object({
      uid: z.string(),
      role: z.number(),
      nickname: z.string(),
      icon: z.string().nullable().optional(),
    })
  ),
  threadId: z.string(),
  keywords: z.nullable(z.string()),
  membersCount: z.number(),
  strategyInfo: z.string(),
  title: z.string().nullable(),
  membershipStatus: z.number(),
  content: z.string().nullable().optional(),
  needHidden: z.boolean(),
  alertOption: z.number(),
  lastReadTime: z.nullable(z.string()),
  type: z.number(),
  status: z.number(),
  publishToGlobal: z.number(),
  modifiedTime: z.nullable(z.string()),
  lastMessageSummary: z.object({
    includedSummary: z.boolean().optional(),
    uid: z.string(),
    isHidden: z.boolean(),
    mediaType: z.number(),
    content: z.string().nullable(),
    threadId: z.string().optional(),
    createdTime: z.string(),
    type: z.number(),
  }),
  condition: z.number(),
  icon: z.string().nullable(),
  latestActivityTime: z.string(),
  author: UserSchema,
  extensions: z.object({
    fansOnly: z.boolean().optional(),
    lastMembersSummaryUpdateTime: z.number().nullable().optional(),
    vvChatJoinType: z.number().optional(),
    visibility: z.number().optional(),
    language: z.string().optional(),
    organizerTransferRequest: z.object({
      createdTime: z.string(),
      requestId: z.string()
    }).optional()
  }),
  ndcId: z.number(),
  createdTime: z.nullable(z.string()),
});

export type Thread = z.infer<typeof ThreadSchema>;