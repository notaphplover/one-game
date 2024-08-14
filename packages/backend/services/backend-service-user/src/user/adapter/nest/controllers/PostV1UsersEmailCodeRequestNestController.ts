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
import {
  BaseV1UsersEmailCodeRequestParamHandler,
  PostV1UsersEmailCodeRequestController,
} from '@cornie-js/backend-user-application/users';
import { Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Controller(
  `v1/users/email/:${BaseV1UsersEmailCodeRequestParamHandler.emailUrlParameter}`,
)
export class PostV1UsersEmailCodeRequestNestController extends HttpNestFastifyController<Request> {
  constructor(
    @Inject(RequestWithOptionalBodyFromFastifyRequestBuilder)
    requestBuilder: Builder<Request | RequestWithBody, [FastifyRequest]>,
    @Inject(PostV1UsersEmailCodeRequestController)
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
