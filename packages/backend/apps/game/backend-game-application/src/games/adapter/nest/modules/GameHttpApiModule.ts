import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';

import { AuthModule } from '../../../../auth/adapter/nest/modules/AuthModule';
import { HttpModule } from '../../../../foundation/http/adapter/nest/modules/HttpModule';
import { JsonSchemaModule } from '../../../../foundation/jsonSchema/adapter/nest/modules/JsonSchemaModule';
import { GetGameGameIdSlotSlotIdCardsV1RequestController } from '../../../application/controllers/GetGameGameIdSlotSlotIdCardsV1RequestController';
import { GetGameV1GameIdGameOptionsHttpRequestController } from '../../../application/controllers/GetGameV1GameIdGameOptionsHttpRequestController';
import { GetGameV1GameIdHttpRequestController } from '../../../application/controllers/GetGameV1GameIdHttpRequestController';
import { PostGameIdSlotV1HttpRequestController } from '../../../application/controllers/PostGameIdSlotV1HttpRequestController';
import { PostGameV1HttpRequestController } from '../../../application/controllers/PostGameV1HttpRequestController';
import { GetGameGameIdSlotSlotIdCardsV1RequestParamHandler } from '../../../application/handlers/GetGameGameIdSlotSlotIdCardsV1RequestParamHandler';
import { GetGameV1GameIdRequestParamHandler } from '../../../application/handlers/GetGameV1GameIdRequestParamHandler';
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
        GetGameGameIdSlotSlotIdCardsV1RequestController,
        GetGameV1GameIdGameOptionsHttpRequestController,
        GetGameV1GameIdHttpRequestController,
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
        GetGameGameIdSlotSlotIdCardsV1RequestController,
        GetGameGameIdSlotSlotIdCardsV1RequestParamHandler,
        GetGameV1GameIdGameOptionsHttpRequestController,
        GetGameV1GameIdHttpRequestController,
        GetGameV1GameIdRequestParamHandler,
        PostGameV1HttpRequestController,
        PostGameV1RequestParamHandler,
        PostGameIdSlotV1HttpRequestController,
        PostGameIdSlotV1RequestBodyHandler,
        PostGameIdSlotV1RequestParamHandler,
      ],
    };
  }
}
