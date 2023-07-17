import { UserDbModule } from '@cornie-js/backend-user-adapter-typeorm';
import { UserHttpApiModule as UserHttpApiApplicationModule } from '@cornie-js/backend-user-application';
import { Module } from '@nestjs/common';

import { buildDbModuleOptions } from '../../../../foundation/db/adapter/nest/calculations/buildDbModuleOptions';
import { HttpModule } from '../../../../foundation/http/adapter/nest/modules/HttpModule';
import { GetUserV1MeHttpRequestNestController } from '../controllers/GetUserV1MeHttpRequestNestController';
import { GetUserV1UserIdHttpRequestNestController } from '../controllers/GetUserV1UserIdHttpRequestNestController';
import { PatchUserV1MeHttpRequestNestController } from '../controllers/PatchUserV1MeHttpRequestNestController';
import { PostUserV1HttpRequestNestController } from '../controllers/PostUserV1HttpRequestNestController';

@Module({
  controllers: [
    // mind the order
    GetUserV1MeHttpRequestNestController,
    GetUserV1UserIdHttpRequestNestController,
    PatchUserV1MeHttpRequestNestController,
    PostUserV1HttpRequestNestController,
  ],
  imports: [
    UserHttpApiApplicationModule.forRootAsync([
      UserDbModule.forRootAsync(buildDbModuleOptions()),
    ]),
    HttpModule,
  ],
})
export class UserHttpApiModule {}
