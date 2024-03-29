import { GameIoredisModule } from '@cornie-js/backend-game-adapter-ioredis';
import {
  DbModule,
  GameDbModule,
  GameSnapshotDbModule,
  GameActionDbModule,
} from '@cornie-js/backend-game-adapter-typeorm';
import { GameHttpApiModule as GameHttpApiApplicationModule } from '@cornie-js/backend-game-application';
import { Module } from '@nestjs/common';

import { buildDbModuleOptions } from '../../../../foundation/db/adapter/nest/calculations/buildDbModuleOptions';
import { HttpModule } from '../../../../foundation/http/adapter/nest/modules/HttpModule';
import { buildIoredisModuleOptions } from '../../../../foundation/redis/adapter/ioredis/calculations/buildIoredisModuleOptions';
import { GetEventsGamesGameIdV2RequestNestController } from '../controllers/GetEventsGamesGameIdV2RequestNestController';
import { GetGameGameIdSlotSlotIdCardsV1RequestNestController } from '../controllers/GetGameGameIdSlotSlotIdCardsV1RequestNestController';
import { GetGamesV1GameIdSpecHttpRequestNestController } from '../controllers/GetGamesV1GameIdSpecHttpRequestNestController';
import { GetGamesV1SpecsHttpRequestNestController } from '../controllers/GetGamesV1SpecsHttpRequestNestController';
import { GetGameV1GameIdHttpRequestNestController } from '../controllers/GetGameV1GameIdHttpRequestNestController';
import { GetGameV1MineHttpRequestNestController } from '../controllers/GetGameV1MineHttpRequestNestController';
import { PatchGameV1GameIdHttpRequestNestController } from '../controllers/PatchGameV1GameIdHttpRequestNestController';
import { PostGameIdSlotV1HttpRequestNestController } from '../controllers/PostGameIdSlotV1HttpRequestNestController';
import { PostGameV1HttpRequestNestController } from '../controllers/PostGameV1HttpRequestNestController';

@Module({
  controllers: [
    // Mind the order
    GetEventsGamesGameIdV2RequestNestController,
    GetGamesV1SpecsHttpRequestNestController,
    GetGameV1MineHttpRequestNestController,
    GetGamesV1GameIdSpecHttpRequestNestController,
    GetGameV1GameIdHttpRequestNestController,
    GetGameGameIdSlotSlotIdCardsV1RequestNestController,
    PatchGameV1GameIdHttpRequestNestController,
    PostGameV1HttpRequestNestController,
    PostGameIdSlotV1HttpRequestNestController,
  ],
  imports: [
    GameHttpApiApplicationModule.forRootAsync([
      DbModule.forTransaction(),
      GameActionDbModule.forRootAsync(buildDbModuleOptions()),
      GameDbModule.forRootAsync(buildDbModuleOptions()),
      GameIoredisModule.forRootAsync(buildIoredisModuleOptions()),
      GameSnapshotDbModule.forRootAsync(buildDbModuleOptions()),
    ]),
    HttpModule,
  ],
})
export class GameHttpApiModule {}
