export interface SseConsumer {
  consume(event: string): void;
  onComplete(): void;
}
