import { z } from 'zod';

import { UserSchema } from './aminoapps/user';

export const AccountSchema = z.object({
    sessionId: z.string(),
    deviceId: z.string().min(82).max(82),
    user: UserSchema
});

export const CachedAccountSchema = z.object({
    account: AccountSchema,
    email: z.email(),
    password: z.string()
});

export const AccountsCacheSchema = z.record(z.string(), CachedAccountSchema);

export type Account = z.infer<typeof AccountSchema>;
export type CachedAccount = z.infer<typeof CachedAccountSchema>;
export type AccountsCache = z.infer<typeof AccountsCacheSchema>;