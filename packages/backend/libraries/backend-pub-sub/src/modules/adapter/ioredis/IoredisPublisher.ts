import Redis from 'ioredis';

export class IoredisPublisher {
  readonly #redisClient: Redis;

  constructor(redisClient: Redis) {
    this.#redisClient = redisClient;
  }

  public async publish(channel: string, message: string): Promise<void> {
    await this.#redisClient.publish(channel, message);
  }
}
