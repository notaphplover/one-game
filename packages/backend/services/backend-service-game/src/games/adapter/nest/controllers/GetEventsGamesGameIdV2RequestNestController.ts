import { Builder, Either, Handler } from '@cornie-js/backend-common';
import { GetGameGameIdEventsV2SseController } from '@cornie-js/backend-game-application/games';
import {
  FastifyReplyFromResponseBuilder,
  FastifyReplySseConsumerFromFastifyReplyBuilder,
  FastifySseReplyFromResponseBuilder,
  HttpNestFastifySseController,
  Request,
  RequestFromFastifyRequestBuilder,
  Response,
  ResponseWithBody,
  SsePublisher,
  SseTeardownExecutor,
} from '@cornie-js/backend-http';
import { Controller, Get, Inject, Req, Res } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Controller(`v2/events/games`)
export class GetEventsGamesGameIdV2RequestNestController extends HttpNestFastifySseController {
  constructor(
    @Inject(FastifyReplySseConsumerFromFastifyReplyBuilder)
    fastifyReplySseConsumerFromFastifyReplyBuilder: FastifyReplySseConsumerFromFastifyReplyBuilder,
    @Inject(RequestFromFastifyRequestBuilder)
    requestBuilder: Builder<Request, [FastifyRequest]>,
    @Inject(GetGameGameIdEventsV2SseController)
    getGameGameIdEventsV2SseController: Handler<
      [Request, SsePublisher],
      Either<Response, [Response, SseTeardownExecutor]>
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
      getGameGameIdEventsV2SseController,
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
