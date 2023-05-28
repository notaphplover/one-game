import { AppModule } from '@cornie-js/backend-app-user';
import { Module } from '@nestjs/common';

import { AuthHttpApiModule } from '../../../../auth/adapters/nest/modules/AuthHttpApiModule';
import { HttpModule } from '../../../../foundation/http/adapter/nest/modules/HttpModule';
import { JsonSchemaModule } from '../../../../foundation/jsonSchema/adapter/nest/modules/JsonSchemaModule';
import { GetUserV1MeHttpRequestController } from '../../../application/controllers/GetUserV1MeHttpRequestController';
import { GetUserV1UserIdHttpRequestController } from '../../../application/controllers/GetUserV1UserIdHttpRequestController';
import { PatchUserV1MeHttpRequestController } from '../../../application/controllers/PatchUserV1MeHttpRequestController';
import { PostUserV1HttpRequestController } from '../../../application/controllers/PostUserV1HttpRequestController';
import { GetUserV1MeRequestParamHandler } from '../../../application/handlers/GetUserV1MeRequestParamHandler';
import { GetUserV1UserIdRequestParamHandler } from '../../../application/handlers/GetUserV1UserIdRequestParamHandler';
import { PatchUserV1MeRequestBodyParamHandler } from '../../../application/handlers/PatchUserV1MeRequestBodyParamHandler';
import { PatchUserV1MeRequestParamHandler } from '../../../application/handlers/PatchUserV1MeRequestParamHandler';
import { PostUserV1RequestParamHandler } from '../../../application/handlers/PostUserV1RequestParamHandler';
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
  imports: [AppModule, AuthHttpApiModule, JsonSchemaModule, HttpModule],
  providers: [
    GetUserV1MeHttpRequestController,
    GetUserV1MeRequestParamHandler,
    GetUserV1UserIdHttpRequestController,
    GetUserV1UserIdRequestParamHandler,
    PatchUserV1MeHttpRequestController,
    PatchUserV1MeRequestBodyParamHandler,
    PatchUserV1MeRequestParamHandler,
    PostUserV1HttpRequestController,
    PostUserV1RequestParamHandler,
  ],
})
export class UserHttpApiModule {}
