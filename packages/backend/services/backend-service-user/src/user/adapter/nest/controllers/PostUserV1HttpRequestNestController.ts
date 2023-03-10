import { Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { Builder, Handler } from '@one-game-js/backend-common';
import {
  RequestWithBodyFromFastifyRequestBuilder,
  FastifyReplyFromResponseBuilder,
  HttpNestFastifyController,
  RequestWithBody,
  Response,
  ResponseWithBody,
} from '@one-game-js/backend-http';
import { FastifyReply, FastifyRequest } from 'fastify';

import { PostUserV1HttpRequestController } from '../../../application/controllers/PostUserV1HttpRequestController';

@Controller('v1/users')
export class PostUserV1HttpRequestNestController extends HttpNestFastifyController<RequestWithBody> {
  constructor(
    @Inject(RequestWithBodyFromFastifyRequestBuilder)
    requestBuilder: Builder<RequestWithBody, [FastifyRequest]>,
    @Inject(PostUserV1HttpRequestController)
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
