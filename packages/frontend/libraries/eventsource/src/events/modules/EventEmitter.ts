import { EventHandler, EventHandlerObject } from '../handlers/EventHandler';

export class EventEmitter<TEvent extends Event> {
  readonly #listeners: Map<
    string,
    (EventHandler<TEvent> | EventHandlerObject<TEvent>)[]
  >;

  constructor() {
    this.#listeners = new Map();
  }

  public add(
    type: string,
    handler: EventHandler<TEvent> | EventHandlerObject<TEvent>,
  ): void {
    let listeners:
      | (EventHandler<TEvent> | EventHandlerObject<TEvent>)[]
      | undefined = this.#listeners.get(type);

    if (listeners === undefined) {
      listeners = [];

      this.#listeners.set(type, listeners);
    }

    listeners.push(handler);
  }

  public emit(type: string, event: TEvent): void {
    const listeners:
      | (EventHandler<TEvent> | EventHandlerObject<TEvent>)[]
      | undefined = this.#listeners.get(type);

    if (listeners !== undefined) {
      for (const listener of listeners) {
        if (typeof listener === 'function') {
          listener(event);
        } else {
          listener.handleEvent(event);
        }
      }
    }
  }

  public empty(type: string): void {
    this.#listeners.delete(type);
  }

  public remove(
    type: string,
    handler: EventHandler<TEvent> | EventHandlerObject<TEvent>,
  ): boolean {
    const listeners:
      | (EventHandler<TEvent> | EventHandlerObject<TEvent>)[]
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
