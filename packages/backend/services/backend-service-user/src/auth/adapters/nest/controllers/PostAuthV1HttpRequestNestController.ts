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
import { PostAuthV1HttpRequestController } from '@cornie-js/backend-user-application/auth';
import { Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Controller('v1/auth')
export class PostAuthV1HttpRequestNestController extends HttpNestFastifyController<RequestWithBody> {
  constructor(
    @Inject(RequestWithBodyFromFastifyRequestBuilder)
    requestBuilder: Builder<RequestWithBody, [FastifyRequest]>,
    @Inject(PostAuthV1HttpRequestController)
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
