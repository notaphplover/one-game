import { GameDomainModule } from '@cornie-js/backend-game-domain';
import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';

import { AuthModule } from '../../../../auth/adapter/nest/modules/AuthModule';
import { HttpModule } from '../../../../foundation/http/adapter/nest/modules/HttpModule';
import { JsonSchemaModule } from '../../../../foundation/jsonSchema/adapter/nest/modules/JsonSchemaModule';
import { GameActionApplicationModule } from '../../../../gameActions/adapter/nest/modules/GameActionApplicationModule';
import { GetV1GamesGameIdHttpRequestController } from '../../../application/controllers/GetV1GamesGameIdHttpRequestController';
import { GetV1GamesGameIdSlotSlotIdCardsRequestController } from '../../../application/controllers/GetV1GamesGameIdSlotSlotIdCardsRequestController';
import { GetV1GamesGameIdSpecHttpRequestController } from '../../../application/controllers/GetV1GamesGameIdSpecHttpRequestController';
import { GetV1GamesHttpRequestController } from '../../../application/controllers/GetV1GamesHttpRequestController';
import { GetV1GamesMineHttpRequestController } from '../../../application/controllers/GetV1GamesMineHttpRequestController';
import { GetV1GamesSpecsHttpRequestController } from '../../../application/controllers/GetV1GamesSpecsHttpRequestController';
import { GetV2GamesGameIdEventsSseController } from '../../../application/controllers/GetV2GamesGameIdEventsSseController';
import { PatchV1GamesGameIdHttpRequestController } from '../../../application/controllers/PatchV1GamesGameIdHttpRequestController';
import { PostV1GamesGameIdSlotsHttpRequestController } from '../../../application/controllers/PostV1GamesGameIdSlotsHttpRequestController';
import { PostV1GamesHttpRequestController } from '../../../application/controllers/PostV1GamesHttpRequestController';
import { GetV1GamesGameIdRequestParamHandler } from '../../../application/handlers/GetV1GamesGameIdRequestParamHandler';
import { GetV1GamesGameIdSlotSlotIdCardsRequestParamHandler } from '../../../application/handlers/GetV1GamesGameIdSlotSlotIdCardsRequestParamHandler';
import { GetV1GamesMineRequestParamHandler } from '../../../application/handlers/GetV1GamesMineRequestParamHandler';
import { GetV1GamesRequestParamHandler } from '../../../application/handlers/GetV1GamesRequestParamHandler';
import { GetV1GamesSpecsRequestParamHandler } from '../../../application/handlers/GetV1GamesSpecsRequestParamHandler';
import { GetV2GamesGameIdEventsRequestParamHandler } from '../../../application/handlers/GetV2GamesGameIdEventsRequestParamHandler';
import { PatchV1GamesGameIdRequestBodyParamHandler } from '../../../application/handlers/PatchV1GamesGameIdRequestBodyParamHandler';
import { PatchV1GamesGameIdRequestParamHandler } from '../../../application/handlers/PatchV1GamesGameIdRequestParamHandler';
import { PostV1GamesGameIdSlotRequestBodyHandler } from '../../../application/handlers/PostV1GamesGameIdSlotRequestBodyHandler';
import { PostV1GamesGameIdSlotsRequestParamHandler } from '../../../application/handlers/PostV1GamesGameIdSlotsRequestParamHandler';
import { PostV1GamesRequestParamHandler } from '../../../application/handlers/PostV1GamesRequestParamHandler';
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
        GetV2GamesGameIdEventsSseController,
        GetV1GamesGameIdSlotSlotIdCardsRequestController,
        GetV1GamesGameIdSpecHttpRequestController,
        GetV1GamesHttpRequestController,
        GetV1GamesMineHttpRequestController,
        GetV1GamesSpecsHttpRequestController,
        GetV1GamesGameIdHttpRequestController,
        PatchV1GamesGameIdHttpRequestController,
        PostV1GamesGameIdSlotsHttpRequestController,
        PostV1GamesHttpRequestController,
      ],
      global: false,
      imports: [
        ...(gameImports ?? []),
        AuthModule,
        GameActionApplicationModule.forRootAsync(gameImports),
        GameApplicationModule.forRootAsync(gameImports),
        GameDomainModule,
        JsonSchemaModule,
        HttpModule,
      ],
      module: GameHttpApiModule,
      providers: [
        GameMiddleware,
        GetV2GamesGameIdEventsRequestParamHandler,
        GetV2GamesGameIdEventsSseController,
        GetV1GamesGameIdSlotSlotIdCardsRequestController,
        GetV1GamesGameIdSlotSlotIdCardsRequestParamHandler,
        GetV1GamesGameIdRequestParamHandler,
        GetV1GamesGameIdSpecHttpRequestController,
        GetV1GamesHttpRequestController,
        GetV1GamesMineHttpRequestController,
        GetV1GamesMineRequestParamHandler,
        GetV1GamesRequestParamHandler,
        GetV1GamesSpecsHttpRequestController,
        GetV1GamesSpecsRequestParamHandler,
        GetV1GamesGameIdHttpRequestController,
        PatchV1GamesGameIdRequestBodyParamHandler,
        PatchV1GamesGameIdRequestParamHandler,
        PatchV1GamesGameIdHttpRequestController,
        PostV1GamesGameIdSlotsHttpRequestController,
        PostV1GamesGameIdSlotRequestBodyHandler,
        PostV1GamesGameIdSlotsRequestParamHandler,
        PostV1GamesHttpRequestController,
        PostV1GamesRequestParamHandler,
      ],
    };
  }
}
