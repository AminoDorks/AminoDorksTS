import { z } from 'zod';

export const TransactionSchema = z.object({
    bonusCoins: z.number().nullable().optional(),
    bonusCoinsFloat: z.number().nullable().optional(),
    changedCoins: z.number(),
    changedCoinsFloat: z.number(),
    createdTime: z.string(),
    extData: z.object({
        description: z.string(),
        icon: z.string().nullable().optional(),
        objectDeeplinkUrl: z.string().nullable().optional(),
        otherHumanUid: z.string().optional(),
        subtitle: z.string().optional(),
    }).optional(),
    isPositive: z.boolean(),
    originCoins: z.number(),
    originCoinsFloat: z.number(),
    sourceType: z.number(),
    taxCoins: z.number().nullable(),
    taxCoinsFloat: z.number().nullable(),
    totalCoins: z.number(),
    totalCoinsFloat: z.number(),
    uid: z.string(),
});

export type Transaction = z.infer<typeof TransactionSchema>;