import { SsePublisher, SseTeardownExecutor } from '@cornie-js/backend-http';

export interface GameEventsSubscriptionOutputPort {
  subscribe(
    gameId: string,
    publisher: SsePublisher,
  ): Promise<SseTeardownExecutor>;
}

export const gameEventsSubscriptionOutputPortSymbol: symbol = Symbol.for(
  'GameEventsSubscriptionOutputPort',
);
