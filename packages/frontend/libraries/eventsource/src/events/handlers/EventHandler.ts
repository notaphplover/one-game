export // eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventHandler<TThis, TEvent> = (this: TThis, event: TEvent) => any;

export interface EventHandlerObject<TThis, TEvent extends Event> {
  handleEvent(this: TThis, event: TEvent): void;
}
