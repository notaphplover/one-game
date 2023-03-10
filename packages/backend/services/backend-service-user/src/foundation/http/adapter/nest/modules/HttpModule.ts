import { Module } from '@nestjs/common';
import {
  ErrorV1ResponseFromErrorBuilder,
  SingleEntityPostResponseBuilder,
} from '@one-game-js/backend-http';

import { RequestBuilder } from '../builders/RequestBuilder';
import { RequestWithBodyBuilder } from '../builders/RequestWithBodyBuilder';
import { ResponseBuilder } from '../builders/ResponseBuilder';

@Module({
  exports: [
    ErrorV1ResponseFromErrorBuilder,
    RequestBuilder,
    RequestWithBodyBuilder,
    ResponseBuilder,
    SingleEntityPostResponseBuilder,
  ],
  providers: [
    ErrorV1ResponseFromErrorBuilder,
    RequestBuilder,
    RequestWithBodyBuilder,
    ResponseBuilder,
    SingleEntityPostResponseBuilder,
  ],
})
export class HttpModule {}
