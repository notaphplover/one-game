import { EventHandler, EventHandlerObject } from '../handlers/EventHandler';

export class EventEmitter<TThis, TEvent extends Event> {
  readonly #self: TThis;
  readonly #listeners: Map<
    string,
    (EventHandler<TThis, TEvent> | EventHandlerObject<TThis, TEvent>)[]
  >;

  constructor(self: TThis) {
    this.#listeners = new Map();
    this.#self = self;
  }

  public add(
    type: string,
    handler: EventHandler<TThis, TEvent> | EventHandlerObject<TThis, TEvent>,
  ): void {
    let listeners:
      | (EventHandler<TThis, TEvent> | EventHandlerObject<TThis, TEvent>)[]
      | undefined = this.#listeners.get(type);

    if (listeners === undefined) {
      listeners = [];

      this.#listeners.set(type, listeners);
    }

    listeners.push(handler);
  }

  public emit(type: string, event: TEvent): void {
    const listeners:
      | (EventHandler<TThis, TEvent> | EventHandlerObject<TThis, TEvent>)[]
      | undefined = this.#listeners.get(type);

    if (listeners !== undefined) {
      for (const listener of listeners) {
        if (typeof listener === 'object') {
          (listener.handleEvent.bind(this.#self) as (event: TEvent) => unknown)(
            event,
          );
        } else {
          (listener.bind(this.#self) as (event: TEvent) => unknown)(event);
        }
      }
    }
  }

  public empty(type: string): void {
    this.#listeners.delete(type);
  }

  public remove(
    type: string,
    handler: EventHandler<TThis, TEvent> | EventHandlerObject<TThis, TEvent>,
  ): boolean {
    const listeners:
      | (EventHandler<TThis, TEvent> | EventHandlerObject<TThis, TEvent>)[]
      | undefined = this.#listeners.get(type);

    if (listeners === undefined) {
      return false;
    }

    const index: number = listeners.indexOf(handler);

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    if (index === -1) {
      return false;
    }

    listeners.splice(index, 1);

    return true;
  }
}
