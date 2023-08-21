import { GameEventsSubscriptionOutputPort } from '@cornie-js/backend-game-application/games';
import { SsePublisher, SseTeardownExecutor } from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { GameEventsIoredisSubscriber } from '../subscribers/GameEventsIoredisSubscriber';

@Injectable()
export class GameEventsSubscriptionIoredisOutputAdapter
  implements GameEventsSubscriptionOutputPort
{
  readonly #gameEventsIoredisSubscriber: GameEventsIoredisSubscriber;

  constructor(
    @Inject(GameEventsIoredisSubscriber)
    gameEventsIoredisSubscriber: GameEventsIoredisSubscriber,
  ) {
    this.#gameEventsIoredisSubscriber = gameEventsIoredisSubscriber;
  }

  public async subscribe(
    channel: string,
    publisher: SsePublisher,
  ): Promise<SseTeardownExecutor> {
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
