import { Module } from '@nestjs/common';
import { HttpClient } from '@one-game-js/api-http-client';
import {
  ErrorV1ResponseFromErrorBuilder,
  FastifyReplyFromResponseBuilder,
  RequestFromFastifyRequestBuilder,
  RequestWithBodyFromFastifyRequestBuilder,
  SingleEntityGetResponseBuilder,
  SingleEntityPostResponseBuilder,
} from '@one-game-js/backend-http';

import { EnvModule } from '../../../../env/adapter/nest/modules/EnvModule';
import { EnvironmentService } from '../../../../env/application/services/EnvironmentService';

@Module({
  exports: [
    ErrorV1ResponseFromErrorBuilder,
    FastifyReplyFromResponseBuilder,
    HttpClient,
    RequestFromFastifyRequestBuilder,
    RequestWithBodyFromFastifyRequestBuilder,
    SingleEntityGetResponseBuilder,
    SingleEntityPostResponseBuilder,
  ],
  imports: [EnvModule],
  providers: [
    ErrorV1ResponseFromErrorBuilder,
    FastifyReplyFromResponseBuilder,
    {
      inject: [EnvironmentService],
      provide: HttpClient,
      useFactory: (environmentService: EnvironmentService): HttpClient =>
        new HttpClient(environmentService.getEnvironment().apiBaseUrl),
    },
    RequestFromFastifyRequestBuilder,
    RequestWithBodyFromFastifyRequestBuilder,
    SingleEntityGetResponseBuilder,
    SingleEntityPostResponseBuilder,
  ],
})
export class HttpModule {}
