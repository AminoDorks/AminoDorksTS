import { z } from 'zod';

export const LinkInfoSchema = z.object({
    objectId: z.string(),
    targetCode: z.number(),
    ndcId: z.number(),
    fullPath: z.string(),
    shortCode: z.string(),
    objectIdType: z.number().optional()
});

export type LinkInfo = z.infer<typeof LinkInfoSchema>;