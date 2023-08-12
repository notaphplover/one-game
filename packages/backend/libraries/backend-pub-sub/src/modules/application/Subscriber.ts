export interface Subscriber<TContext = void> {
  subscribe(channel: string, context: TContext): Promise<void>;
  unsubscribe(channel: string): Promise<void>;
}
