import { MessageEvent } from '../models/MessageEvent';

export interface SseConsumer {
  consume(event: MessageEvent): Promise<void>;
  onComplete(): Promise<void>;
}
