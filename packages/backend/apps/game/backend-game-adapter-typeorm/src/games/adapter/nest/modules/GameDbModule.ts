import {
  gamePersistenceOutputPortSymbol,
  gameSlotPersistenceOutputPortSymbol,
  gameSpecPersistenceOutputPortSymbol,
} from '@cornie-js/backend-game-application/games';
import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CardDbModule } from '../../../../cards/adapter/nest/modules/CardDbModule';
import { DbModuleOptions } from '../../../../foundation/db/adapter/nest/models/DbModuleOptions';
import { DbModule } from '../../../../foundation/db/adapter/nest/modules/DbModule';
import { GamePersistenceTypeOrmAdapter } from '../../typeorm/adapters/GamePersistenceTypeOrmAdapter';
import { GameSlotPersistenceTypeOrmAdapter } from '../../typeorm/adapters/GameSlotPersistenceTypeOrmAdapter';
import { GameSpecPersistenceTypeOrmAdapter } from '../../typeorm/adapters/GameSpecPersistenceTypeOrmAdapter';
import { GameSpecCreateQueryTypeormFromGameGameSpecCreateQueryBuilder } from '../../typeorm/builders/GameSpecCreateQueryTypeormFromGameGameSpecCreateQueryBuilder';
import { GameSpecFindQueryTypeormFromGameSpecFindQueryBuilder } from '../../typeorm/builders/GameSpecFindQueryTypeormFromGameSpecFindQueryBuilder';
import { GameSpecFromGameSpecDbBuilder } from '../../typeorm/builders/GameSpecFromGameSpecDbBuilder';
import { GameCardSpecArrayToGameCardSpecArrayDbConverter } from '../../typeorm/converters/GameCardSpecArrayToGameCardSpecArrayDbConverter';
import { GameCreateQueryToGameCreateQueryTypeOrmConverter } from '../../typeorm/converters/GameCreateQueryToGameCreateQueryTypeOrmConverter';
import { GameDbToGameConverter } from '../../typeorm/converters/GameDbToGameConverter';
import { GameDirectionDbToGameDirectionConverter } from '../../typeorm/converters/GameDirectionDbToGameDirectionConverter';
import { GameDirectionToGameDirectionDbConverter } from '../../typeorm/converters/GameDirectionToGameDirectionDbConverter';
import { GameFindQueryToGameFindQueryTypeOrmConverter } from '../../typeorm/converters/GameFindQueryToGameFindQueryTypeOrmConverter';
import { GameSlotCreateQueryToGameSlotCreateQueryTypeOrmConverter } from '../../typeorm/converters/GameSlotCreateQueryToGameSlotCreateQueryTypeOrmConverter';
import { GameSlotDbToGameSlotConverter } from '../../typeorm/converters/GameSlotDbToGameSlotConverter';
import { GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter } from '../../typeorm/converters/GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter';
import { GameSlotUpdateQueryToGameSlotFindQueryTypeOrmConverter } from '../../typeorm/converters/GameSlotUpdateQueryToGameSlotFindQueryTypeOrmConverter';
import { GameSlotUpdateQueryToGameSlotSetQueryTypeOrmConverter } from '../../typeorm/converters/GameSlotUpdateQueryToGameSlotSetQueryTypeOrmConverter';
import { GameStatusToGameStatusDbConverter } from '../../typeorm/converters/GameStatusToGameStatusDbConverter';
import { GameUpdateQueryToGameFindQueryTypeOrmConverter } from '../../typeorm/converters/GameUpdateQueryToGameFindQueryTypeOrmConverter';
import { GameUpdateQueryToGameSetQueryTypeOrmConverter } from '../../typeorm/converters/GameUpdateQueryToGameSetQueryTypeOrmConverter';
import { GameDb } from '../../typeorm/models/GameDb';
import { GameSlotDb } from '../../typeorm/models/GameSlotDb';
import { GameSpecDb } from '../../typeorm/models/GameSpecDb';
import { CreateGameSlotTypeOrmService } from '../../typeorm/services/CreateGameSlotTypeOrmService';
import { CreateGameSpecTypeOrmService } from '../../typeorm/services/CreateGameSpecTypeOrmService';
import { CreateGameTypeOrmService } from '../../typeorm/services/CreateGameTypeOrmService';
import { FindGameSpecTypeOrmService } from '../../typeorm/services/FindGameSpecTypeOrmService';
import { FindGameTypeOrmService } from '../../typeorm/services/FindGameTypeOrmService';
import { UpdateGameSlotTypeOrmService } from '../../typeorm/services/UpdateGameSlotTypeOrmService';
import { UpdateGameTypeOrmService } from '../../typeorm/services/UpdateGameTypeOrmService';

@Module({})
export class GameDbModule {
  public static forRootAsync(dbModuleOptions: DbModuleOptions): DynamicModule {
    return {
      exports: [
        gamePersistenceOutputPortSymbol,
        gameSlotPersistenceOutputPortSymbol,
        gameSpecPersistenceOutputPortSymbol,
      ],
      global: false,
      imports: [
        CardDbModule,
        DbModule.forRootAsync(dbModuleOptions),
        TypeOrmModule.forFeature([GameDb, GameSlotDb, GameSpecDb]),
      ],
      module: GameDbModule,
      providers: [
        CreateGameSlotTypeOrmService,
        CreateGameSpecTypeOrmService,
        CreateGameTypeOrmService,
        FindGameTypeOrmService,
        FindGameSpecTypeOrmService,
        GameCardSpecArrayToGameCardSpecArrayDbConverter,
        GameCreateQueryToGameCreateQueryTypeOrmConverter,
        GameDbToGameConverter,
        GameDirectionDbToGameDirectionConverter,
        GameDirectionToGameDirectionDbConverter,
        GameFindQueryToGameFindQueryTypeOrmConverter,
        {
          provide: gamePersistenceOutputPortSymbol,
          useClass: GamePersistenceTypeOrmAdapter,
        },
        GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter,
        GameSlotUpdateQueryToGameSlotFindQueryTypeOrmConverter,
        GameSlotUpdateQueryToGameSlotSetQueryTypeOrmConverter,
        GameSpecCreateQueryTypeormFromGameGameSpecCreateQueryBuilder,
        GameSpecFindQueryTypeormFromGameSpecFindQueryBuilder,
        GameSpecFromGameSpecDbBuilder,
        {
          provide: gameSpecPersistenceOutputPortSymbol,
          useClass: GameSpecPersistenceTypeOrmAdapter,
        },
        GameStatusToGameStatusDbConverter,
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
