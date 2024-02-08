import Redis from 'ioredis';

import { Subscriber } from '../../application/Subscriber';

export abstract class IoredisSubscriber<TContext = void>
  implements Subscriber<TContext>
{
  readonly #channelsSet: Set<string>;
  readonly #redisClient: Redis;

  constructor(redisClient: Redis) {
    this.#channelsSet = new Set();
    this.#redisClient = redisClient;

    this.#handleMessages();
  }

  public async subscribe(channel: string, _context: TContext): Promise<void> {
    if (!this.#channelsSet.has(channel)) {
      this.#channelsSet.add(channel);
      await this.#redisClient.subscribe(channel);
    }
  }

  public async unsubscribe(channel: string): Promise<void> {
    if (this.#channelsSet.has(channel)) {
      this.#channelsSet.delete(channel);
      await this.#redisClient.unsubscribe(channel);
    }
  }

  #handleMessages(): void {
    this.#redisClient.on(
      'message',
      (channel: string, message: string): void =>
        void this._handleMessageFromChannel(channel, message),
    );
  }

  protected abstract _handleMessageFromChannel(
    channel: string,
    message: string,
  ): void | Promise<void>;
}
