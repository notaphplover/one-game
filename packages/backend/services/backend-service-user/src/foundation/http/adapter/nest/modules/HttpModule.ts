import {
  ErrorV1ResponseFromErrorBuilder,
  FastifyReplyFromResponseBuilder,
  HttpStatusCodeFromErrorBuilder,
  RequestFromFastifyRequestBuilder,
  RequestWithBodyFromFastifyRequestBuilder,
} from '@cornie-js/backend-http';
import { Module } from '@nestjs/common';

@Module({
  exports: [
    ErrorV1ResponseFromErrorBuilder,
    FastifyReplyFromResponseBuilder,
    RequestFromFastifyRequestBuilder,
    RequestWithBodyFromFastifyRequestBuilder,
  ],
  providers: [
    ErrorV1ResponseFromErrorBuilder,
    FastifyReplyFromResponseBuilder,
    HttpStatusCodeFromErrorBuilder,
    RequestFromFastifyRequestBuilder,
    RequestWithBodyFromFastifyRequestBuilder,
  ],
})
export class HttpModule {}
