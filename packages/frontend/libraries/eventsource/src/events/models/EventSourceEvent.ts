import { NonMessageEvent } from './NonMessageEvent';

export type EventSourceEvent<T extends string> = T extends NonMessageEvent
  ? Event
  : MessageEvent<unknown>;
