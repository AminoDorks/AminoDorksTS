import { z } from 'zod';
import { CustomTitleSchema } from './customTitle';
import { AvatarFrameSchema } from './avatarFrame';

export const UserSchema = z.object({
  status: z.number(),
  itemsCount: z.number().optional(),
  uid: z.string(),
  modifiedTime: z.string().optional(),
  avatarFrame: AvatarFrameSchema.nullable().optional(),
  followingStatus: z.number().optional(),
  onlineStatus: z.number().optional(),
  accountMembershipStatus: z.number().optional(),
  isGlobal: z.boolean().optional(),
  reputation: z.number().optional(),
  postsCount: z.number().optional(),
  membersCount: z.number().optional(),
  nickname: z.string(),
  icon: z.string().nullable(),
  isNicknameVerified: z.boolean().optional(),
  mood: z.string().nullable().optional(),
  level: z.number().optional(),
  notificationSubscriptionStatus: z.number().optional(),
  pushEnabled: z.boolean().optional(),
  membershipStatus: z.number().optional(),
  joinedCount: z.number().optional(),
  role: z.number(),
  commentsCount: z.number().optional(),
  aminoId: z.string().optional(),
  ndcId: z.number().optional(),
  createdTime: z.string().optional(),
  storiesCount: z.number().optional(),
  blogsCount: z.number().optional(),
  extensions: z.object({
    customTitles: z.array(CustomTitleSchema).nullable().optional()
  }).nullable().optional()
});

export type User = z.infer<typeof UserSchema>;