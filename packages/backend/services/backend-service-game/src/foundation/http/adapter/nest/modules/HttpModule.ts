import {
  FastifyReplyFromResponseBuilder,
  FastifyReplySseConsumerFromFastifyReplyBuilder,
  FastifySseReplyFromResponseBuilder,
  RequestFromFastifyRequestBuilder,
  RequestWithBodyFromFastifyRequestBuilder,
  StringifiedSseFromMessageEventBuilder,
} from '@cornie-js/backend-http';
import { Module } from '@nestjs/common';

@Module({
  exports: [
    FastifyReplyFromResponseBuilder,
    FastifyReplySseConsumerFromFastifyReplyBuilder,
    FastifySseReplyFromResponseBuilder,
    RequestFromFastifyRequestBuilder,
    RequestWithBodyFromFastifyRequestBuilder,
  ],
  providers: [
    FastifyReplyFromResponseBuilder,
    FastifyReplySseConsumerFromFastifyReplyBuilder,
    FastifySseReplyFromResponseBuilder,
    RequestFromFastifyRequestBuilder,
    RequestWithBodyFromFastifyRequestBuilder,
    StringifiedSseFromMessageEventBuilder,
  ],
})
export class HttpModule {}
