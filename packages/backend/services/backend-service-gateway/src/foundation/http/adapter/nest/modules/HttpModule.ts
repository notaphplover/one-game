import { RequestFromFastifyRequestBuilder } from '@cornie-js/backend-http';
import { Module } from '@nestjs/common';

@Module({
  exports: [RequestFromFastifyRequestBuilder],
  providers: [RequestFromFastifyRequestBuilder],
})
export class HttpModule {}
