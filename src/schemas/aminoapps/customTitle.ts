import { z } from 'zod';

export const CustomTitleSchema = z.object({
    title: z.string(),
    color: z.string().nullable()
});

export type CustomTitle = z.infer<typeof CustomTitleSchema>;