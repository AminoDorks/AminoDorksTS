import { z } from 'zod';

export const LotteryLogSchema = z.object({
    awardValue: z.number(),
    createdTime: z.string(),
    awardType: z.number()
});

export type LotteryLog = z.infer<typeof LotteryLogSchema>;