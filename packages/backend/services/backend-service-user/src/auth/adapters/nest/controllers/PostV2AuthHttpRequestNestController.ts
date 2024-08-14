import { Builder, Handler } from '@cornie-js/backend-common';
import {
  ErrorV1ResponseFromErrorBuilder,
  FastifyReplyFromResponseBuilder,
  HttpNestFastifyController,
  Request,
  RequestWithBody,
  RequestWithOptionalBodyFromFastifyRequestBuilder,
  Response,
  ResponseWithBody,
} from '@cornie-js/backend-http';
import { PostAuthV2HttpRequestController } from '@cornie-js/backend-user-application/auth';
import { Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Controller('v2/auth')
export class PostV2AuthHttpRequestNestController extends HttpNestFastifyController<
  Request | RequestWithBody
> {
  constructor(
    @Inject(RequestWithOptionalBodyFromFastifyRequestBuilder)
    requestBuilder: Builder<Request | RequestWithBody, [FastifyRequest]>,
    @Inject(PostAuthV2HttpRequestController)
    requestController: Handler<
      [Request | RequestWithBody],
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
