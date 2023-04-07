import { Module } from '@nestjs/common';
import {
  ErrorV1ResponseFromErrorBuilder,
  FastifyReplyFromResponseBuilder,
  RequestFromFastifyRequestBuilder,
  RequestWithBodyFromFastifyRequestBuilder,
  SingleEntityGetResponseBuilder,
  SingleEntityPostResponseBuilder,
} from '@one-game-js/backend-http';

@Module({
  exports: [
    ErrorV1ResponseFromErrorBuilder,
    FastifyReplyFromResponseBuilder,
    RequestFromFastifyRequestBuilder,
    RequestWithBodyFromFastifyRequestBuilder,
    SingleEntityGetResponseBuilder,
    SingleEntityPostResponseBuilder,
  ],
  providers: [
    ErrorV1ResponseFromErrorBuilder,
    FastifyReplyFromResponseBuilder,
    RequestFromFastifyRequestBuilder,
    RequestWithBodyFromFastifyRequestBuilder,
    SingleEntityGetResponseBuilder,
    SingleEntityPostResponseBuilder,
  ],
})
export class HttpModule {}
