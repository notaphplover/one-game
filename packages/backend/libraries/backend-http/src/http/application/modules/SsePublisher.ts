import { MessageEvent } from '../models/MessageEvent';
import { SseConsumer } from './SseConsumer';

export class SsePublisher {
  readonly #consumer: SseConsumer;

  constructor(consumer: SseConsumer) {
    this.#consumer = consumer;
  }

  public async publish(event: MessageEvent): Promise<void> {
    await this.#consumer.consume(event);
  }

  public async conplete(): Promise<void> {
    await this.#consumer.onComplete();
  }
}
