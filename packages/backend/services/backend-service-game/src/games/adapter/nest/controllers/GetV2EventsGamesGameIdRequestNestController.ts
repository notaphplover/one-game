import { Builder, Either, Handler } from '@cornie-js/backend-common';
import { GetV2GamesGameIdEventsSseController } from '@cornie-js/backend-game-application/games';
import {
  FastifyReplyFromResponseBuilder,
  FastifyReplySseConsumerFromFastifyReplyBuilder,
  HttpNestFastifySseController,
  MessageEvent,
  Request,
  RequestFromFastifyRequestBuilder,
  Response,
  ResponseWithBody,
  SsePublisher,
  SseTeardownExecutor,
} from '@cornie-js/backend-http';
import { Controller, Get, Inject, Req, Res } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

import { FastifySseReplyFromResponseBuilder } from '../../../../foundation/http/adapter/fastify/builders/FastifySseReplyFromResponseBuilder';

@Controller(`v2/events/games`)
export class GetV2EventsGamesGameIdRequestNestController extends HttpNestFastifySseController {
  constructor(
    @Inject(FastifyReplySseConsumerFromFastifyReplyBuilder)
    fastifyReplySseConsumerFromFastifyReplyBuilder: FastifyReplySseConsumerFromFastifyReplyBuilder,
    @Inject(RequestFromFastifyRequestBuilder)
    requestBuilder: Builder<Request, [FastifyRequest]>,
    @Inject(GetV2GamesGameIdEventsSseController)
    getV2GamesGameIdEventsSseController: Handler<
      [Request, SsePublisher],
      Either<
        Response | ResponseWithBody<unknown>,
        [Response, MessageEvent[], SseTeardownExecutor]
      >
    >,
    @Inject(FastifyReplyFromResponseBuilder)
    resultBuilder: Builder<
      FastifyReply,
      [Response | ResponseWithBody<unknown>, FastifyReply]
    >,
    @Inject(FastifySseReplyFromResponseBuilder)
    sseResultBuilder: FastifySseReplyFromResponseBuilder,
  ) {
    super(
      fastifyReplySseConsumerFromFastifyReplyBuilder,
      requestBuilder,
      getV2GamesGameIdEventsSseController,
      resultBuilder,
      sseResultBuilder,
    );
  }

  @Get(':gameId')
  public override async handle(
    @Req()
    fastifyRequest: FastifyRequest,
    @Res()
    fastifyReply: FastifyReply,
  ): Promise<void> {
    return super.handle(fastifyRequest, fastifyReply);
  }
}
