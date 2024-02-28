import { Builder } from '@cornie-js/backend-common';
import { InsertTypeOrmPostgresService } from '@cornie-js/backend-db/adapter/typeorm';
import {
  GameInitialSnapshot,
  GameInitialSnapshotCreateQuery,
} from '@cornie-js/backend-game-domain/gameSnapshots';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { GameInitialSnapshotCreateQueryTypeOrmFromGameInitialSnapshotCreateQueryBuilder } from '../builders/GameInitialSnapshotCreateQueryTypeOrmFromGameInitialSnapshotCreateQueryBuilder';
import { GameInitialSnapshotFromGameInitialSnapshotDbBuilder } from '../builders/GameInitialSnapshotFromGameInitialSnapshotDbBuilder';
import { GameInitialSnapshotDb } from '../models/GameInitialSnapshotDb';

@Injectable()
export class CreateGameInitialSnapshotTypeOrmService extends InsertTypeOrmPostgresService<
  GameInitialSnapshot,
  GameInitialSnapshotDb,
  GameInitialSnapshotCreateQuery
> {
  constructor(
    @InjectRepository(GameInitialSnapshotDb)
    repository: Repository<GameInitialSnapshotDb>,
    @Inject(GameInitialSnapshotFromGameInitialSnapshotDbBuilder)
    gameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder: Builder<
      GameInitialSnapshot,
      [GameInitialSnapshotDb]
    >,
    @Inject(
      GameInitialSnapshotCreateQueryTypeOrmFromGameInitialSnapshotCreateQueryBuilder,
    )
    gameInitialSnapshotCreateQueryTypeOrmFromGameInitialSnapshotCreateQueryBuilder: Builder<
      QueryDeepPartialEntity<GameInitialSnapshotDb>,
      [GameInitialSnapshotCreateQuery]
    >,
  ) {
    super(
      repository,
      gameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder,
      gameInitialSnapshotCreateQueryTypeOrmFromGameInitialSnapshotCreateQueryBuilder,
    );
  }
}
