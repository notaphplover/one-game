import { Module } from '@nestjs/common';

import { AuthModule } from '../../../../auth/adapter/nest/modules/AuthModule';
import { HttpModule } from '../../../../foundation/http/adapter/nest/modules/HttpModule';
import { JsonSchemaModule } from '../../../../foundation/jsonSchema/adapter/nest/modules/JsonSchemaModule';
import { PostGameV1HttpRequestController } from '../../../application/controllers/PostGameV1HttpRequestController';
import { PostGameIdSlotV1RequestParamHandler } from '../../../application/handlers/PostGameIdSlotV1RequestParamHandler';
import { PostGameV1RequestParamHandler } from '../../../application/handlers/PostGameV1RequestParamHandler';
import { PostGameV1HttpRequestNestController } from '../controllers/PostGameV1HttpRequestNestController';
import { GameModule } from './GameModule';

@Module({
  controllers: [PostGameV1HttpRequestNestController],
  imports: [AuthModule, JsonSchemaModule, HttpModule, GameModule],
  providers: [
    PostGameV1HttpRequestController,
    PostGameV1HttpRequestNestController,
    PostGameV1RequestParamHandler,
    PostGameIdSlotV1RequestParamHandler,
  ],
})
export class GameHttpApiModule {}
