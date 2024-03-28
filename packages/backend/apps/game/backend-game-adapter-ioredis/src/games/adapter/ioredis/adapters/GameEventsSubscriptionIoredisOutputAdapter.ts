import { Builder, PublisherAsync } from '@cornie-js/backend-common';
import {
  GameEventsChannelFromGameIdBuilder,
  GameEventsSubscriptionOutputPort,
  GameMessageEvent,
} from '@cornie-js/backend-game-application/games';
import { SseTeardownExecutor } from '@cornie-js/backend-http';
import { IoredisPublisher } from '@cornie-js/backend-pub-sub';
import { Inject, Injectable } from '@nestjs/common';

import { GameEventsIoredisSubscriber } from '../subscribers/GameEventsIoredisSubscriber';

const V2: number = 2;

@Injectable()
export class GameEventsSubscriptionIoredisOutputAdapter
  implements GameEventsSubscriptionOutputPort
{
  readonly #gameEventsChannelFromGameIdBuilder: Builder<
    string,
    [string, number]
  >;
  readonly #gameEventsIoredisSubscriber: GameEventsIoredisSubscriber;
  readonly #ioredisPublisher: IoredisPublisher;

  constructor(
    @Inject(GameEventsChannelFromGameIdBuilder)
    gameEventsChannelFromGameIdBuilder: Builder<string, [string, number]>,
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

  public async publishV2(
    gameId: string,
    gameMessageEvent: GameMessageEvent,
  ): Promise<void> {
    return this.#publish(gameId, gameMessageEvent, V2);
  }

  public async subscribeV2(
    gameId: string,
    publisher: PublisherAsync<string>,
  ): Promise<SseTeardownExecutor> {
    return this.#subscribe(gameId, publisher, V2);
  }

  async #publish(
    gameId: string,
    gameMessageEvent: GameMessageEvent,
    version: number,
  ): Promise<void> {
    const channel: string = this.#gameEventsChannelFromGameIdBuilder.build(
      gameId,
      version,
    );

    await this.#ioredisPublisher.publish(
      channel,
      JSON.stringify(gameMessageEvent),
    );
  }

  async #subscribe(
    gameId: string,
    publisher: PublisherAsync<string>,
    version: number,
  ): Promise<SseTeardownExecutor> {
    const channel: string = this.#gameEventsChannelFromGameIdBuilder.build(
      gameId,
      version,
    );

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
