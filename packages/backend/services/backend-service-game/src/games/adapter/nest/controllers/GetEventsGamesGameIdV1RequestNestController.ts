import { Builder, Either, Handler } from '@cornie-js/backend-common';
import { GetGameGameIdEventsV1SseController } from '@cornie-js/backend-game-application/games';
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

@Controller(`v1/events/games`)
export class GetEventsGamesGameIdV1RequestNestController extends HttpNestFastifySseController {
  constructor(
    @Inject(FastifyReplySseConsumerFromFastifyReplyBuilder)
    fastifyReplySseConsumerFromFastifyReplyBuilder: FastifyReplySseConsumerFromFastifyReplyBuilder,
    @Inject(RequestFromFastifyRequestBuilder)
    requestBuilder: Builder<Request, [FastifyRequest]>,
    @Inject(GetGameGameIdEventsV1SseController)
    getGameGameIdEventsV1SseController: Handler<
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
      getGameGameIdEventsV1SseController,
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
