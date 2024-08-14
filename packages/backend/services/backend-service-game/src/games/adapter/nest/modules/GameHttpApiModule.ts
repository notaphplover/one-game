import { GameIoredisModule } from '@cornie-js/backend-game-adapter-ioredis';
import { GamePulsarModule } from '@cornie-js/backend-game-adapter-pulsar';
import {
  DbModule,
  GameActionDbModule,
  GameDbModule,
  GameSnapshotDbModule,
} from '@cornie-js/backend-game-adapter-typeorm';
import { GameHttpApiModule as GameHttpApiApplicationModule } from '@cornie-js/backend-game-application';
import { Module } from '@nestjs/common';

import { buildDbModuleOptions } from '../../../../foundation/db/adapter/nest/calculations/buildDbModuleOptions';
import { HttpModule } from '../../../../foundation/http/adapter/nest/modules/HttpModule';
import { buildGamePulsarModuleOptions } from '../../../../foundation/pulsar/adapter/ioredis/calculations/buildGamePulsarModuleOptions';
import { buildIoredisModuleOptions } from '../../../../foundation/redis/adapter/ioredis/calculations/buildIoredisModuleOptions';
import { GetV1GamesGameIdHttpRequestNestController } from '../controllers/GetV1GamesGameIdHttpRequestNestController';
import { GetV1GamesGameIdSlotSlotIdCardsRequestNestController } from '../controllers/GetV1GamesGameIdSlotSlotIdCardsRequestNestController';
import { GetV1GamesGameIdSpecHttpRequestNestController } from '../controllers/GetV1GamesGameIdSpecHttpRequestNestController';
import { GetV1GamesHttpRequestNestController } from '../controllers/GetV1GamesHttpRequestNestController';
import { GetV1GamesMineHttpRequestNestController } from '../controllers/GetV1GamesMineHttpRequestNestController';
import { GetV1GamesSpecsHttpRequestNestController } from '../controllers/GetV1GamesSpecsHttpRequestNestController';
import { GetV2EventsGamesGameIdRequestNestController } from '../controllers/GetV2EventsGamesGameIdRequestNestController';
import { PatchV1GamesGameIdHttpRequestNestController } from '../controllers/PatchV1GamesGameIdHttpRequestNestController';
import { PostV1GamesHttpRequestNestController } from '../controllers/PostV1GamesHttpRequestNestController';
import { PostV1GamesIdSlotHttpRequestNestController } from '../controllers/PostV1GamesIdSlotHttpRequestNestController';

@Module({
  controllers: [
    // Mind the order
    GetV2EventsGamesGameIdRequestNestController,
    GetV1GamesSpecsHttpRequestNestController,
    GetV1GamesHttpRequestNestController,
    GetV1GamesMineHttpRequestNestController,
    GetV1GamesGameIdSpecHttpRequestNestController,
    GetV1GamesGameIdHttpRequestNestController,
    GetV1GamesGameIdSlotSlotIdCardsRequestNestController,
    PatchV1GamesGameIdHttpRequestNestController,
    PostV1GamesHttpRequestNestController,
    PostV1GamesIdSlotHttpRequestNestController,
  ],
  imports: [
    GameHttpApiApplicationModule.forRootAsync([
      DbModule.forTransaction(),
      GameActionDbModule.forRootAsync(buildDbModuleOptions()),
      GameDbModule.forRootAsync(buildDbModuleOptions()),
      GameIoredisModule.forRootAsync(buildIoredisModuleOptions()),
      GamePulsarModule.forProducersAsync(buildGamePulsarModuleOptions()),
      GameSnapshotDbModule.forRootAsync(buildDbModuleOptions()),
    ]),
    HttpModule,
  ],
})
export class GameHttpApiModule {}
