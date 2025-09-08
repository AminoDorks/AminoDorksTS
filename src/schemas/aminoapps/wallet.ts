import { z } from 'zod';

export const WalletSchema = z.object({
    totalCoinsFloat: z.number(),
    adsEnabled: z.boolean(),
    adsFlags: z.number(),
    totalCoins: z.number(),
    businessCoinsEnabled: z.boolean(),
    totalBusinessCoins: z.number(),
    totalBusinessCoinsFloat: z.number(),
});

export type Wallet = z.infer<typeof WalletSchema>;