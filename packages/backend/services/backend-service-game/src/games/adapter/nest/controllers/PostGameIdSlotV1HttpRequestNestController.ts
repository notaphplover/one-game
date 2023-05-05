import { Builder, Handler } from '@cornie-js/backend-common';
import {
  RequestWithBodyFromFastifyRequestBuilder,
  FastifyReplyFromResponseBuilder,
  HttpNestFastifyController,
  RequestWithBody,
  Response,
  ResponseWithBody,
} from '@cornie-js/backend-http';
import { Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

import { PostGameIdSlotV1HttpRequestController } from '../../../application/controllers/PostGameIdSlotV1HttpRequestController';

@Controller('v1/games/:gameId/slots')
export class PostGameIdSlotV1HttpRequestNestController extends HttpNestFastifyController<RequestWithBody> {
  constructor(
    @Inject(RequestWithBodyFromFastifyRequestBuilder)
    requestBuilder: Builder<RequestWithBody, [FastifyRequest]>,
    @Inject(PostGameIdSlotV1HttpRequestController)
    requestController: Handler<
      [RequestWithBody],
      Response | ResponseWithBody<unknown>
    >,
    @Inject(FastifyReplyFromResponseBuilder)
    resultBuilder: Builder<
      FastifyReply,
      [Response | ResponseWithBody<unknown>, FastifyReply]
    >,
  ) {
    super(requestBuilder, requestController, resultBuilder);
  }

  @Post()
  public override async handle(
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    await super.handle(request, reply);
  }
}
