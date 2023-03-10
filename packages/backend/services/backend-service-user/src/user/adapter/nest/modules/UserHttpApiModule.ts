import { Module } from '@nestjs/common';

import { HttpModule } from '../../../../foundation/http/adapter/nest/modules/HttpModule';
import { JsonSchemaModule } from '../../../../foundation/jsonSchema/adapter/nest/modules/JsonSchemaModule';
import { PostUserV1HttpRequestController } from '../../../application/controllers/PostUserV1HttpRequestController';
import { PostUserV1RequestParamHandler } from '../../../application/handlers/PostUserV1RequestParamHandler';
import { PostUserV1HttpRequestNestController } from '../controllers/PostUserV1HttpRequestNestController';
import { UserModule } from './UserModule';

@Module({
  controllers: [PostUserV1HttpRequestNestController],
  imports: [JsonSchemaModule, HttpModule, UserModule],
  providers: [
    PostUserV1HttpRequestNestController,
    PostUserV1HttpRequestController,
    PostUserV1RequestParamHandler,
  ],
})
export class UserHttpApiModule {}
