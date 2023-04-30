import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CardModule } from '../../../../cards/adapter/nest/modules/CardModule';
import { CommonModule } from '../../../../foundation/common/adapter/nest/modules/CommonModule';
import { DbModule } from '../../../../foundation/db/adapter/nest/modules/DbModule';
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
import { GameManagementInputPort } from '../../../application/ports/input/GameManagementInputPort';
import { GameSlotManagementInputPort } from '../../../application/ports/input/GameSlotManagementInputPort';
import { gamePersistenceOutputPortSymbol } from '../../../application/ports/output/GamePersistenceOutputPort';
import { gameSlotPersistenceOutputPortSymbol } from '../../../application/ports/output/GameSlotPersistenceOutputPort';
import { GameService } from '../../../domain/services/GameService';
import { GameCanHoldMoreGameSlotsSpec } from '../../../domain/specs/GameCanHoldMoreGameSlotsSpec';
import { GamePersistenceTypeOrmAdapter } from '../../typeorm/adapters/GamePersistenceTypeOrmAdapter';
import { GameSlotPersistenceTypeOrmAdapter } from '../../typeorm/adapters/GameSlotPersistenceTypeOrmAdapter';
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
import { GameUpdateQueryToGameFindQueryTypeOrmConverter } from '../../typeorm/converters/GameUpdateQueryToGameFindQueryTypeOrmConverter';
import { GameUpdateQueryToGameSetQueryTypeOrmConverter } from '../../typeorm/converters/GameUpdateQueryToGameSetQueryTypeOrmConverter';
import { GameDb } from '../../typeorm/models/GameDb';
import { GameSlotDb } from '../../typeorm/models/GameSlotDb';
import { CreateGameSlotTypeOrmService } from '../../typeorm/services/CreateGameSlotTypeOrmService';
import { CreateGameTypeOrmService } from '../../typeorm/services/CreateGameTypeOrmService';
import { FindGameTypeOrmService } from '../../typeorm/services/FindGameTypeOrmService';
import { UpdateGameTypeOrmService } from '../../typeorm/services/UpdateGameTypeOrmService';

@Module({
  exports: [
    GameManagementInputPort,
    gamePersistenceOutputPortSymbol,
    GameSlotManagementInputPort,
    gameSlotPersistenceOutputPortSymbol,
  ],
  imports: [
    CommonModule,
    CardModule,
    DbModule,
    TypeOrmModule.forFeature([GameDb, GameSlotDb]),
  ],
  providers: [
    ActiveGameSlotV1FromActiveGameSlotBuilder,
    CreateGameSlotTypeOrmService,
    CreateGameTypeOrmService,
    FindGameTypeOrmService,
    GameCanHoldMoreGameSlotsSpec,
    GameCardSpecArrayToGameCardSpecArrayDbConverter,
    GameCardSpecFromGameCardSpecV1Builder,
    GameCardSpecsFromGameSpecV1Builder,
    GameCardSpecV1FromGameCardSpecBuilder,
    GameCreateQueryFromGameCreateQueryV1Builder,
    GameCreateQueryFromGameCreateQueryV1Builder,
    GameCreateQueryToGameCreateQueryTypeOrmConverter,
    GameDbToGameConverter,
    GameDirectionDbToGameDirectionConverter,
    GameDirectionToGameDirectionDbConverter,
    GameDirectionV1FromGameDirectionBuilder,
    GameFindQueryToGameFindQueryTypeOrmConverter,
    GameManagementInputPort,
    GameService,
    GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter,
    GameSlotManagementInputPort,
    GameSlotUpdateQueryToGameSlotFindQueryTypeOrmConverter,
    GameSlotUpdateQueryToGameSlotSetQueryTypeOrmConverter,
    GameSpecV1FromGameCardSpecsBuilder,
    GameUpdateQueryToGameFindQueryTypeOrmConverter,
    GameUpdateQueryToGameSetQueryTypeOrmConverter,
    GameV1FromGameBuilder,
    {
      provide: gamePersistenceOutputPortSymbol,
      useClass: GamePersistenceTypeOrmAdapter,
    },
    GameSlotCreateQueryFromGameSlotCreateQueryV1Builder,
    GameSlotCreateQueryToGameSlotCreateQueryTypeOrmConverter,
    GameSlotDbToGameSlotConverter,
    {
      provide: gameSlotPersistenceOutputPortSymbol,
      useClass: GameSlotPersistenceTypeOrmAdapter,
    },
    GameSlotV1FromGameSlotBuilder,
    GameV1FromGameBuilder,
    NonStartedGameSlotV1FromNonStartedGameSlotBuilder,
    UpdateGameTypeOrmService,
  ],
})
export class GameModule {}
