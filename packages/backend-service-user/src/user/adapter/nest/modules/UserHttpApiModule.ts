import { Module } from '@nestjs/common';

import { HttpModule } from '../../../../foundation/http/adapter/nest/modules/HttpModule';
import { JsonSchemaModule } from '../../../../foundation/jsonSchema/adapter/nest/modules/JsonSchemaModule';
import { PostUserV1HttpRequestController } from '../../../application/controllers/PostUserV1HttpRequestController';
import { PostUserV1RequestParamHandler } from '../../../application/handlers/PostUserV1RequestParamHandler';
import { UserModule } from './UserModule';

@Module({
  imports: [JsonSchemaModule, HttpModule, UserModule],
  providers: [PostUserV1HttpRequestController, PostUserV1RequestParamHandler],
})
export class UserHttpApiModule {}
