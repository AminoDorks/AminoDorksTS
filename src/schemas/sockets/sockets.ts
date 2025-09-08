import { z } from 'zod';

import { MessageSchema } from '../aminoapps/message';
import { AminoDorks } from '../../core/aminodorks';

export interface Arg {
    readonly rawValue: string;

    getNumber(): number;
    getString(): string;
    getBoolean(): boolean;
};

export const MessageEventSchema = z.object({
    ndcId: z.number(),
    chatMessage: MessageSchema
});

export const NotificationEventSchema = z.object({
    payload: z.object({
        u: z.string().optional(),
        notifType: z.number(),
        aps: z.object({
            alert: z.string(),
            badge: z.number(),
            sound: z.string(),
        }),
        ts: z.string(),
        msgType: z.number(),
        ndcId: z.number(),
        tid: z.string(),
        threadId: z.string().optional(),
        isHidden: z.boolean(),
        id: z.string(),
    })
});

const EventMapSchema = z.object({
    message: MessageEventSchema,
    strike: MessageEventSchema,
    deleteMessage: MessageEventSchema,
    memberJoin: MessageEventSchema,
    memberLeave: MessageEventSchema,
    chatInvite: MessageEventSchema,
    backgroundChange: MessageEventSchema,
    titleChange: MessageEventSchema,
    thumbnailChange: MessageEventSchema,
    voiceChat: MessageEventSchema,
    videoChat: MessageEventSchema,
    voiceChatEnd: MessageEventSchema,
    videoChatEnd: MessageEventSchema,
    contentChange: MessageEventSchema,
    hostTransfer: MessageEventSchema,
    removeMessage: MessageEventSchema,
    modRemoveMessage: MessageEventSchema,
    tip: MessageEventSchema,
    pinAnnounce: MessageEventSchema,
    viewOnly: MessageEventSchema,
    viewOnlyEnd: MessageEventSchema,
    unpinAnnounce: MessageEventSchema,
    tipsEnable: MessageEventSchema,
    tipsDisable: MessageEventSchema,
    notify: NotificationEventSchema
})

export const EventNameEnum = EventMapSchema.keyof();

export const WebSocketEventSchema = z.union([
    MessageEventSchema,
    NotificationEventSchema
]);

export const BasicEventSchema = z.object({
    t: z.number(),
    o: WebSocketEventSchema
});

export const CommandDataSchema = z.object({
    message: MessageSchema,
    ndcId: z.number(),
});

export const ElapsedRealtimeObjectSchema = z.object({
    elapsedRealtime: z.string(),
    timestamp: z.number()
});

export type BasicEvent = z.infer<typeof BasicEventSchema>;
export type MessageEvent = z.infer<typeof MessageEventSchema>;
export type NotificationEvent = z.infer<typeof NotificationEventSchema>;
export type EventMap = z.infer<typeof EventMapSchema>;
export type EventName = z.infer<typeof EventNameEnum>;
export type WebSocketEvent = z.infer<typeof WebSocketEventSchema>;
export type CommandData = z.infer<typeof CommandDataSchema>;
export type WebSocketCallback = (ndc: AminoDorks, data: WebSocketEvent) => Promise<void>;
export type CommandCallback = (ndc: AminoDorks, callbackData: CommandData) => Promise<void>;
export type CommandArgsCallback = (ndc: AminoDorks, callbackData: CommandData, args: Arg[]) => Promise<void>;
export type ElapsedRealtimeObject = z.infer<typeof ElapsedRealtimeObjectSchema>;