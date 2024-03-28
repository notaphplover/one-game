import { PublisherAsync } from '@cornie-js/backend-common';
import { SseTeardownExecutor } from '@cornie-js/backend-http';

import { GameMessageEvent } from '../../models/GameMessageEvent';

export interface GameEventsSubscriptionOutputPort {
  publishV2(gameId: string, gameMessageEvent: GameMessageEvent): Promise<void>;
  subscribeV2(
    gameId: string,
    publisher: PublisherAsync<string>,
  ): Promise<SseTeardownExecutor>;
}

export const gameEventsSubscriptionOutputPortSymbol: symbol = Symbol.for(
  'GameEventsSubscriptionOutputPort',
);
