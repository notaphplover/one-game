import { Module } from '@nestjs/common';

import { HttpModule } from '../../../../foundation/http/adapter/nest/modules/HttpModule';
import { JsonSchemaModule } from '../../../../foundation/jsonSchema/adapter/nest/modules/JsonSchemaModule';
import { PostAuthV1HttpRequestController } from '../../../application/controllers/PostAuthV1HttpRequestController';
import { PostAuthV1RequestParamHandler } from '../../../application/handlers/PostAuthV1RequestParamHandler';
import { PostAuthV1HttpRequestNestController } from '../controllers/PostAuthV1HttpRequestNestController';
import { AuthModule } from './AuthModule';

@Module({
  controllers: [PostAuthV1HttpRequestNestController],
  imports: [AuthModule, JsonSchemaModule, HttpModule],
  providers: [
    PostAuthV1RequestParamHandler,
    PostAuthV1HttpRequestController,
    PostAuthV1HttpRequestNestController,
  ],
})
export class AuthHttpApiModule {}
