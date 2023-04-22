import { Module } from '@nestjs/common';

import { AuthModule } from '../../../../auth/adapters/nest/modules/AuthModule';
import { HttpModule } from '../../../../foundation/http/adapter/nest/modules/HttpModule';
import { JsonSchemaModule } from '../../../../foundation/jsonSchema/adapter/nest/modules/JsonSchemaModule';
import { GetUserV1UserIdHttpRequestController } from '../../../application/controllers/GetUserV1UserIdHttpRequestController';
import { PostUserV1HttpRequestController } from '../../../application/controllers/PostUserV1HttpRequestController';
import { GetUserV1MeRequestParamHandler } from '../../../application/handlers/GetUserV1MeRequestParamHandler';
import { GetUserV1UserIdRequestParamHandler } from '../../../application/handlers/GetUserV1UserIdRequestParamHandler';
import { PostUserV1RequestParamHandler } from '../../../application/handlers/PostUserV1RequestParamHandler';
import { GetUserV1UserIdHttpRequestNestController } from '../controllers/GetUserV1UserIdHttpRequestNestController';
import { PostUserV1HttpRequestNestController } from '../controllers/PostUserV1HttpRequestNestController';
import { UserModule } from './UserModule';

@Module({
  controllers: [
    GetUserV1UserIdHttpRequestNestController,
    PostUserV1HttpRequestNestController,
  ],
  imports: [AuthModule, JsonSchemaModule, HttpModule, UserModule],
  providers: [
    GetUserV1MeRequestParamHandler,
    GetUserV1UserIdHttpRequestController,
    GetUserV1UserIdHttpRequestNestController,
    GetUserV1UserIdRequestParamHandler,
    PostUserV1HttpRequestController,
    PostUserV1HttpRequestNestController,
    PostUserV1RequestParamHandler,
  ],
})
export class UserHttpApiModule {}
