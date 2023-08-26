import { Injectable } from '@nestjs/common';

import { MessageEvent } from '../models/MessageEvent';
import { SseConsumer } from './SseConsumer';

@Injectable()
export class DelayedSseConsumer implements SseConsumer {
  #delayEnabled: boolean;
  #innerConsumer: SseConsumer;
  #pendingOnComplete: boolean;
  #eventsBuffer: MessageEvent[] | undefined;

  constructor(consumer: SseConsumer) {
    this.#delayEnabled = true;
    this.#eventsBuffer = [];
    this.#innerConsumer = consumer;
    this.#pendingOnComplete = false;
  }

  public consume(event: MessageEvent): void {
    if (this.#delayEnabled) {
      this.#eventsBuffer?.push(event);
    } else {
      this.#innerConsumer.consume(event);
    }
  }

  public free(): void {
    this.#delayEnabled = false;

    this.#freeEventsBuffer();
    this.#freePendingOnComplete();
  }

  public onComplete(): void {
    if (this.#delayEnabled) {
      this.#pendingOnComplete = true;
    } else {
      this.#innerConsumer.onComplete();
    }
  }

  #freeEventsBuffer(): void {
    for (const event of this.#eventsBuffer!) {
      this.consume(event);
    }

    this.#eventsBuffer = undefined;
  }

  #freePendingOnComplete(): void {
    if (this.#pendingOnComplete) {
      this.onComplete();
      this.#pendingOnComplete = false;
    }
  }
}
