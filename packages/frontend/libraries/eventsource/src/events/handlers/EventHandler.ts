export type EventHandler<TEvent extends Event> = (event: TEvent) => void;
export interface EventHandlerObject<TEvent extends Event> {
  handleEvent(event: TEvent): void;
}
