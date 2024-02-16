import {
  ErrorV1ResponseFromErrorBuilder,
  FastifyReplyFromResponseBuilder,
  HttpStatusCodeFromErrorBuilder,
  RequestFromFastifyRequestBuilder,
  RequestWithBodyFromFastifyRequestBuilder,
  RequestWithOptionalBodyFromFastifyRequestBuilder,
} from '@cornie-js/backend-http';
import { Module } from '@nestjs/common';

@Module({
  exports: [
    ErrorV1ResponseFromErrorBuilder,
    FastifyReplyFromResponseBuilder,
    RequestFromFastifyRequestBuilder,
    RequestWithBodyFromFastifyRequestBuilder,
    RequestWithOptionalBodyFromFastifyRequestBuilder,
  ],
  providers: [
    ErrorV1ResponseFromErrorBuilder,
    FastifyReplyFromResponseBuilder,
    HttpStatusCodeFromErrorBuilder,
    RequestFromFastifyRequestBuilder,
    RequestWithBodyFromFastifyRequestBuilder,
    RequestWithOptionalBodyFromFastifyRequestBuilder,
  ],
})
export class HttpModule {}
