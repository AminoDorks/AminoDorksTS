import { z } from 'zod';

export const EnviromentUnion = z.union([
    z.literal('global'),
    z.literal('ndc')
]);

export const MediaTypeUnion = z.union([
    z.literal('audio/aac'),
    z.literal('image/jpg')
]);

export const CommentsSortingUnion = z.union([
    z.literal('newest'),
    z.literal('oldest'),
    z.literal('vote')
]);

export const UsersTypeUnion = z.union([
    z.literal('recent'),
    z.literal('banned'),
    z.literal('featured'),
    z.literal('leaders'),
    z.literal('curators')
]);

export const PostTypeUnion = z.union([
    z.literal('item'),
    z.literal('blog')
]);

export const ThreadTypeUnion = z.union([
    z.literal('recommended'),
    z.literal('hidden')
]);

export const StatusUnion = z.union([
    z.literal('enable'),
    z.literal('disable')
]);

export const FeatureDurationUnion = z.union([
    z.literal(1),
    z.literal(2)
]);

export const EnviromentContextSchema = z.object({
    enviroment: EnviromentUnion,
    ndcId: z.number().optional()
});

export const UpdateEmailBuilderSchema = z.object({
    email: z.email(),
    password: z.string(),
    newEmail: z.email(),
    code: z.string(),
    newCode: z.string()
});

export const StartSizeSchema = z.object({
    start: z.number().default(0).optional(),
    size: z.number().default(25).optional()
});

export const BlogBuilderSchema = z.object({
    label: z.string(),
    content: z.string(),
    mediaList: z.array(z.string()).optional(),
    fansOnly: z.boolean().optional(),
    backgroundColor: z.string().optional()
});

export const WikiBuilderSchema = z.object({
    ...BlogBuilderSchema.shape,
    icon: z.string().optional(),
    keywords: z.string().optional()
});

export const CreateThreadBuilderSchema = z.object({
    initialMessageContent: z.string().optional(),
    inviteeUids: z.array(z.string()).min(1),
    title: z.string().optional(),
    content: z.string().optional(),
});

export const EditThreadBuilderSchema = z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    thumbnail: z.string().optional(),
    keywords: z.string().optional(),
    announcement: z.string().optional(),
    pinAnnouncement: z.boolean().optional()
});

enum MessageTypesEnum {
    General = 0,
    Strike = 1,
    ShareExurl = 50,
    ShareUser = 51
};

export const MessageType = z.enum(MessageTypesEnum);

export const MessageSettingsSchema = z.object({
    messageType: MessageType.default(0).optional(),
    mentionedArray: z.array(z.string()).optional(),
    replyMessageId: z.string().optional()
});

export const EmbedSchema = z.object({
    id: z.string().optional(),
    type: z.number().optional(),
    link: z.string().optional(),
    title: z.string(),
    content: z.string().optional(),
    thumbnail: z.string().optional()
});

export const TimerSchema = z.object({
    start: z.number(),
    end: z.number()
});

export const TimersArray = z.array(TimerSchema).min(1);

export const EditProfileBuilderSchema = z.object({
    nickname: z.string().optional(),
    avatar: z.string().optional(),
    about: z.string().optional(),
    backgroundMediaList: z.string().optional(),
    backgroundColor: z.string().optional()
});

export const LinkSnippetSchema = z.object({
    link: z.string(),
    media: z.instanceof(Buffer)
});

export type MediaType = z.infer<typeof MediaTypeUnion>;
export type CommentsSorting = z.infer<typeof CommentsSortingUnion>;
export type UsersType = z.infer<typeof UsersTypeUnion>;
export type PostType = z.infer<typeof PostTypeUnion>;
export type ThreadType = z.infer<typeof ThreadTypeUnion>;
export type Status = z.infer<typeof StatusUnion>;
export type FeatureDuration = z.infer<typeof FeatureDurationUnion>;
export type EnviromentContext = z.infer<typeof EnviromentContextSchema>;
export type UpdateEmailBuilder = z.infer<typeof UpdateEmailBuilderSchema>;
export type StartSize = z.infer<typeof StartSizeSchema>;
export type BlogBuilder = z.infer<typeof BlogBuilderSchema>;
export type WikiBuilder = z.infer<typeof WikiBuilderSchema>;
export type CreateThreadBuilder = z.infer<typeof CreateThreadBuilderSchema>;
export type EditThreadBuilder = z.infer<typeof EditThreadBuilderSchema>;
export type MessageType = z.infer<typeof MessageType>;
export type MessageSettings = z.infer<typeof MessageSettingsSchema>;
export type Embed = z.infer<typeof EmbedSchema>;
export type Timer = z.infer<typeof TimerSchema>;
export type Timers = z.infer<typeof TimersArray>;
export type EditProfileBuilder = z.infer<typeof EditProfileBuilderSchema>;
export type LinkSnippet = z.infer<typeof LinkSnippetSchema>;