import { Builder, Handler } from '@cornie-js/backend-common';
import {
  GameMiddleware,
  GetGameGameIdSlotSlotIdCardsV1RequestController,
  GetGameGameIdSlotSlotIdCardsV1RequestParamHandler,
} from '@cornie-js/backend-game-application/games';
import {
  ErrorV1ResponseFromErrorBuilder,
  FastifyReplyFromResponseBuilder,
  HttpNestFastifyController,
  Request,
  RequestFromFastifyRequestBuilder,
  Response,
  ResponseWithBody,
} from '@cornie-js/backend-http';
import { Controller, Get, Inject, Req, Res } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Controller(`v1/games/:${GameMiddleware.gameIdParam}/slots`)
export class GetGameGameIdSlotSlotIdCardsV1RequestNestController extends HttpNestFastifyController<Request> {
  constructor(
    @Inject(RequestFromFastifyRequestBuilder)
    requestBuilder: Builder<Request, [FastifyRequest]>,
    @Inject(GetGameGameIdSlotSlotIdCardsV1RequestController)
    requestController: Handler<[Request], Response | ResponseWithBody<unknown>>,
    @Inject(ErrorV1ResponseFromErrorBuilder)
    responseFromErrorBuilder: Builder<
      Response | ResponseWithBody<unknown>,
      [unknown]
    >,
    @Inject(FastifyReplyFromResponseBuilder)
    resultBuilder: Builder<
      FastifyReply,
      [Response | ResponseWithBody<unknown>, FastifyReply]
    >,
  ) {
    super(
      requestBuilder,
      requestController,
      responseFromErrorBuilder,
      resultBuilder,
    );
  }

  @Get(
    `:${GetGameGameIdSlotSlotIdCardsV1RequestParamHandler.getGameGameIdSlotSlotIdRequestParam}/cards`,
  )
  public override async handle(
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    await super.handle(request, reply);
  }
}
