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
      consume: (event: string) => {
        fastifyReply.raw.write(
          this.#stringifiedSseFromMessageEventBuilder.build({
            data: event,
          }),
        );
      },
      onComplete: () => {
        fastifyReply.raw.end();
      },
    };

    return new DelayedSseConsumer(sseConsumer);
  }
}
