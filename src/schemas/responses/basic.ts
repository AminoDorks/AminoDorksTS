import { z } from 'zod';

export const BasicResponseSchema = z.object({
    'api:statuscode': z.number(),
    'api:duration': z.string().optional(),
    'api:message': z.string().optional(),
    'api:timestamp': z.string().optional()
});

export type BasicResponse = z.infer<typeof BasicResponseSchema>;