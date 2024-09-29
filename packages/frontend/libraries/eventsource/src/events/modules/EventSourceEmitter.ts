import { EventHandler, EventHandlerObject } from '../handlers/EventHandler';
import { EventSourceEvent } from '../models/EventSourceEvent';
import { NonMessageEvent } from '../models/NonMessageEvent';
import { EventEmitter } from './EventEmitter';
import { EventSource } from './EventSource';

export class EventSourceEmitter {
  public static errorEventType: string = 'error';
  public static openEventType: string = 'open';

  readonly #eventEmitter: EventEmitter<EventSource, Event>;
  readonly #messageEventEmitter: EventEmitter<
    EventSource,
    MessageEvent<unknown>
  >;

  constructor(eventSource: EventSource) {
    this.#eventEmitter = new EventEmitter(eventSource);
    this.#messageEventEmitter = new EventEmitter(eventSource);
  }

  public add<T extends string>(
    type: T,
    handler: T extends NonMessageEvent
      ?
          | EventHandler<EventSource, Event>
          | EventHandlerObject<EventSource, Event>
      :
          | EventHandler<EventSource, MessageEvent<unknown>>
          | EventHandlerObject<EventSource, MessageEvent<unknown>>,
  ): void {
    if (this.#isNonMessageEvent(type)) {
      this.#eventEmitter.add(
        type,
        handler as
          | EventHandler<EventSource, Event>
          | EventHandlerObject<EventSource, Event>,
      );
    } else {
      this.#messageEventEmitter.add(type, handler);
    }
  }

  public emit<T extends string>(type: T, event: EventSourceEvent<T>): void {
    if (this.#isNonMessageEvent(type)) {
      this.#eventEmitter.emit(type, event);
    } else {
      if (event instanceof MessageEvent) {
        this.#messageEventEmitter.emit(type, event);
      } else {
        throw new Error('Unexpected non MessageEvent');
      }
    }
  }

  public empty(type: string): void {
    if (this.#isNonMessageEvent(type)) {
      this.#eventEmitter.empty(type);
    } else {
      this.#messageEventEmitter.empty(type);
    }
  }

  public remove<T extends string>(
    type: T,
    handler: T extends NonMessageEvent
      ?
          | EventHandler<EventSource, Event>
          | EventHandlerObject<EventSource, Event>
      :
          | EventHandler<EventSource, MessageEvent<unknown>>
          | EventHandlerObject<EventSource, MessageEvent<unknown>>,
  ): void {
    if (this.#isNonMessageEvent(type)) {
      this.#eventEmitter.remove(
        type,
        handler as EventHandler<EventSource, Event>,
      );
    } else {
      this.#messageEventEmitter.remove(type, handler);
    }
  }

  #isNonMessageEvent(type: string): type is NonMessageEvent {
    return (
      type === EventSourceEmitter.openEventType ||
      type === EventSourceEmitter.errorEventType
    );
  }
}
