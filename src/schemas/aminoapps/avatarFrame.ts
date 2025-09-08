import { z } from 'zod';

export const AvatarFrameSchema = z.object({
    status: z.number(),
    ownershipStatus: z.number().nullable(),
    version: z.number(),
    resourceUrl: z.string(),
    name: z.string(),
    icon: z.string().nullable(),
    frameType: z.number(),
    frameId: z.string(),
});