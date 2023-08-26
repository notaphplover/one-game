import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { SsePublisher } from '@cornie-js/backend-http';
import { IoredisSubscriber } from '@cornie-js/backend-pub-sub';
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

import { ioredisClientSymbol } from '../../../../foundation/redis/adapter/nest/models/ioredisClientSymbol';

const GAME_EVENT_CHANNEL_REGEX: RegExp =
  /^v1\/games\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/;

@Injectable()
export class GameEventsIoredisSubscriber extends IoredisSubscriber<SsePublisher> {
  readonly #gameIdToSseStreamsMap: Map<string, SsePublisher[]>;

  constructor(
    @Inject(ioredisClientSymbol)
    redisClient: Redis,
  ) {
    super(redisClient);

    this.#gameIdToSseStreamsMap = new Map();
  }

  public override async subscribe(
    channel: string,
    publisher: SsePublisher,
  ): Promise<void> {
    const gameId: string = this.#getGameId(channel);
    this.#setGameStream(gameId, publisher);

    await super.subscribe(channel, publisher);
  }

  public async unsetGamePublisher(
    channel: string,
    gamePublisher: SsePublisher,
  ): Promise<void> {
    const gameId: string = this.#getGameId(channel);
    const gamePublishers: SsePublisher[] | undefined =
      this.#gameIdToSseStreamsMap.get(gameId);

    if (gamePublishers === undefined) {
      return;
    }

    const otherGamePublishers: SsePublisher[] = gamePublishers.filter(
      (gameStream: SsePublisher): boolean => gameStream !== gamePublisher,
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

  protected override async handleMessageFromChannel(
    channel: string,
    message: string,
  ): Promise<void> {
    const gameId: string = this.#getGameId(channel);

    this.#broadcastGameEvent(gameId, message);
  }

  #broadcastGameEvent(gameId: string, event: string): void {
    const gamePublishers: SsePublisher[] | undefined =
      this.#gameIdToSseStreamsMap.get(gameId);

    if (gamePublishers === undefined) {
      return;
    }

    gamePublishers.map(async (gamePublisher: SsePublisher) =>
      gamePublisher.publish({
        data: event,
      }),
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

  #setGameStream(gameId: string, gamePublisher: SsePublisher): void {
    let gamePublishers: SsePublisher[] | undefined =
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
