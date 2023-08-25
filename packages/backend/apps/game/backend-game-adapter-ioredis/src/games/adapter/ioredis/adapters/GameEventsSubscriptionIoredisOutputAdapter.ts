import { Builder } from '@cornie-js/backend-common';
import {
  GameEventsChannelFromGameIdBuilder,
  GameEventsSubscriptionOutputPort,
} from '@cornie-js/backend-game-application/games';
import { SsePublisher, SseTeardownExecutor } from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { GameEventsIoredisSubscriber } from '../subscribers/GameEventsIoredisSubscriber';

@Injectable()
export class GameEventsSubscriptionIoredisOutputAdapter
  implements GameEventsSubscriptionOutputPort
{
  readonly #gameEventsChannelFromGameIdBuilder: Builder<string, [string]>;
  readonly #gameEventsIoredisSubscriber: GameEventsIoredisSubscriber;

  constructor(
    @Inject(GameEventsChannelFromGameIdBuilder)
    gameEventsChannelFromGameIdBuilder: Builder<string, [string]>,
    @Inject(GameEventsIoredisSubscriber)
    gameEventsIoredisSubscriber: GameEventsIoredisSubscriber,
  ) {
    this.#gameEventsChannelFromGameIdBuilder =
      gameEventsChannelFromGameIdBuilder;
    this.#gameEventsIoredisSubscriber = gameEventsIoredisSubscriber;
  }

  public async subscribe(
    gameId: string,
    publisher: SsePublisher,
  ): Promise<SseTeardownExecutor> {
    const channel: string =
      this.#gameEventsChannelFromGameIdBuilder.build(gameId);
    await this.#gameEventsIoredisSubscriber.subscribe(channel, publisher);

    return {
      teardown: () =>
        void this.#gameEventsIoredisSubscriber.unsetGamePublisher(
          channel,
          publisher,
        ),
    };
  }
}
