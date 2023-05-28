import { AppModule } from '@cornie-js/backend-app-user';
import { Module } from '@nestjs/common';

import { AuthHttpApiModule } from '../../../../auth/adapters/nest/modules/AuthHttpApiModule';
import { HttpModule } from '../../../../foundation/http/adapter/nest/modules/HttpModule';
import { JsonSchemaModule } from '../../../../foundation/jsonSchema/adapter/nest/modules/JsonSchemaModule';
import { GetUserV1MeHttpRequestController } from '../../../application/controllers/GetUserV1MeHttpRequestController';
import { GetUserV1UserIdHttpRequestController } from '../../../application/controllers/GetUserV1UserIdHttpRequestController';
import { PostUserV1HttpRequestController } from '../../../application/controllers/PostUserV1HttpRequestController';
import { GetUserV1MeRequestParamHandler } from '../../../application/handlers/GetUserV1MeRequestParamHandler';
import { GetUserV1UserIdRequestParamHandler } from '../../../application/handlers/GetUserV1UserIdRequestParamHandler';
import { PatchUserMeV1RequestBodyParamHandler } from '../../../application/handlers/PatchUserMeV1RequestBodyParamHandler';
import { PostUserV1RequestParamHandler } from '../../../application/handlers/PostUserV1RequestParamHandler';
import { GetUserV1MeHttpRequestNestController } from '../controllers/GetUserV1MeHttpRequestNestController';
import { GetUserV1UserIdHttpRequestNestController } from '../controllers/GetUserV1UserIdHttpRequestNestController';
import { PostUserV1HttpRequestNestController } from '../controllers/PostUserV1HttpRequestNestController';

@Module({
  controllers: [
    // mind the order
    GetUserV1MeHttpRequestNestController,
    GetUserV1UserIdHttpRequestNestController,
    PostUserV1HttpRequestNestController,
  ],
  imports: [AppModule, AuthHttpApiModule, JsonSchemaModule, HttpModule],
  providers: [
    GetUserV1MeHttpRequestController,
    GetUserV1MeHttpRequestNestController,
    GetUserV1MeRequestParamHandler,
    GetUserV1UserIdHttpRequestController,
    GetUserV1UserIdHttpRequestNestController,
    GetUserV1UserIdRequestParamHandler,
    PatchUserMeV1RequestBodyParamHandler,
    PostUserV1HttpRequestController,
    PostUserV1HttpRequestNestController,
    PostUserV1RequestParamHandler,
  ],
})
export class UserHttpApiModule {}
