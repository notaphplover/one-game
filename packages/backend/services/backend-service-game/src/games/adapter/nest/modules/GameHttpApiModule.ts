import { GameDbModule } from '@cornie-js/backend-app-game-db';
import { GameHttpApiModule as GameHttpApiApplicationModule } from '@cornie-js/backend-game-application';
import { Module } from '@nestjs/common';

import { buildDbModuleOptions } from '../../../../foundation/db/adapter/nest/calculations/buildDbModuleOptions';
import { HttpModule } from '../../../../foundation/http/adapter/nest/modules/HttpModule';
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
  imports: [
    GameHttpApiApplicationModule.forRootAsync([
      GameDbModule.forRootAsync(buildDbModuleOptions()),
    ]),
    HttpModule,
  ],
})
export class GameHttpApiModule {}
