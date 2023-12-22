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
import { GameCardSpecArrayDbFromGameCardSpecArrayBuilder } from '../../typeorm/builders/GameCardSpecArrayDbFromGameCardSpecArrayBuilder';
import { GameCardSpecArrayFromGameCardSpecArrayDbBuilder } from '../../typeorm/builders/GameCardSpecArrayFromGameCardSpecArrayDbBuilder';
import { GameDirectionDbFromGameDirectionBuilder } from '../../typeorm/builders/GameDirectionDbFromGameDirectionBuilder';
import { GameDirectionFromGameDirectionDbBuilder } from '../../typeorm/builders/GameDirectionFromGameDirectionDbBuilder';
import { GameSpecCreateQueryTypeormFromGameGameSpecCreateQueryBuilder } from '../../typeorm/builders/GameSpecCreateQueryTypeormFromGameGameSpecCreateQueryBuilder';
import { GameSpecFindQueryTypeormFromGameSpecFindQueryBuilder } from '../../typeorm/builders/GameSpecFindQueryTypeormFromGameSpecFindQueryBuilder';
import { GameSpecFromGameSpecDbBuilder } from '../../typeorm/builders/GameSpecFromGameSpecDbBuilder';
import { GameStatusDbFromGameStatusBuilder } from '../../typeorm/builders/GameStatusDbFromGameStatusBuilder';
import { GameCreateQueryToGameCreateQueryTypeOrmConverter } from '../../typeorm/converters/GameCreateQueryToGameCreateQueryTypeOrmConverter';
import { GameDbToGameConverter } from '../../typeorm/converters/GameDbToGameConverter';
import { GameFindQueryToGameFindQueryTypeOrmConverter } from '../../typeorm/converters/GameFindQueryToGameFindQueryTypeOrmConverter';
import { GameSlotCreateQueryToGameSlotCreateQueryTypeOrmConverter } from '../../typeorm/converters/GameSlotCreateQueryToGameSlotCreateQueryTypeOrmConverter';
import { GameSlotDbToGameSlotConverter } from '../../typeorm/converters/GameSlotDbToGameSlotConverter';
import { GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter } from '../../typeorm/converters/GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter';
import { GameSlotUpdateQueryToGameSlotFindQueryTypeOrmConverter } from '../../typeorm/converters/GameSlotUpdateQueryToGameSlotFindQueryTypeOrmConverter';
import { GameSlotUpdateQueryToGameSlotSetQueryTypeOrmConverter } from '../../typeorm/converters/GameSlotUpdateQueryToGameSlotSetQueryTypeOrmConverter';
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
        GameCardSpecArrayDbFromGameCardSpecArrayBuilder,
        GameCardSpecArrayFromGameCardSpecArrayDbBuilder,
        GameCreateQueryToGameCreateQueryTypeOrmConverter,
        GameDbToGameConverter,
        GameDirectionFromGameDirectionDbBuilder,
        GameDirectionDbFromGameDirectionBuilder,
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
        GameStatusDbFromGameStatusBuilder,
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
