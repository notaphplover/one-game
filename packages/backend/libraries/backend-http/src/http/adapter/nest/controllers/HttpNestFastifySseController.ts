import { Builder, Either, Handler } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

import { MessageEvent } from '../../../application/models/MessageEvent';
import { Request } from '../../../application/models/Request';
import { RequestWithBody } from '../../../application/models/RequestWithBody';
import { Response } from '../../../application/models/Response';
import { ResponseWithBody } from '../../../application/models/ResponseWithBody';
import { DelayedSseConsumer } from '../../../application/modules/DelayedSseConsumer';
import { SsePublisher } from '../../../application/modules/SsePublisher';
import { SseTeardownExecutor } from '../../../application/modules/SseTeardownExecutor';
import { FastifyReplySseConsumerFromFastifyReplyBuilder } from '../../fastify/builders/FastifyReplySseConsumerFromFastifyReplyBuilder';

@Injectable()
export class HttpNestFastifySseController<
  TRequest extends Request | RequestWithBody = Request | RequestWithBody,
> implements Handler<[FastifyRequest, FastifyReply], void>
{
  readonly #fastifyReplySseConsumerFromFastifyReplyBuilder: FastifyReplySseConsumerFromFastifyReplyBuilder;
  readonly #requestBuilder: Builder<TRequest, [FastifyRequest]>;
  readonly #requestController: Handler<
    [TRequest, SsePublisher],
    Either<
      Response | ResponseWithBody<unknown>,
      [Response, MessageEvent[], SseTeardownExecutor]
    >
  >;
  readonly #resultBuilder: Builder<
    FastifyReply,
    [Response | ResponseWithBody<unknown>, FastifyReply]
  >;
  readonly #sseResultBuilder: Builder<FastifyReply, [Response, FastifyReply]>;

  constructor(
    fastifyReplyConsumerFromFastifyReplyBuilder: FastifyReplySseConsumerFromFastifyReplyBuilder,
    requestBuilder: Builder<TRequest, [FastifyRequest]>,
    requestController: Handler<
      [TRequest, SsePublisher],
      Either<
        Response | ResponseWithBody<unknown>,
        [Response, MessageEvent[], SseTeardownExecutor]
      >
    >,
    resultBuilder: Builder<
      FastifyReply,
      [Response | ResponseWithBody<unknown>, FastifyReply]
    >,
    sseResultBuilder: Builder<FastifyReply, [Response, FastifyReply]>,
  ) {
    this.#fastifyReplySseConsumerFromFastifyReplyBuilder =
      fastifyReplyConsumerFromFastifyReplyBuilder;
    this.#requestBuilder = requestBuilder;
    this.#requestController = requestController;
    this.#resultBuilder = resultBuilder;
    this.#sseResultBuilder = sseResultBuilder;
  }

  public async handle(
    fastifyRequest: FastifyRequest,
    fastifyReply: FastifyReply,
  ): Promise<void> {
    this.#configureRequest(fastifyRequest);

    const request: TRequest = this.#requestBuilder.build(fastifyRequest);

    const delayedSseConsumer: DelayedSseConsumer =
      this.#fastifyReplySseConsumerFromFastifyReplyBuilder.build(fastifyReply);

    const ssePublisher: SsePublisher = new SsePublisher(delayedSseConsumer);

    const result: Either<
      Response,
      [Response, MessageEvent[], SseTeardownExecutor]
    > = await this.#requestController.handle(request, ssePublisher);

    if (result.isRight) {
      const [response, messageEvents, sseTeardownExecutor]: [
        Response,
        MessageEvent[],
        SseTeardownExecutor,
      ] = result.value;

      await this.#handleRequestOnClose(fastifyRequest, async () => {
        sseTeardownExecutor.teardown();
        await delayedSseConsumer.onComplete();
      });

      delayedSseConsumer.setPreviousEvents(messageEvents);

      void this.#sseResultBuilder.build(response, fastifyReply);

      await delayedSseConsumer.free();
    } else {
      const response: Response = result.value;

      void this.#resultBuilder.build(response, fastifyReply);
    }
  }

  #configureRequest(fastifyRequest: FastifyRequest): void {
    fastifyRequest.socket.setKeepAlive(true);
    fastifyRequest.socket.setNoDelay(true);
    fastifyRequest.socket.setTimeout(0);
  }

  async #handleRequestOnClose(
    fastifyRequest: FastifyRequest,
    callback: () => Promise<void>,
  ): Promise<void> {
    if (fastifyRequest.raw.closed) {
      await callback();
    } else {
      fastifyRequest.raw.on('close', () => void callback());
    }
  }
}
