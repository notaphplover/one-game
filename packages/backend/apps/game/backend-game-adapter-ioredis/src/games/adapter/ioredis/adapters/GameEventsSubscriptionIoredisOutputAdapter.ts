import { Builder, Publisher } from '@cornie-js/backend-common';
import {
  GameEventsChannelFromGameIdBuilder,
  GameEventsSubscriptionOutputPort,
  GameMessageEvent,
} from '@cornie-js/backend-game-application/games';
import { SseTeardownExecutor } from '@cornie-js/backend-http';
import { IoredisPublisher } from '@cornie-js/backend-pub-sub';
import { Inject, Injectable } from '@nestjs/common';

import { GameEventsIoredisSubscriber } from '../subscribers/GameEventsIoredisSubscriber';

@Injectable()
export class GameEventsSubscriptionIoredisOutputAdapter
  implements GameEventsSubscriptionOutputPort
{
  readonly #gameEventsChannelFromGameIdBuilder: Builder<string, [string]>;
  readonly #gameEventsIoredisSubscriber: GameEventsIoredisSubscriber;
  readonly #ioredisPublisher: IoredisPublisher;

  constructor(
    @Inject(GameEventsChannelFromGameIdBuilder)
    gameEventsChannelFromGameIdBuilder: Builder<string, [string]>,
    @Inject(GameEventsIoredisSubscriber)
    gameEventsIoredisSubscriber: GameEventsIoredisSubscriber,
    @Inject(IoredisPublisher)
    ioredisPublisher: IoredisPublisher,
  ) {
    this.#gameEventsChannelFromGameIdBuilder =
      gameEventsChannelFromGameIdBuilder;
    this.#gameEventsIoredisSubscriber = gameEventsIoredisSubscriber;
    this.#ioredisPublisher = ioredisPublisher;
  }

  public async publish(
    gameId: string,
    gameMessageEvent: GameMessageEvent,
  ): Promise<void> {
    const channel: string =
      this.#gameEventsChannelFromGameIdBuilder.build(gameId);

    await this.#ioredisPublisher.publish(
      channel,
      JSON.stringify(gameMessageEvent),
    );
  }

  public async subscribe(
    gameId: string,
    publisher: Publisher<string>,
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
