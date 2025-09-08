import { z } from 'zod';

export const AgentSchema = z.object({
  status: z.number().nullable(),
  isNicknameVerified: z.boolean(),
  uid: z.string(),
  level: z.number(),
  followingStatus: z.number(),
  accountMembershipStatus: z.number(),
  isGlobal: z.boolean(),
  membershipStatus: z.number(),
  reputation: z.number(),
  membersCount: z.number(),
  nickname: z.string().nullable(),
  icon: z.string().nullable(),
});

export const TopicSchema = z.object({
  topicId: z.number(),
  style: z.object(),
  name: z.string(),
});

export const ThemePackSchema = z.object({
  themeColor: z.string(),
  themePackHash: z.string(),
  themePackRevision: z.number(),
  themePackUrl: z.string(),
});

export const CommunitySchema = z.object({
  userAddedTopicList: z.nullable(z.array(TopicSchema)),
  agent: AgentSchema.nullable(),
  listedStatus: z.number(),
  probationStatus: z.number(),
  membersCount: z.number(),
  primaryLanguage: z.string(),
  communityHeat: z.number(),
  strategyInfo: z.string().optional(),
  tagline: z.string(),
  joinType: z.number(),
  status: z.number(),
  themePack: ThemePackSchema,
  modifiedTime: z.string(),
  ndcId: z.number(),
  link: z.string(),
  icon: z.string(),
  updatedTime: z.string(),
  endpoint: z.string(),
  name: z.string(),
  templateId: z.number(),
  createdTime: z.string(),
  content: z.string().nullable().optional()
});

export type Agent = z.infer<typeof AgentSchema>;
export type Topic = z.infer<typeof TopicSchema>;
export type ThemePack = z.infer<typeof ThemePackSchema>;
export type Community = z.infer<typeof CommunitySchema>;