import { z } from 'zod';

export const SessionDataSchema = z.object({
    '0': z.number().int().positive().readonly(),
    '2': z.string().min(36).readonly(),
    '4': z.string().min(7).readonly(),
    '5': z.number().int().positive().readonly(),
    '7': z.string().readonly()
}).transform(data => ({
    status: data['0'],
    userId: data['2'],
    ipAddress: data['4'],
    timestamp: data['5'],
    hash: data['7']
}));

export type SessionData = z.infer<typeof SessionDataSchema>;