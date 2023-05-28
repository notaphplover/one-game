import {
  ErrorV1ResponseFromErrorBuilder,
  FastifyReplyFromResponseBuilder,
  RequestFromFastifyRequestBuilder,
  RequestWithBodyFromFastifyRequestBuilder,
  SingleEntityGetResponseBuilder,
  SingleEntityPatchResponseBuilder,
  SingleEntityPostResponseBuilder,
} from '@cornie-js/backend-http';
import { Module } from '@nestjs/common';

@Module({
  exports: [
    ErrorV1ResponseFromErrorBuilder,
    FastifyReplyFromResponseBuilder,
    RequestFromFastifyRequestBuilder,
    RequestWithBodyFromFastifyRequestBuilder,
    SingleEntityGetResponseBuilder,
    SingleEntityPatchResponseBuilder,
    SingleEntityPostResponseBuilder,
  ],
  providers: [
    ErrorV1ResponseFromErrorBuilder,
    FastifyReplyFromResponseBuilder,
    RequestFromFastifyRequestBuilder,
    RequestWithBodyFromFastifyRequestBuilder,
    SingleEntityGetResponseBuilder,
    SingleEntityPatchResponseBuilder,
    SingleEntityPostResponseBuilder,
  ],
})
export class HttpModule {}
