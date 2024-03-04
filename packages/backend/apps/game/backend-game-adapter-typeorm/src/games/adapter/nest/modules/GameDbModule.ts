import {
  gamePersistenceOutputPortSymbol,
  gameSlotPersistenceOutputPortSymbol,
  gameSpecPersistenceOutputPortSymbol,
} from '@cornie-js/backend-game-application/games';
import { DynamicModule, Module } from '@nestjs/common';

import { CardDbModule } from '../../../../cards/adapter/nest/modules/CardDbModule';
import { DbModuleOptions } from '../../../../foundation/db/adapter/nest/models/DbModuleOptions';
import { DbModule } from '../../../../foundation/db/adapter/nest/modules/DbModule';
import { GamePersistenceTypeOrmAdapter } from '../../typeorm/adapters/GamePersistenceTypeOrmAdapter';
import { GameSlotPersistenceTypeOrmAdapter } from '../../typeorm/adapters/GameSlotPersistenceTypeOrmAdapter';
import { GameSpecPersistenceTypeOrmAdapter } from '../../typeorm/adapters/GameSpecPersistenceTypeOrmAdapter';
import { GameCardSpecArrayDbFromGameCardSpecArrayBuilder } from '../../typeorm/builders/GameCardSpecArrayDbFromGameCardSpecArrayBuilder';
import { GameCardSpecArrayFromGameCardSpecArrayDbBuilder } from '../../typeorm/builders/GameCardSpecArrayFromGameCardSpecArrayDbBuilder';
import { GameCreateQueryTypeOrmFromGameCreateQueryBuilder } from '../../typeorm/builders/GameCreateQueryTypeOrmFromGameCreateQueryBuilder';
import { GameDirectionDbFromGameDirectionBuilder } from '../../typeorm/builders/GameDirectionDbFromGameDirectionBuilder';
import { GameDirectionFromGameDirectionDbBuilder } from '../../typeorm/builders/GameDirectionFromGameDirectionDbBuilder';
import { GameFindQueryTypeOrmFromGameFindQueryBuilder } from '../../typeorm/builders/GameFindQueryTypeOrmFromGameFindQueryBuilder';
import { GameFindQueryTypeOrmFromGameUpdateQueryBuilder } from '../../typeorm/builders/GameFindQueryTypeOrmFromGameUpdateQueryBuilder';
import { GameFromGameDbBuilder } from '../../typeorm/builders/GameFromGameDbBuilder';
import { GameSetQueryTypeOrmFromGameUpdateQueryBuilder } from '../../typeorm/builders/GameSetQueryTypeOrmFromGameUpdateQueryBuilder';
import { GameSlotCreateQueryTypeOrmFromGameSlotCreateQueryBuilder } from '../../typeorm/builders/GameSlotCreateQueryTypeOrmFromGameSlotCreateQueryBuilder';
import { GameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilder } from '../../typeorm/builders/GameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilder';
import { GameSlotFindQueryTypeOrmFromGameSlotUpdateQueryBuilder } from '../../typeorm/builders/GameSlotFindQueryTypeOrmFromGameSlotUpdateQueryBuilder';
import { GameSlotFromGameSlotDbBuilder } from '../../typeorm/builders/GameSlotFromGameSlotDbBuilder';
import { GameSlotSetQueryTypeOrmFromGameSlotUpdateQueryBuilder } from '../../typeorm/builders/GameSlotSetQueryTypeOrmFromGameSlotUpdateQueryBuilder';
import { GameSpecCreateQueryTypeormFromGameGameSpecCreateQueryBuilder } from '../../typeorm/builders/GameSpecCreateQueryTypeormFromGameGameSpecCreateQueryBuilder';
import { GameSpecFindQueryTypeormFromGameSpecFindQueryBuilder } from '../../typeorm/builders/GameSpecFindQueryTypeormFromGameSpecFindQueryBuilder';
import { GameSpecFromGameSpecDbBuilder } from '../../typeorm/builders/GameSpecFromGameSpecDbBuilder';
import { GameStatusDbFromGameStatusBuilder } from '../../typeorm/builders/GameStatusDbFromGameStatusBuilder';
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
        GameCardSpecArrayDbFromGameCardSpecArrayBuilder,
        GameCardSpecArrayFromGameCardSpecArrayDbBuilder,
        GameDirectionDbFromGameDirectionBuilder,
        GameDirectionFromGameDirectionDbBuilder,
      ],
      global: false,
      imports: [
        CardDbModule,
        DbModule.forRootAsync(dbModuleOptions),
        dbModuleOptions.builders.feature([GameDb, GameSlotDb, GameSpecDb]),
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
        GameCreateQueryTypeOrmFromGameCreateQueryBuilder,
        GameDirectionFromGameDirectionDbBuilder,
        GameDirectionDbFromGameDirectionBuilder,
        GameFindQueryTypeOrmFromGameFindQueryBuilder,
        GameFindQueryTypeOrmFromGameUpdateQueryBuilder,
        GameFromGameDbBuilder,
        {
          provide: gamePersistenceOutputPortSymbol,
          useClass: GamePersistenceTypeOrmAdapter,
        },
        GameSetQueryTypeOrmFromGameUpdateQueryBuilder,
        GameSlotCreateQueryTypeOrmFromGameSlotCreateQueryBuilder,
        GameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilder,
        GameSlotFindQueryTypeOrmFromGameSlotUpdateQueryBuilder,
        GameSlotFromGameSlotDbBuilder,
        GameSlotSetQueryTypeOrmFromGameSlotUpdateQueryBuilder,
        GameSpecCreateQueryTypeormFromGameGameSpecCreateQueryBuilder,
        GameSpecFindQueryTypeormFromGameSpecFindQueryBuilder,
        GameSpecFromGameSpecDbBuilder,
        {
          provide: gameSpecPersistenceOutputPortSymbol,
          useClass: GameSpecPersistenceTypeOrmAdapter,
        },
        GameStatusDbFromGameStatusBuilder,
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
