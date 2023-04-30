import { Builder, Handler } from '@cornie-js/backend-common';
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

import { GetGameV1GameIdHttpRequestController } from '../../../application/controllers/GetGameV1GameIdHttpRequestController';
import { GET_GAME_V1_GAME_ID_REQUEST_PARAM } from '../../../application/handlers/GetGameV1GameIdRequestParamHandler';

@Controller('v1/games')
export class GetGameV1GameIdHttpRequestNestController extends HttpNestFastifyController<Request> {
  constructor(
    @Inject(RequestFromFastifyRequestBuilder)
    requestBuilder: Builder<Request, [FastifyRequest]>,
    @Inject(GetGameV1GameIdHttpRequestController)
    requestController: Handler<[Request], Response | ResponseWithBody<unknown>>,
    @Inject(FastifyReplyFromResponseBuilder)
    resultBuilder: Builder<
      FastifyReply,
      [Response | ResponseWithBody<unknown>, FastifyReply]
    >,
  ) {
    super(requestBuilder, requestController, resultBuilder);
  }

  @Get(`:${GET_GAME_V1_GAME_ID_REQUEST_PARAM}`)
  public override async handle(
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    await super.handle(request, reply);
  }
}
