import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';

import { AuthModule } from '../../../../auth/adapter/nest/modules/AuthModule';
import { HttpModule } from '../../../../foundation/http/adapter/nest/modules/HttpModule';
import { JsonSchemaModule } from '../../../../foundation/jsonSchema/adapter/nest/modules/JsonSchemaModule';
import { GetGameGameIdEventsV1SseController } from '../../../application';
import { GetGameGameIdSlotSlotIdCardsV1RequestController } from '../../../application/controllers/GetGameGameIdSlotSlotIdCardsV1RequestController';
import { GetGamesV1SpecsHttpRequestController } from '../../../application/controllers/GetGamesV1SpecsHttpRequestController';
import { GetGameV1GameIdGameSpecHttpRequestController } from '../../../application/controllers/GetGameV1GameIdGameSpecHttpRequestController';
import { GetGameV1GameIdHttpRequestController } from '../../../application/controllers/GetGameV1GameIdHttpRequestController';
import { GetGameV1MineHttpRequestController } from '../../../application/controllers/GetGameV1MineHttpRequestController';
import { PatchGameV1GameIdHttpRequestController } from '../../../application/controllers/PatchGameV1GameIdHttpRequestController';
import { PostGameIdSlotV1HttpRequestController } from '../../../application/controllers/PostGameIdSlotV1HttpRequestController';
import { PostGameV1HttpRequestController } from '../../../application/controllers/PostGameV1HttpRequestController';
import { GetGameGameIdEventsV1RequestParamHandler } from '../../../application/handlers/GetGameGameIdEventsV1RequestParamHandler';
import { GetGameGameIdSlotSlotIdCardsV1RequestParamHandler } from '../../../application/handlers/GetGameGameIdSlotSlotIdCardsV1RequestParamHandler';
import { GetGamesV1SpecsRequestParamHandler } from '../../../application/handlers/GetGamesV1SpecsRequestParamHandler';
import { GetGameV1GameIdRequestParamHandler } from '../../../application/handlers/GetGameV1GameIdRequestParamHandler';
import { GetGameV1MineRequestParamHandler } from '../../../application/handlers/GetGameV1MineRequestParamHandler';
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
        GetGameGameIdEventsV1SseController,
        GetGameGameIdSlotSlotIdCardsV1RequestController,
        GetGamesV1SpecsHttpRequestController,
        GetGameV1GameIdGameSpecHttpRequestController,
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
        GameApplicationModule.forRootAsync(gameImports),
        JsonSchemaModule,
        HttpModule,
      ],
      module: GameHttpApiModule,
      providers: [
        GameMiddleware,
        GetGameGameIdEventsV1RequestParamHandler,
        GetGameGameIdEventsV1SseController,
        GetGameGameIdSlotSlotIdCardsV1RequestController,
        GetGameGameIdSlotSlotIdCardsV1RequestParamHandler,
        GetGamesV1SpecsHttpRequestController,
        GetGamesV1SpecsRequestParamHandler,
        GetGameV1GameIdGameSpecHttpRequestController,
        GetGameV1GameIdHttpRequestController,
        GetGameV1GameIdRequestParamHandler,
        GetGameV1MineHttpRequestController,
        GetGameV1MineRequestParamHandler,
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
