import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import Redis from 'ioredis';

import {
  ioredisClientSubscriberSymbol,
  ioredisClientSymbol,
} from '../models/ioredisClientSymbol';

@Injectable()
export class IoredisShutdownService implements OnApplicationShutdown {
  readonly #redisClient: Redis;
  readonly #redisSubscriberClient: Redis;

  constructor(
    @Inject(ioredisClientSymbol) redisClient: Redis,
    @Inject(ioredisClientSubscriberSymbol) redisSubscriberClient: Redis,
  ) {
    this.#redisClient = redisClient;
    this.#redisSubscriberClient = redisSubscriberClient;
  }

  public async onApplicationShutdown(): Promise<void> {
    await Promise.all([
      this.#redisClient.quit(),
      this.#redisSubscriberClient.quit(),
    ]);
  }
}
