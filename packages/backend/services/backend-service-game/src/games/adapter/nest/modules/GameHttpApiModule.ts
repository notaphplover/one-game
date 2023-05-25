import { AppModule } from '@cornie-js/backend-app-game';
import { Module } from '@nestjs/common';

import { AuthModule } from '../../../../auth/adapter/nest/modules/AuthModule';
import { HttpModule } from '../../../../foundation/http/adapter/nest/modules/HttpModule';
import { JsonSchemaModule } from '../../../../foundation/jsonSchema/adapter/nest/modules/JsonSchemaModule';
import { GetGameGameIdSlotSlotIdCardsV1RequestController } from '../../../application/controllers/GetGameGameIdSlotSlotIdCardsV1RequestController';
import { GetGameV1GameIdHttpRequestController } from '../../../application/controllers/GetGameV1GameIdHttpRequestController';
import { PostGameIdSlotV1HttpRequestController } from '../../../application/controllers/PostGameIdSlotV1HttpRequestController';
import { PostGameV1HttpRequestController } from '../../../application/controllers/PostGameV1HttpRequestController';
import { GetGameGameIdSlotSlotIdCardsV1RequestParamHandler } from '../../../application/handlers/GetGameGameIdSlotSlotIdCardsV1RequestParamHandler';
import { GetGameV1GameIdRequestParamHandler } from '../../../application/handlers/GetGameV1GameIdRequestParamHandler';
import { PostGameIdSlotV1RequestBodyHandler } from '../../../application/handlers/PostGameIdSlotV1RequestBodyHandler';
import { PostGameIdSlotV1RequestParamHandler } from '../../../application/handlers/PostGameIdSlotV1RequestParamHandler';
import { PostGameV1RequestParamHandler } from '../../../application/handlers/PostGameV1RequestParamHandler';
import { GameMiddleware } from '../../../application/middlewares/GameMiddleware';
import { GetGameGameIdSlotSlotIdCardsV1RequestNestController } from '../controllers/GetGameGameIdSlotSlotIdCardsV1RequestNestController';
import { GetGameV1GameIdHttpRequestNestController } from '../controllers/GetGameV1GameIdHttpRequestNestController';
import { PostGameIdSlotV1HttpRequestNestController } from '../controllers/PostGameIdSlotV1HttpRequestNestController';
import { PostGameV1HttpRequestNestController } from '../controllers/PostGameV1HttpRequestNestController';

@Module({
  controllers: [
    // Mind the order
    GetGameV1GameIdHttpRequestNestController,
    GetGameGameIdSlotSlotIdCardsV1RequestNestController,
    PostGameV1HttpRequestNestController,
    PostGameIdSlotV1HttpRequestNestController,
  ],
  imports: [AuthModule, JsonSchemaModule, HttpModule, AppModule],
  providers: [
    GameMiddleware,
    GetGameGameIdSlotSlotIdCardsV1RequestController,
    GetGameGameIdSlotSlotIdCardsV1RequestNestController,
    GetGameGameIdSlotSlotIdCardsV1RequestParamHandler,
    GetGameV1GameIdHttpRequestNestController,
    GetGameV1GameIdHttpRequestController,
    GetGameV1GameIdRequestParamHandler,
    PostGameV1HttpRequestController,
    PostGameV1HttpRequestController,
    PostGameV1HttpRequestNestController,
    PostGameV1RequestParamHandler,
    PostGameIdSlotV1HttpRequestController,
    PostGameIdSlotV1HttpRequestNestController,
    PostGameIdSlotV1RequestBodyHandler,
    PostGameIdSlotV1RequestParamHandler,
  ],
})
export class GameHttpApiModule {}
