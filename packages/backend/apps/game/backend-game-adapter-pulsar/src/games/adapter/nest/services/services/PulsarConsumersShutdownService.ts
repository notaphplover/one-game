import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Consumer } from 'pulsar-client';

import { gameTurnEndSignalConsumerSymbol } from '../../models/gameTurnEndSignalConsumerSymbol';

@Injectable()
export class PulsarConsumersShutdownService implements OnApplicationShutdown {
  readonly #gameTurnEndSignalConsumer: Consumer;

  constructor(
    @Inject(gameTurnEndSignalConsumerSymbol)
    gameTurnEndSignalConsumer: Consumer,
  ) {
    this.#gameTurnEndSignalConsumer = gameTurnEndSignalConsumer;
  }

  public async onApplicationShutdown(): Promise<void> {
    await Promise.all([this.#gameTurnEndSignalConsumer.close()]);
  }
}
