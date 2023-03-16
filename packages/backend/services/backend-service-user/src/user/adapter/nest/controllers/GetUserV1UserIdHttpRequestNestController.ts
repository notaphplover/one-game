import { Controller, Get, Inject, Req, Res } from '@nestjs/common';
import { Builder, Handler } from '@one-game-js/backend-common';
import {
  FastifyReplyFromResponseBuilder,
  HttpNestFastifyController,
  Response,
  ResponseWithBody,
  Request,
  RequestFromFastifyRequestBuilder,
} from '@one-game-js/backend-http';
import { FastifyReply, FastifyRequest } from 'fastify';

import { GetUserV1UserIdHttpRequestController } from '../../../application/controllers/GetUserV1UserIdHttpRequestController';
import { GET_USER_V1_USER_ID_REQUEST_PARAM } from '../../../application/handlers/GetUserV1UserIdRequestParamHandler';

@Controller('v1/users')
export class GetUserV1UserIdHttpRequestNestController extends HttpNestFastifyController<Request> {
  constructor(
    @Inject(RequestFromFastifyRequestBuilder)
    requestBuilder: Builder<Request, [FastifyRequest]>,
    @Inject(GetUserV1UserIdHttpRequestController)
    requestController: Handler<[Request], Response | ResponseWithBody<unknown>>,
    @Inject(FastifyReplyFromResponseBuilder)
    resultBuilder: Builder<
      FastifyReply,
      [Response | ResponseWithBody<unknown>, FastifyReply]
    >,
  ) {
    super(requestBuilder, requestController, resultBuilder);
  }

  @Get(`:${GET_USER_V1_USER_ID_REQUEST_PARAM}`)
  public override async handle(
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    await super.handle(request, reply);
  }
}
