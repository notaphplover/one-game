import { Controller, Get, Inject, Req, Res } from '@nestjs/common';
import { Builder, Handler } from '@one-game-js/backend-common';
import {
  FastifyReplyFromResponseBuilder,
  HttpNestFastifyController,
  Response,
  ResponseWithBody,
  RequestFromFastifyRequestBuilder,
  Request,
} from '@one-game-js/backend-http';
import { FastifyReply, FastifyRequest } from 'fastify';

import { GetGameGameIdSlotSlotIdCardsV1RequestController } from '../../../application/controllers/GetGameGameIdSlotSlotIdCardsV1RequestController';
import { GET_GAME_GAME_ID_SLOT_SLOT_ID_REQUEST_PARAM } from '../../../application/handlers/GetGameGameIdSlotSlotIdCardsV1RequestParamHandler';
import { GameMiddleware } from '../../../application/middlewares/GameMiddleware';

@Controller(`v1/games/:${GameMiddleware.gameIdParam}/slots`)
export class GetGameGameIdSlotSlotIdCardsV1RequestNestController extends HttpNestFastifyController<Request> {
  constructor(
    @Inject(RequestFromFastifyRequestBuilder)
    requestBuilder: Builder<Request, [FastifyRequest]>,
    @Inject(GetGameGameIdSlotSlotIdCardsV1RequestController)
    requestController: Handler<[Request], Response | ResponseWithBody<unknown>>,
    @Inject(FastifyReplyFromResponseBuilder)
    resultBuilder: Builder<
      FastifyReply,
      [Response | ResponseWithBody<unknown>, FastifyReply]
    >,
  ) {
    super(requestBuilder, requestController, resultBuilder);
  }

  @Get(`:${GET_GAME_GAME_ID_SLOT_SLOT_ID_REQUEST_PARAM}/cards`)
  public override async handle(
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    await super.handle(request, reply);
  }
}
