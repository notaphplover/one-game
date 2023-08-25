import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import Redis from 'ioredis';

import { ioredisClientSymbol } from '../models/ioredisClientSymbol';

@Injectable()
export class IoredisShutdownService implements OnApplicationShutdown {
  readonly #redisClient: Redis;

  constructor(@Inject(ioredisClientSymbol) redisClient: Redis) {
    this.#redisClient = redisClient;
  }

  public async onApplicationShutdown(): Promise<void> {
    await this.#redisClient.quit();
  }
}
