import {
  ErrorV1ResponseFromErrorBuilder,
  FastifyReplyFromResponseBuilder,
  FastifyReplySseConsumerFromFastifyReplyBuilder,
  FastifySseReplyFromResponseBuilder,
  HttpStatusCodeFromErrorBuilder,
  RequestFromFastifyRequestBuilder,
  RequestWithBodyFromFastifyRequestBuilder,
  StringifiedSseFromMessageEventBuilder,
} from '@cornie-js/backend-http';
import { Module } from '@nestjs/common';

@Module({
  exports: [
    ErrorV1ResponseFromErrorBuilder,
    FastifyReplyFromResponseBuilder,
    FastifyReplySseConsumerFromFastifyReplyBuilder,
    FastifySseReplyFromResponseBuilder,
    RequestFromFastifyRequestBuilder,
    RequestWithBodyFromFastifyRequestBuilder,
  ],
  providers: [
    ErrorV1ResponseFromErrorBuilder,
    FastifyReplyFromResponseBuilder,
    FastifyReplySseConsumerFromFastifyReplyBuilder,
    FastifySseReplyFromResponseBuilder,
    HttpStatusCodeFromErrorBuilder,
    RequestFromFastifyRequestBuilder,
    RequestWithBodyFromFastifyRequestBuilder,
    StringifiedSseFromMessageEventBuilder,
  ],
})
export class HttpModule {}
