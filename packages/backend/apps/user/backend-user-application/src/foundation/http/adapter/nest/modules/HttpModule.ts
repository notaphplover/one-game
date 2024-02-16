import {
  ErrorV1ResponseFromErrorBuilder,
  HttpStatusCodeFromErrorBuilder,
  MultipleEntitiesGetResponseBuilder,
  SingleEntityDeleteResponseBuilder,
  SingleEntityGetResponseBuilder,
  SingleEntityPatchResponseBuilder,
  SingleEntityPostResponseBuilder,
} from '@cornie-js/backend-http';
import { Module } from '@nestjs/common';

@Module({
  exports: [
    ErrorV1ResponseFromErrorBuilder,
    MultipleEntitiesGetResponseBuilder,
    SingleEntityDeleteResponseBuilder,
    SingleEntityGetResponseBuilder,
    SingleEntityPatchResponseBuilder,
    SingleEntityPostResponseBuilder,
  ],
  providers: [
    ErrorV1ResponseFromErrorBuilder,
    HttpStatusCodeFromErrorBuilder,
    MultipleEntitiesGetResponseBuilder,
    SingleEntityDeleteResponseBuilder,
    SingleEntityGetResponseBuilder,
    SingleEntityPatchResponseBuilder,
    SingleEntityPostResponseBuilder,
  ],
})
export class HttpModule {}
