import { Module } from '@nestjs/common';
import { SingleEntityPostResponseBuilder } from '@one-game-js/backend-http';

import { RequestBuilder } from '../builders/RequestBuilder';
import { RequestWithBodyBuilder } from '../builders/RequestWithBodyBuilder';
import { ResponseBuilder } from '../builders/ResponseBuilder';

@Module({
  exports: [
    RequestBuilder,
    RequestWithBodyBuilder,
    ResponseBuilder,
    SingleEntityPostResponseBuilder,
  ],
  providers: [
    RequestBuilder,
    RequestWithBodyBuilder,
    ResponseBuilder,
    SingleEntityPostResponseBuilder,
  ],
})
export class HttpModule {}
