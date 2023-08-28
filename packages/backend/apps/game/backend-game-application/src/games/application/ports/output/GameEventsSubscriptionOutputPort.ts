import { Publisher } from '@cornie-js/backend-common';
import { SseTeardownExecutor } from '@cornie-js/backend-http';

import { GameMessageEvent } from '../../models/GameMessageEvent';

export interface GameEventsSubscriptionOutputPort {
  publish(gameId: string, gameMessageEvent: GameMessageEvent): Promise<void>;
  subscribe(
    gameId: string,
    publisher: Publisher<string>,
  ): Promise<SseTeardownExecutor>;
}

export const gameEventsSubscriptionOutputPortSymbol: symbol = Symbol.for(
  'GameEventsSubscriptionOutputPort',
);
