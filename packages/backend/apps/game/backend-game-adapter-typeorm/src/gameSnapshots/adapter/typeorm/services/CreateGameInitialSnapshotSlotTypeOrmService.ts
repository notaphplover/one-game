import { Builder } from '@cornie-js/backend-common';
import { InsertTypeOrmPostgresService } from '@cornie-js/backend-db/adapter/typeorm';
import {
  GameInitialSnapshotSlot,
  GameInitialSnapshotSlotCreateQuery,
} from '@cornie-js/backend-game-domain/gameSnapshots';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { GameInitialSnapshotSlotCreateQueryTypeOrmFromGameInitialSnapshotSlotCreateQueryBuilder } from '../builders/GameInitialSnapshotSlotCreateQueryTypeOrmFromGameInitialSnapshotSlotCreateQueryBuilder';
import { GameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder } from '../builders/GameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder';
import { GameInitialSnapshotSlotDb } from '../models/GameInitialSnapshotSlotDb';

@Injectable()
export class CreateGameInitialSnapshotSlotTypeOrmService extends InsertTypeOrmPostgresService<
  GameInitialSnapshotSlot,
  GameInitialSnapshotSlotDb,
  GameInitialSnapshotSlotCreateQuery
> {
  constructor(
    @InjectRepository(GameInitialSnapshotSlotDb)
    repository: Repository<GameInitialSnapshotSlotDb>,
    @Inject(GameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder)
    gameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder: Builder<
      GameInitialSnapshotSlot,
      [GameInitialSnapshotSlotDb]
    >,
    @Inject(
      GameInitialSnapshotSlotCreateQueryTypeOrmFromGameInitialSnapshotSlotCreateQueryBuilder,
    )
    gameInitialSnapshotSlotCreateQueryTypeOrmFromGameInitialSnapshotSlotCreateQueryBuilder: Builder<
      QueryDeepPartialEntity<GameInitialSnapshotSlotDb>,
      [GameInitialSnapshotSlotCreateQuery]
    >,
  ) {
    super(
      repository,
      gameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder,
      gameInitialSnapshotSlotCreateQueryTypeOrmFromGameInitialSnapshotSlotCreateQueryBuilder,
    );
  }
}
