import { Builder, Handler } from '@cornie-js/backend-common';
import {
  GetGameV1GameIdGameOptionsHttpRequestController,
  GetGameV1GameIdRequestParamHandler,
} from '@cornie-js/backend-game-application/games';
import {
  FastifyReplyFromResponseBuilder,
  HttpNestFastifyController,
  Response,
  ResponseWithBody,
  RequestFromFastifyRequestBuilder,
  Request,
} from '@cornie-js/backend-http';
import { Controller, Get, Inject, Req, Res } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Controller(
  `v1/games/:${GetGameV1GameIdRequestParamHandler.getGameV1GameIdRequestParam}`,
)
export class GetGameV1GameIdGameOptionsHttpRequestNestController extends HttpNestFastifyController<Request> {
  constructor(
    @Inject(RequestFromFastifyRequestBuilder)
    requestBuilder: Builder<Request, [FastifyRequest]>,
    @Inject(GetGameV1GameIdGameOptionsHttpRequestController)
    requestController: Handler<[Request], Response | ResponseWithBody<unknown>>,
    @Inject(FastifyReplyFromResponseBuilder)
    resultBuilder: Builder<
      FastifyReply,
      [Response | ResponseWithBody<unknown>, FastifyReply]
    >,
  ) {
    super(requestBuilder, requestController, resultBuilder);
  }

  @Get(`options`)
  public override async handle(
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    await super.handle(request, reply);
  }
}
