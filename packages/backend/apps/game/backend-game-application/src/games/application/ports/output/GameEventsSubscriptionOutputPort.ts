import { Publisher } from '@cornie-js/backend-common';
import { SseTeardownExecutor } from '@cornie-js/backend-http';

import { GameMessageEvent } from '../../models/GameMessageEvent';

export interface GameEventsSubscriptionOutputPort {
  publishV1(gameId: string, gameMessageEvent: GameMessageEvent): Promise<void>;
  publishV2(gameId: string, gameMessageEvent: GameMessageEvent): Promise<void>;
  subscribeV1(
    gameId: string,
    publisher: Publisher<string>,
  ): Promise<SseTeardownExecutor>;
}

export const gameEventsSubscriptionOutputPortSymbol: symbol = Symbol.for(
  'GameEventsSubscriptionOutputPort',
);
