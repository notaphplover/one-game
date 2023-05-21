import { DbModule, DbModuleOptions } from '@cornie-js/backend-app-game-db';
import { GameDb, GameSlotDb } from '@cornie-js/backend-app-game-db/entities';
import {
  gamePersistenceOutputPortSymbol,
  gameSlotPersistenceOutputPortSymbol,
} from '@cornie-js/backend-app-game-models/games/application';
import { UuidModule } from '@cornie-js/backend-app-uuid';
import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CardModule } from '../../../../cards/adapter/nest/modules/CardModule';
import { ActiveGameSlotV1FromActiveGameSlotBuilder } from '../../../application/builders/ActiveGameSlotV1FromActiveGameSlotBuilder';
import { GameCardSpecFromGameCardSpecV1Builder } from '../../../application/builders/GameCardSpecFromGameCardSpecV1Builder';
import { GameCardSpecsFromGameSpecV1Builder } from '../../../application/builders/GameCardSpecsFromGameSpecV1Builder';
import { GameCardSpecV1FromGameCardSpecBuilder } from '../../../application/builders/GameCardSpecV1FromGameCardSpecBuilder';
import { GameCreateQueryFromGameCreateQueryV1Builder } from '../../../application/builders/GameCreateQueryFromGameCreateQueryV1Builder';
import { GameDirectionV1FromGameDirectionBuilder } from '../../../application/builders/GameDirectionV1FromGameDirectionBuilder';
import { GameSlotCreateQueryFromGameSlotCreateQueryV1Builder } from '../../../application/builders/GameSlotCreateQueryFromGameSlotCreateQueryV1Builder';
import { GameSlotV1FromGameSlotBuilder } from '../../../application/builders/GameSlotV1FromGameSlotBuilder';
import { GameSpecV1FromGameCardSpecsBuilder } from '../../../application/builders/GameSpecV1FromGameCardSpecsBuilder';
import { GameV1FromGameBuilder } from '../../../application/builders/GameV1FromGameBuilder';
import { NonStartedGameSlotV1FromNonStartedGameSlotBuilder } from '../../../application/builders/NonStartedGameSlotV1FromNonStartedGameSlotBuilder';
import { NonStartedGameFilledEventHandler } from '../../../application/handlers/NonStartedGameFilledEventHandler';
import { GameManagementInputPort } from '../../../application/ports/input/GameManagementInputPort';
import { GameSlotManagementInputPort } from '../../../application/ports/input/GameSlotManagementInputPort';
import { GameService } from '../../../domain/services/GameService';
import { GameCanHoldMoreGameSlotsSpec } from '../../../domain/specs/GameCanHoldMoreGameSlotsSpec';
import { GameCanHoldOnlyOneMoreGameSlotSpec } from '../../../domain/specs/GameCanHoldOnlyOneMoreGameSlotSpec';

@Module({})
export class GameModule {
  public static forRootAsync(dbOptions: DbModuleOptions): DynamicModule {
    return {
      exports: [
        GameManagementInputPort,
        gamePersistenceOutputPortSymbol,
        GameSlotManagementInputPort,
        gameSlotPersistenceOutputPortSymbol,
      ],
      global: false,
      imports: [
        UuidModule,
        CardModule,
        DbModule.forRootAsync(dbOptions),
        TypeOrmModule.forFeature([GameDb, GameSlotDb]),
      ],
      module: GameModule,
      providers: [
        ActiveGameSlotV1FromActiveGameSlotBuilder,
        GameCanHoldMoreGameSlotsSpec,
        GameCanHoldOnlyOneMoreGameSlotSpec,
        GameCardSpecFromGameCardSpecV1Builder,
        GameCardSpecsFromGameSpecV1Builder,
        GameCardSpecV1FromGameCardSpecBuilder,
        GameCreateQueryFromGameCreateQueryV1Builder,
        GameCreateQueryFromGameCreateQueryV1Builder,
        GameDirectionV1FromGameDirectionBuilder,
        GameManagementInputPort,
        GameService,
        GameSlotManagementInputPort,
        GameSpecV1FromGameCardSpecsBuilder,
        GameV1FromGameBuilder,
        GameSlotCreateQueryFromGameSlotCreateQueryV1Builder,
        GameSlotV1FromGameSlotBuilder,
        GameV1FromGameBuilder,
        NonStartedGameFilledEventHandler,
        NonStartedGameSlotV1FromNonStartedGameSlotBuilder,
      ],
    };
  }
}
