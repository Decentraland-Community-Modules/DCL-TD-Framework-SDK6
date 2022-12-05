import { PreviewEmoteEventType } from './preview-emote-event-type';
export declare type EmoteEventPayload<T extends PreviewEmoteEventType> = T extends PreviewEmoteEventType.ANIMATION_PLAYING ? {
    length: number;
} : undefined;
//# sourceMappingURL=preview-emote-event-payload.d.ts.map