import { z } from 'zod';

export const GenerateECDSAResponseSchema = z.object({
    ECDSA: z.string().readonly(),
    message: z.string().readonly()
});

export const GetPublicKeyCredentialsResponseSchema = z.object({
    credentials: z.object({
        key_chain: z.array(z.string()).readonly(),
        token: z.string().readonly(),
        uid: z.string().readonly(),
        timestamp: z.number().readonly()
    })
});

export const GetElapsedRealtimeSchema = z.object({
    elapsedRealtime: z.string(),
    message: z.string()
});

export const PostRequestConfigSchema = z.object({
    path: z.string().readonly(),
    body: z.string().readonly(),
    contentType: z.string().optional(),
});

export const GetRequestConfigSchema = PostRequestConfigSchema.omit({ body: true });
export const UrlEncodedRequestConfigSchema = GetRequestConfigSchema.required();
export const DeleteRequestConfigSchema = GetRequestConfigSchema.omit({ contentType: true });
export const RawRequestConfigSchema = z.object({
    ...PostRequestConfigSchema.shape,
    method: z.string(),
    headers: z.record(z.string(), z.string())
}).optional();

export const BufferRequestConfigSchema = z.object({
    ...UrlEncodedRequestConfigSchema.shape,
    body: z.instanceof(Buffer)
});

export const AllConfigs = z.union([GetRequestConfigSchema, PostRequestConfigSchema, UrlEncodedRequestConfigSchema, DeleteRequestConfigSchema, RawRequestConfigSchema, BufferRequestConfigSchema]);

export type GenerateECDSAResponse = z.infer<typeof GenerateECDSAResponseSchema>;
export type GetPublicKeyCredentialsResponse = z.infer<typeof GetPublicKeyCredentialsResponseSchema>;
export type PostRequestConfig = z.infer<typeof PostRequestConfigSchema>;
export type GetRequestConfig = z.infer<typeof GetRequestConfigSchema>;
export type DeleteRequestConfig = z.infer<typeof DeleteRequestConfigSchema>
export type UrlEncodedRequestConfig = z.infer<typeof UrlEncodedRequestConfigSchema>;
export type RawRequestConfig = z.infer<typeof RawRequestConfigSchema>;
export type BufferRequestConfig = z.infer<typeof BufferRequestConfigSchema>;
export type GetElapsedRealtime = z.infer<typeof GetElapsedRealtimeSchema>;
export type AllConfigs = z.infer<typeof AllConfigs>;