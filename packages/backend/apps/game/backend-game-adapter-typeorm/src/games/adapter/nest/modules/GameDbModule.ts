import {
  gameOptionsPersistenceOutputPortSymbol,
  gamePersistenceOutputPortSymbol,
  gameSlotPersistenceOutputPortSymbol,
} from '@cornie-js/backend-game-application/games';
import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CardDbModule } from '../../../../cards/adapter/nest/modules/CardDbModule';
import { DbModuleOptions } from '../../../../foundation/db/adapter/nest/models/DbModuleOptions';
import { DbModule } from '../../../../foundation/db/adapter/nest/modules/DbModule';
import { GameOptionsPersistenceTypeOrmAdapter } from '../../typeorm/adapters/GameOptionsPersistenceTypeOrmAdapter';
import { GamePersistenceTypeOrmAdapter } from '../../typeorm/adapters/GamePersistenceTypeOrmAdapter';
import { GameSlotPersistenceTypeOrmAdapter } from '../../typeorm/adapters/GameSlotPersistenceTypeOrmAdapter';
import { GameCardSpecArrayToGameCardSpecArrayDbConverter } from '../../typeorm/converters/GameCardSpecArrayToGameCardSpecArrayDbConverter';
import { GameCreateQueryToGameCreateQueryTypeOrmConverter } from '../../typeorm/converters/GameCreateQueryToGameCreateQueryTypeOrmConverter';
import { GameDbToGameConverter } from '../../typeorm/converters/GameDbToGameConverter';
import { GameDirectionDbToGameDirectionConverter } from '../../typeorm/converters/GameDirectionDbToGameDirectionConverter';
import { GameDirectionToGameDirectionDbConverter } from '../../typeorm/converters/GameDirectionToGameDirectionDbConverter';
import { GameFindQueryToGameFindQueryTypeOrmConverter } from '../../typeorm/converters/GameFindQueryToGameFindQueryTypeOrmConverter';
import { GameOptionsCreateQueryToGameOptionsCreateQueryTypeOrmConverter } from '../../typeorm/converters/GameOptionsCreateQueryToGameOptionsCreateQueryTypeOrmConverter';
import { GameOptionsDbToGameOptionsTypeOrmConverter } from '../../typeorm/converters/GameOptionsDbToGameOptionsTypeOrmConverter';
import { GameOptionsFindQueryToGameOptionsFindQueryTypeOrmConverter } from '../../typeorm/converters/GameOptionsFindQueryToGameOptionsFindQueryTypeOrmConverter';
import { GameSlotCreateQueryToGameSlotCreateQueryTypeOrmConverter } from '../../typeorm/converters/GameSlotCreateQueryToGameSlotCreateQueryTypeOrmConverter';
import { GameSlotDbToGameSlotConverter } from '../../typeorm/converters/GameSlotDbToGameSlotConverter';
import { GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter } from '../../typeorm/converters/GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter';
import { GameSlotUpdateQueryToGameSlotFindQueryTypeOrmConverter } from '../../typeorm/converters/GameSlotUpdateQueryToGameSlotFindQueryTypeOrmConverter';
import { GameSlotUpdateQueryToGameSlotSetQueryTypeOrmConverter } from '../../typeorm/converters/GameSlotUpdateQueryToGameSlotSetQueryTypeOrmConverter';
import { GameUpdateQueryToGameFindQueryTypeOrmConverter } from '../../typeorm/converters/GameUpdateQueryToGameFindQueryTypeOrmConverter';
import { GameUpdateQueryToGameSetQueryTypeOrmConverter } from '../../typeorm/converters/GameUpdateQueryToGameSetQueryTypeOrmConverter';
import { GameDb } from '../../typeorm/models/GameDb';
import { GameOptionsDb } from '../../typeorm/models/GameOptionsDb';
import { GameSlotDb } from '../../typeorm/models/GameSlotDb';
import { CreateGameOptionsTypeOrmService } from '../../typeorm/services/CreateGameOptionsTypeOrmService';
import { CreateGameSlotTypeOrmService } from '../../typeorm/services/CreateGameSlotTypeOrmService';
import { CreateGameTypeOrmService } from '../../typeorm/services/CreateGameTypeOrmService';
import { FindGameOptionsTypeOrmService } from '../../typeorm/services/FindGameOptionsTypeOrmService';
import { FindGameTypeOrmService } from '../../typeorm/services/FindGameTypeOrmService';
import { UpdateGameSlotTypeOrmService } from '../../typeorm/services/UpdateGameSlotTypeOrmService';
import { UpdateGameTypeOrmService } from '../../typeorm/services/UpdateGameTypeOrmService';

@Module({})
export class GameDbModule {
  public static forRootAsync(dbModuleOptions: DbModuleOptions): DynamicModule {
    return {
      exports: [
        gameOptionsPersistenceOutputPortSymbol,
        gamePersistenceOutputPortSymbol,
        gameSlotPersistenceOutputPortSymbol,
      ],
      global: false,
      imports: [
        CardDbModule,
        DbModule.forRootAsync(dbModuleOptions),
        TypeOrmModule.forFeature([GameDb, GameOptionsDb, GameSlotDb]),
      ],
      module: GameDbModule,
      providers: [
        CreateGameOptionsTypeOrmService,
        CreateGameSlotTypeOrmService,
        CreateGameTypeOrmService,
        FindGameTypeOrmService,
        FindGameOptionsTypeOrmService,
        GameCardSpecArrayToGameCardSpecArrayDbConverter,
        GameCreateQueryToGameCreateQueryTypeOrmConverter,
        GameDbToGameConverter,
        GameDirectionDbToGameDirectionConverter,
        GameDirectionToGameDirectionDbConverter,
        GameFindQueryToGameFindQueryTypeOrmConverter,
        GameOptionsCreateQueryToGameOptionsCreateQueryTypeOrmConverter,
        GameOptionsDbToGameOptionsTypeOrmConverter,
        GameOptionsFindQueryToGameOptionsFindQueryTypeOrmConverter,
        {
          provide: gameOptionsPersistenceOutputPortSymbol,
          useClass: GameOptionsPersistenceTypeOrmAdapter,
        },
        {
          provide: gamePersistenceOutputPortSymbol,
          useClass: GamePersistenceTypeOrmAdapter,
        },
        GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter,
        GameSlotUpdateQueryToGameSlotFindQueryTypeOrmConverter,
        GameSlotUpdateQueryToGameSlotSetQueryTypeOrmConverter,
        GameUpdateQueryToGameFindQueryTypeOrmConverter,
        GameUpdateQueryToGameSetQueryTypeOrmConverter,
        GameSlotCreateQueryToGameSlotCreateQueryTypeOrmConverter,
        GameSlotDbToGameSlotConverter,
        {
          provide: gameSlotPersistenceOutputPortSymbol,
          useClass: GameSlotPersistenceTypeOrmAdapter,
        },
        UpdateGameTypeOrmService,
        UpdateGameSlotTypeOrmService,
      ],
    };
  }
}
