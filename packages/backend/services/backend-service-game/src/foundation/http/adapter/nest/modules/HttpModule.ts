import { EnvModule } from '@cornie-js/backend-app-game-env';
import {
  ErrorV1ResponseFromErrorBuilder,
  FastifyReplyFromResponseBuilder,
  FastifyReplySseConsumerFromFastifyReplyBuilder,
  HttpStatusCodeFromErrorBuilder,
  RequestFromFastifyRequestBuilder,
  RequestWithBodyFromFastifyRequestBuilder,
  StringifiedSseFromMessageEventBuilder,
} from '@cornie-js/backend-http';
import { Module } from '@nestjs/common';

import { FastifySseReplyFromResponseBuilder } from '../../fastify/builders/FastifySseReplyFromResponseBuilder';

@Module({
  exports: [
    ErrorV1ResponseFromErrorBuilder,
    FastifyReplyFromResponseBuilder,
    FastifyReplySseConsumerFromFastifyReplyBuilder,
    FastifySseReplyFromResponseBuilder,
    RequestFromFastifyRequestBuilder,
    RequestWithBodyFromFastifyRequestBuilder,
  ],
  imports: [EnvModule],
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
