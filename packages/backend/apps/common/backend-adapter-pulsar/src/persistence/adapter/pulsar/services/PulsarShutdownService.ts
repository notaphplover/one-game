import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Client } from 'pulsar-client';

import { pulsarClientSymbol } from '../../nest/models/pulsarClientSymbol';

@Injectable()
export class PulsarShutdownService implements OnApplicationShutdown {
  readonly #client: Client;

  constructor(
    @Inject(pulsarClientSymbol)
    client: Client,
  ) {
    this.#client = client;
  }

  public async onApplicationShutdown(): Promise<void> {
    await this.#client.close();
  }
}
