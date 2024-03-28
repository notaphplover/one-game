import { Builder } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { StringifiedSseFromMessageEventBuilder } from '../../../application/builders/StringifiedSseFromMessageEventBuilder';
import { MessageEvent } from '../../../application/models/MessageEvent';
import { DelayedSseConsumer } from '../../../application/modules/DelayedSseConsumer';
import { SseConsumer } from '../../../application/modules/SseConsumer';

@Injectable()
export class FastifyReplySseConsumerFromFastifyReplyBuilder
  implements Builder<DelayedSseConsumer, [FastifyReply]>
{
  readonly #stringifiedSseFromMessageEventBuilder: Builder<
    string,
    [MessageEvent]
  >;

  constructor(
    @Inject(StringifiedSseFromMessageEventBuilder)
    stringifiedSseFromMessageEventBuilder: Builder<string, [MessageEvent]>,
  ) {
    this.#stringifiedSseFromMessageEventBuilder =
      stringifiedSseFromMessageEventBuilder;
  }

  public build(fastifyReply: FastifyReply): DelayedSseConsumer {
    const sseConsumer: SseConsumer = {
      consume: async (event: MessageEvent) => {
        await this.#promisifiedWrite(
          fastifyReply,
          this.#stringifiedSseFromMessageEventBuilder.build(event),
        );
      },
      onComplete: async () => {
        await this.#promisifiedEnd(fastifyReply);
      },
    };

    return new DelayedSseConsumer(sseConsumer);
  }

  async #promisifiedEnd(fastifyReply: FastifyReply): Promise<void> {
    return new Promise<void>((resolve: () => void) => {
      fastifyReply.raw.end(() => {
        resolve();
      });
    });
  }

  async #promisifiedWrite(
    fastifyReply: FastifyReply,
    chunk: string,
  ): Promise<void> {
    return new Promise<void>(
      (resolve: () => void, reject: (reason: unknown) => void) => {
        fastifyReply.raw.write(chunk, (error: Error | null | undefined) => {
          if (error == null) {
            resolve();
          } else {
            reject(error);
          }
        });
      },
    );
  }
}
