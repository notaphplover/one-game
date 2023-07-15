import { GameDbModule } from '@cornie-js/backend-game-adapter-typeorm';
import { GameHttpApiModule as GameHttpApiApplicationModule } from '@cornie-js/backend-game-application';
import { Module } from '@nestjs/common';

import { buildDbModuleOptions } from '../../../../foundation/db/adapter/nest/calculations/buildDbModuleOptions';
import { HttpModule } from '../../../../foundation/http/adapter/nest/modules/HttpModule';
import { GetGameGameIdSlotSlotIdCardsV1RequestNestController } from '../controllers/GetGameGameIdSlotSlotIdCardsV1RequestNestController';
import { GetGameV1GameIdGameOptionsHttpRequestNestController } from '../controllers/GetGameV1GameIdGameOptionsHttpRequestNestController';
import { GetGameV1GameIdHttpRequestNestController } from '../controllers/GetGameV1GameIdHttpRequestNestController';
import { GetGameV1MineHttpRequestNestController } from '../controllers/GetGameV1MineHttpRequestNestController';
import { PatchGameV1GameIdHttpRequestNestController } from '../controllers/PatchGameV1GameIdHttpRequestNestController';
import { PostGameIdSlotV1HttpRequestNestController } from '../controllers/PostGameIdSlotV1HttpRequestNestController';
import { PostGameV1HttpRequestNestController } from '../controllers/PostGameV1HttpRequestNestController';

@Module({
  controllers: [
    // Mind the order
    GetGameV1MineHttpRequestNestController,
    GetGameV1GameIdGameOptionsHttpRequestNestController,
    GetGameV1GameIdHttpRequestNestController,
    GetGameGameIdSlotSlotIdCardsV1RequestNestController,
    PatchGameV1GameIdHttpRequestNestController,
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
