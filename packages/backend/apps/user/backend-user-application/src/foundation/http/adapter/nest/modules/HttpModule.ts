import {
  ErrorV1ResponseFromErrorBuilder,
  MultipleEntitiesGetResponseBuilder,
  RequestWithBodyFromFastifyRequestBuilder,
  SingleEntityGetResponseBuilder,
  SingleEntityPatchResponseBuilder,
  SingleEntityPostResponseBuilder,
} from '@cornie-js/backend-http';
import { Module } from '@nestjs/common';

@Module({
  exports: [
    ErrorV1ResponseFromErrorBuilder,
    MultipleEntitiesGetResponseBuilder,
    RequestWithBodyFromFastifyRequestBuilder,
    SingleEntityGetResponseBuilder,
    SingleEntityPatchResponseBuilder,
    SingleEntityPostResponseBuilder,
  ],
  providers: [
    ErrorV1ResponseFromErrorBuilder,
    MultipleEntitiesGetResponseBuilder,
    RequestWithBodyFromFastifyRequestBuilder,
    SingleEntityGetResponseBuilder,
    SingleEntityPatchResponseBuilder,
    SingleEntityPostResponseBuilder,
  ],
})
export class HttpModule {}
