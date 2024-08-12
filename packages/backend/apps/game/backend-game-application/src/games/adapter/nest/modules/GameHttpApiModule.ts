import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';

import { AuthModule } from '../../../../auth/adapter/nest/modules/AuthModule';
import { HttpModule } from '../../../../foundation/http/adapter/nest/modules/HttpModule';
import { JsonSchemaModule } from '../../../../foundation/jsonSchema/adapter/nest/modules/JsonSchemaModule';
import { GameActionApplicationModule } from '../../../../gameActions/adapter/nest/modules/GameActionApplicationModule';
import { GetGameGameIdEventsV2SseController } from '../../../application/controllers/GetGameGameIdEventsV2SseController';
import { GetGameGameIdSlotSlotIdCardsV1RequestController } from '../../../application/controllers/GetGameGameIdSlotSlotIdCardsV1RequestController';
import { GetGamesV1GameIdSpecHttpRequestController } from '../../../application/controllers/GetGamesV1GameIdSpecHttpRequestController';
import { GetGamesV1SpecsHttpRequestController } from '../../../application/controllers/GetGamesV1SpecsHttpRequestController';
import { GetGameV1GameIdHttpRequestController } from '../../../application/controllers/GetGameV1GameIdHttpRequestController';
import { GetGameV1MineHttpRequestController } from '../../../application/controllers/GetGameV1MineHttpRequestController';
import { PatchGameV1GameIdHttpRequestController } from '../../../application/controllers/PatchGameV1GameIdHttpRequestController';
import { PostGameIdSlotV1HttpRequestController } from '../../../application/controllers/PostGameIdSlotV1HttpRequestController';
import { PostGameV1HttpRequestController } from '../../../application/controllers/PostGameV1HttpRequestController';
import { GetGameGameIdEventsV2RequestParamHandler } from '../../../application/handlers/GetGameGameIdEventsV2RequestParamHandler';
import { GetGameGameIdSlotSlotIdCardsV1RequestParamHandler } from '../../../application/handlers/GetGameGameIdSlotSlotIdCardsV1RequestParamHandler';
import { GetGamesV1GameIdRequestParamHandler } from '../../../application/handlers/GetGamesV1GameIdRequestParamHandler';
import { GetGamesV1MineRequestParamHandler } from '../../../application/handlers/GetGamesV1MineRequestParamHandler';
import { GetGamesV1SpecsRequestParamHandler } from '../../../application/handlers/GetGamesV1SpecsRequestParamHandler';
import { PatchGameGameIdV1RequestBodyParamHandler } from '../../../application/handlers/PatchGameGameIdV1RequestBodyParamHandler';
import { PatchGameGameIdV1RequestParamHandler } from '../../../application/handlers/PatchGameGameIdV1RequestParamHandler';
import { PostGameIdSlotV1RequestBodyHandler } from '../../../application/handlers/PostGameIdSlotV1RequestBodyHandler';
import { PostGameIdSlotV1RequestParamHandler } from '../../../application/handlers/PostGameIdSlotV1RequestParamHandler';
import { PostGameV1RequestParamHandler } from '../../../application/handlers/PostGameV1RequestParamHandler';
import { GameMiddleware } from '../../../application/middlewares/GameMiddleware';
import { GameApplicationModule } from './GameApplicationModule';

@Module({})
export class GameHttpApiModule {
  public static forRootAsync(
    gameImports?: Array<
      Type<unknown> | DynamicModule | Promise<DynamicModule> | ForwardReference
    >,
  ): DynamicModule {
    return {
      exports: [
        GetGameGameIdEventsV2SseController,
        GetGameGameIdSlotSlotIdCardsV1RequestController,
        GetGamesV1SpecsHttpRequestController,
        GetGamesV1GameIdSpecHttpRequestController,
        GetGameV1GameIdHttpRequestController,
        GetGameV1MineHttpRequestController,
        PatchGameV1GameIdHttpRequestController,
        PostGameIdSlotV1HttpRequestController,
        PostGameV1HttpRequestController,
      ],
      global: false,
      imports: [
        ...(gameImports ?? []),
        AuthModule,
        GameActionApplicationModule.forRootAsync(gameImports),
        GameApplicationModule.forRootAsync(gameImports),
        JsonSchemaModule,
        HttpModule,
      ],
      module: GameHttpApiModule,
      providers: [
        GameMiddleware,
        GetGameGameIdEventsV2RequestParamHandler,
        GetGameGameIdEventsV2SseController,
        GetGameGameIdSlotSlotIdCardsV1RequestController,
        GetGameGameIdSlotSlotIdCardsV1RequestParamHandler,
        GetGamesV1SpecsHttpRequestController,
        GetGamesV1SpecsRequestParamHandler,
        GetGamesV1GameIdSpecHttpRequestController,
        GetGameV1GameIdHttpRequestController,
        GetGamesV1GameIdRequestParamHandler,
        GetGameV1MineHttpRequestController,
        GetGamesV1MineRequestParamHandler,
        PatchGameGameIdV1RequestBodyParamHandler,
        PatchGameGameIdV1RequestParamHandler,
        PatchGameV1GameIdHttpRequestController,
        PostGameIdSlotV1HttpRequestController,
        PostGameIdSlotV1RequestBodyHandler,
        PostGameIdSlotV1RequestParamHandler,
        PostGameV1HttpRequestController,
        PostGameV1RequestParamHandler,
      ],
    };
  }
}
