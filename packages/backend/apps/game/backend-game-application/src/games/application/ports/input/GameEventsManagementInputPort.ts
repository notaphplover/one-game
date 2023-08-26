import { SsePublisher, SseTeardownExecutor } from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import {
  GameEventsSubscriptionOutputPort,
  gameEventsSubscriptionOutputPortSymbol,
} from '../output/GameEventsSubscriptionOutputPort';

@Injectable()
export class GameEventsManagementInputPort {
  readonly #gameEventsSubscriptionOutputPort: GameEventsSubscriptionOutputPort;

  constructor(
    @Inject(gameEventsSubscriptionOutputPortSymbol)
    gameEventsSubscriptionOutputPort: GameEventsSubscriptionOutputPort,
  ) {
    this.#gameEventsSubscriptionOutputPort = gameEventsSubscriptionOutputPort;
  }

  public async subscribe(
    gameId: string,
    publisher: SsePublisher,
  ): Promise<SseTeardownExecutor> {
    return this.#gameEventsSubscriptionOutputPort.subscribe(gameId, publisher);
  }
}
