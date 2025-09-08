import { z } from 'zod';

import { UserSchema } from './user';

export const InviteCodeSchema = z.object({
    status: z.number(),
    duration: z.number(),
    invitationId: z.string(),
    link: z.string(),
    modifiedTime: z.string(),
    ndcId: z.number(),
    createdTime: z.string(),
    inviteCode: z.string(),
    author: UserSchema.optional()
});

export type InviteCode = z.infer<typeof InviteCodeSchema>;