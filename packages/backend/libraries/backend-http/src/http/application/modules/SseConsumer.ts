import { MessageEvent } from '../models/MessageEvent';

export interface SseConsumer {
  consume(event: MessageEvent): void;
  onComplete(): void;
}
