import { Builder, Handler } from '@cornie-js/backend-common';
import {
  FastifyReplyFromResponseBuilder,
  HttpNestFastifyController,
  Response,
  ResponseWithBody,
  Request,
  ErrorV1ResponseFromErrorBuilder,
  RequestWithOptionalBodyFromFastifyRequestBuilder,
  RequestWithBody,
} from '@cornie-js/backend-http';
import {
  BaseUserV1EmailCodeRequestParamHandler,
  PostUserV1EmailCodeRequestController,
} from '@cornie-js/backend-user-application/users';
import { Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Controller(
  `v1/users/email/:${BaseUserV1EmailCodeRequestParamHandler.emailUrlParameter}`,
)
export class PostUserV1EmailCodeRequestNestController extends HttpNestFastifyController<Request> {
  constructor(
    @Inject(RequestWithOptionalBodyFromFastifyRequestBuilder)
    requestBuilder: Builder<Request | RequestWithBody, [FastifyRequest]>,
    @Inject(PostUserV1EmailCodeRequestController)
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

  @Post('code')
  public override async handle(
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    await super.handle(request, reply);
  }
}
