import {
  ErrorV1ResponseFromErrorBuilder,
  RequestWithBodyFromFastifyRequestBuilder,
  SingleEntityGetResponseBuilder,
  SingleEntityPostResponseBuilder,
} from '@cornie-js/backend-http';
import { Module } from '@nestjs/common';

@Module({
  exports: [
    ErrorV1ResponseFromErrorBuilder,
    RequestWithBodyFromFastifyRequestBuilder,
    SingleEntityGetResponseBuilder,
    SingleEntityPostResponseBuilder,
  ],
  providers: [
    ErrorV1ResponseFromErrorBuilder,
    RequestWithBodyFromFastifyRequestBuilder,
    SingleEntityGetResponseBuilder,
    SingleEntityPostResponseBuilder,
  ],
})
export class HttpModule {}
