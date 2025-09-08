import { z } from 'zod';

import { UserSchema } from './user';

export const MessageSchema = z.object({
  includedInSummary: z.boolean(),
  uid: z.string(),
  author: UserSchema.nullable().optional(),
  isHidden: z.boolean(),
  messageId: z.string(),
  mediaType: z.number(),
  content: z.string().nullable().optional(),
  clientRefId: z.number(),
  threadId: z.string(),
  createdTime: z.string(),
  type: z.number(),
  mediaValue: z.string().nullable(),
  extensions: z.object({
    replyMessageId: z.string().nullable(),
    replyMessage: z.object({
      author: UserSchema.nullable().optional(),
    }).nullable().optional(),
    linkSnippetList: z.array(z.object({
      body: z.string().nullable(),
      title: z.string().nullable(),
      favicon: z.string().nullable(),
      source: z.string().nullable(),
      link: z.string(),
      deepLink: z.string().nullable(),
      mediaList: z.array(z.tuple([z.number(), z.string(), z.null()])).nullable()
    })).optional().nullable()
  }).nullable().optional()
});

export type Message = z.infer<typeof MessageSchema>;
