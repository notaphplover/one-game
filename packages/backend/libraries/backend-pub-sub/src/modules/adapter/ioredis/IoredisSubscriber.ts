import Redis from 'ioredis';

import { Subscriber } from '../../application/Subscriber';

export abstract class IoredisSubscriber<TContext = void>
  implements Subscriber<TContext>
{
  readonly #redisClient: Redis;

  constructor(redisClient: Redis) {
    this.#redisClient = redisClient;

    this.#handleMessages();
  }

  public async subscribe(channel: string, _context: TContext): Promise<void> {
    await this.#redisClient.subscribe(channel);
  }

  public async unsubscribe(channel: string): Promise<void> {
    await this.#redisClient.unsubscribe(channel);
  }

  #handleMessages(): void {
    this.#redisClient.on(
      'message',
      (channel: string, message: string): void =>
        void this.handleMessageFromChannel(channel, message),
    );
  }

  protected abstract handleMessageFromChannel(
    channel: string,
    message: string,
  ): Promise<void>;
}
