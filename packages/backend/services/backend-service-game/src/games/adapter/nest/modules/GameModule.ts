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
import { GameSpecV1FromGameCardSpecsBuilder } from '../../../application/builders/GameSpecV1FromGameCardSpecsBuilder';
import { GameV1FromGameBuilder } from '../../../application/builders/GameV1FromGameBuilder';
import { NonStartedGameSlotV1FromNonStartedGameSlotBuilder } from '../../../application/builders/NonStartedGameSlotV1FromNonStartedGameSlotBuilder';
import { GameManagementInputPort } from '../../../application/ports/input/GameManagementInputPort';
import { gamePersistenceOutputPortSymbol } from '../../../application/ports/output/GamePersistenceOutputPort';
import { GamePersistenceTypeOrmAdapter } from '../../typeorm/adapters/GamePersistenceTypeOrmAdapter';
import { GameCreateQueryToGameCreateQueryTypeOrmConverter } from '../../typeorm/converters/GameCreateQueryToGameCreateQueryTypeOrmConverter';
import { GameDbToGameConverter } from '../../typeorm/converters/GameDbToGameConverter';
import { GameDirectionDbToGameDirectionConverter } from '../../typeorm/converters/GameDirectionDbToGameDirectionConverter';
import { GameDirectionToGameDirectionDbConverter } from '../../typeorm/converters/GameDirectionToGameDirectionDbConverter';
import { GameSlotDbToGameSlotConverter } from '../../typeorm/converters/GameSlotDbToGameSlotConverter';
import { GameDb } from '../../typeorm/models/GameDb';
import { GameSlotDb } from '../../typeorm/models/GameSlotDb';
import { CreateGameTypeOrmService } from '../../typeorm/services/CreateGameTypeOrmService';

@Module({
  exports: [GameManagementInputPort, gamePersistenceOutputPortSymbol],
  imports: [
    CommonModule,
    CardModule,
    DbModule,
    TypeOrmModule.forFeature([GameDb, GameSlotDb]),
  ],
  providers: [
    ActiveGameSlotV1FromActiveGameSlotBuilder,
    CreateGameTypeOrmService,
    GameCardSpecFromGameCardSpecV1Builder,
    GameCardSpecsFromGameSpecV1Builder,
    GameCardSpecV1FromGameCardSpecBuilder,
    GameCreateQueryFromGameCreateQueryV1Builder,
    GameDirectionV1FromGameDirectionBuilder,
    GameSpecV1FromGameCardSpecsBuilder,
    GameV1FromGameBuilder,
    GameCreateQueryToGameCreateQueryTypeOrmConverter,
    GameCreateQueryFromGameCreateQueryV1Builder,
    GameDbToGameConverter,
    GameDirectionDbToGameDirectionConverter,
    GameDirectionToGameDirectionDbConverter,
    GameManagementInputPort,
    GameSlotDbToGameSlotConverter,
    GameV1FromGameBuilder,
    {
      provide: gamePersistenceOutputPortSymbol,
      useClass: GamePersistenceTypeOrmAdapter,
    },
    NonStartedGameSlotV1FromNonStartedGameSlotBuilder,
  ],
})
export class GameModule {}
