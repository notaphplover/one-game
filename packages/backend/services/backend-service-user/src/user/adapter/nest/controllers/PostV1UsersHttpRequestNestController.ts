import { Builder, Handler } from '@cornie-js/backend-common';
import {
  ErrorV1ResponseFromErrorBuilder,
  FastifyReplyFromResponseBuilder,
  HttpNestFastifyController,
  RequestWithBody,
  RequestWithBodyFromFastifyRequestBuilder,
  Response,
  ResponseWithBody,
} from '@cornie-js/backend-http';
import { PostV1UsersHttpRequestController } from '@cornie-js/backend-user-application/users';
import { Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Controller('v1/users')
export class PostV1UsersHttpRequestNestController extends HttpNestFastifyController<RequestWithBody> {
  constructor(
    @Inject(RequestWithBodyFromFastifyRequestBuilder)
    requestBuilder: Builder<RequestWithBody, [FastifyRequest]>,
    @Inject(PostV1UsersHttpRequestController)
    requestController: Handler<
      [RequestWithBody],
      Response | ResponseWithBody<unknown>
    >,
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

  @Post()
  public override async handle(
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    await super.handle(request, reply);
  }
}
