import {
  AppError,
  AppErrorKind,
  PublisherAsync,
} from '@cornie-js/backend-common';
import { IoredisSubscriber } from '@cornie-js/backend-pub-sub';
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

import { ioredisClientSubscriberSymbol } from '../../../../foundation/redis/adapter/nest/models/ioredisClientSymbol';

const GAME_EVENT_CHANNEL_REGEX: RegExp =
  /^v[1-9][0-9]*\/games\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/;

@Injectable()
export class GameEventsIoredisSubscriber extends IoredisSubscriber<
  PublisherAsync<string>
> {
  readonly #gameIdToSseStreamsMap: Map<string, PublisherAsync<string>[]>;

  constructor(
    @Inject(ioredisClientSubscriberSymbol)
    redisClient: Redis,
  ) {
    super(redisClient);

    this.#gameIdToSseStreamsMap = new Map();
  }

  public override async subscribe(
    channel: string,
    publisher: PublisherAsync<string>,
  ): Promise<void> {
    const gameId: string = this.#getGameId(channel);
    this.#setGameStream(gameId, publisher);

    await super.subscribe(channel, publisher);
  }

  public async unsetGamePublisher(
    channel: string,
    gamePublisher: PublisherAsync<string>,
  ): Promise<void> {
    const gameId: string = this.#getGameId(channel);
    const gamePublishers: PublisherAsync<string>[] | undefined =
      this.#gameIdToSseStreamsMap.get(gameId);

    if (gamePublishers === undefined) {
      return;
    }

    const otherGamePublishers: PublisherAsync<string>[] = gamePublishers.filter(
      (gameStream: PublisherAsync<string>): boolean =>
        gameStream !== gamePublisher,
    );

    if (otherGamePublishers.length === 0) {
      await this.unsubscribe(channel);
    } else {
      this.#gameIdToSseStreamsMap.set(gameId, otherGamePublishers);
    }
  }

  public override async unsubscribe(channel: string): Promise<void> {
    const gameId: string = this.#getGameId(channel);
    this.#unsetGameStreams(gameId);

    await super.unsubscribe(channel);
  }

  protected override async _handleMessageFromChannel(
    channel: string,
    message: string,
  ): Promise<void> {
    const gameId: string = this.#getGameId(channel);

    await this.#broadcastGameEvent(gameId, message);
  }

  async #broadcastGameEvent(gameId: string, event: string): Promise<void> {
    const gamePublishers: PublisherAsync<string>[] | undefined =
      this.#gameIdToSseStreamsMap.get(gameId);

    if (gamePublishers === undefined) {
      return;
    }

    await Promise.all(
      gamePublishers.map(async (gamePublisher: PublisherAsync<string>) =>
        gamePublisher.publish(event),
      ),
    );
  }

  #getGameId(channel: string): string {
    const match: RegExpMatchArray | null = channel.match(
      GAME_EVENT_CHANNEL_REGEX,
    );

    if (match === null) {
      throw new AppError(
        AppErrorKind.unknown,
        `Unexpected "${channel}" channel`,
      );
    }

    if (match[1] === undefined) {
      throw new AppError(
        AppErrorKind.unknown,
        'Unexpected channel match with no game id was found',
      );
    }

    return match[1];
  }

  #setGameStream(gameId: string, gamePublisher: PublisherAsync<string>): void {
    let gamePublishers: PublisherAsync<string>[] | undefined =
      this.#gameIdToSseStreamsMap.get(gameId);

    if (gamePublishers === undefined) {
      gamePublishers = [];

      this.#gameIdToSseStreamsMap.set(gameId, gamePublishers);
    }

    gamePublishers.push(gamePublisher);
  }

  #unsetGameStreams(gameId: string): void {
    this.#gameIdToSseStreamsMap.delete(gameId);
  }
}
