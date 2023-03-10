import { Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { Builder, Handler } from '@one-game-js/backend-common';
import {
  RequestWithBody,
  Response,
  ResponseWithBody,
} from '@one-game-js/backend-http';
import { FastifyReply, FastifyRequest } from 'fastify';

import { RequestWithBodyBuilder } from '../../../../foundation/http/adapter/nest/builders/RequestWithBodyBuilder';
import { ResponseBuilder } from '../../../../foundation/http/adapter/nest/builders/ResponseBuilder';
import { HttpNestController } from '../../../../foundation/http/adapter/nest/controllers/HttpNestController';
import { PostUserV1HttpRequestController } from '../../../application/controllers/PostUserV1HttpRequestController';

@Controller('v1/users')
export class PostUserV1HttpRequestNestController extends HttpNestController<RequestWithBody> {
  constructor(
    @Inject(RequestWithBodyBuilder)
    requestBuilder: Builder<RequestWithBody, [FastifyRequest]>,
    @Inject(PostUserV1HttpRequestController)
    requestController: Handler<
      [RequestWithBody],
      Response | ResponseWithBody<unknown>
    >,
    @Inject(ResponseBuilder)
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
