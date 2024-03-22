import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

import { MessageEvent } from '../models/MessageEvent';
import { SseConsumer } from './SseConsumer';

enum SseConsumerStateKind {
  active,
  delayed,
}

interface BaseSseConsumerState<TKind extends SseConsumerStateKind> {
  kind: TKind;
}

type SseConsumerActiveState = BaseSseConsumerState<SseConsumerStateKind.active>;

interface SseConsumerDelayedState
  extends BaseSseConsumerState<SseConsumerStateKind.delayed> {
  store: DelayedSseConsumerStore;
}

type SseConsumerState = SseConsumerActiveState | SseConsumerDelayedState;

interface DelayedSseConsumerStore {
  eventsBuffer: MessageEvent[];
  eventIdSet: Set<string>;
  previousEventsBuffer: MessageEvent[];
}

@Injectable()
export class DelayedSseConsumer implements SseConsumer {
  readonly #innerConsumer: SseConsumer;
  #pendingOnComplete: boolean;
  #state: SseConsumerState;

  constructor(consumer: SseConsumer) {
    this.#innerConsumer = consumer;
    this.#pendingOnComplete = false;
    this.#state = {
      kind: SseConsumerStateKind.delayed,
      store: {
        eventIdSet: new Set(),
        eventsBuffer: [],
        previousEventsBuffer: [],
      },
    };
  }

  public consume(event: MessageEvent): void {
    if (this.#isDelayed(this.#state)) {
      this.#appendEvent(event, this.#state.store);
    } else {
      this.#innerConsumer.consume(event);
    }
  }

  public free(): void {
    this.#consumeEventsBuffer();
    this.#setActiveState();
    this.#freePendingOnComplete();
  }

  public onComplete(): void {
    if (this.#isDelayed(this.#state)) {
      this.#pendingOnComplete = true;
    } else {
      this.#innerConsumer.onComplete();
    }
  }

  public setPreviousEvents(events: MessageEvent[]): void {
    if (!this.#isDelayed(this.#state)) {
      throw new AppError(
        AppErrorKind.unknown,
        'Cannot set previous events on a non delayed sse consumer state',
      );
    }

    for (const event of events) {
      this.#appendMissedEvent(event, this.#state.store);
    }
  }

  #appendEvent(event: MessageEvent, store: DelayedSseConsumerStore): void {
    this.#appendEventToBuffer(event, store.eventsBuffer, store.eventIdSet);
  }

  #appendMissedEvent(
    event: MessageEvent,
    store: DelayedSseConsumerStore,
  ): void {
    this.#appendEventToBuffer(
      event,
      store.previousEventsBuffer,
      store.eventIdSet,
    );
  }

  #appendEventToBuffer(
    event: MessageEvent,
    buffer: MessageEvent[],
    eventIdSet: Set<string>,
  ): void {
    if (event.id === undefined) {
      buffer.push(event);
    } else {
      if (!eventIdSet.has(event.id)) {
        buffer.push(event);
        eventIdSet.add(event.id);
      }
    }
  }

  #consumeEventsBuffer(): void {
    if (this.#isDelayed(this.#state)) {
      for (const event of this.#state.store.previousEventsBuffer) {
        this.#innerConsumer.consume(event);
      }

      for (const event of this.#state.store.eventsBuffer) {
        this.#innerConsumer.consume(event);
      }
    }
  }

  #freePendingOnComplete(): void {
    if (this.#pendingOnComplete) {
      this.onComplete();
      this.#pendingOnComplete = false;
    }
  }

  #isDelayed(state: SseConsumerState): state is SseConsumerDelayedState {
    return this.#state.kind === SseConsumerStateKind.delayed;
  }

  #setActiveState(): void {
    this.#state = {
      kind: SseConsumerStateKind.active,
    };
  }
}
