import { SseConsumer } from './SseConsumer';

export class SsePublisher {
  readonly #consumer: SseConsumer;

  constructor(consumer: SseConsumer) {
    this.#consumer = consumer;
  }

  public publish(event: string): void {
    this.#consumer.consume(event);
  }

  public conplete(): void {
    this.#consumer.onComplete();
  }
}
