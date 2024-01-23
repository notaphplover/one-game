import { Builder } from '@cornie-js/backend-common';
import { InsertTypeOrmPostgresServiceV2 } from '@cornie-js/backend-db';
import {
  ActiveGameSlot,
  GameSlotCreateQuery,
  NonStartedGameSlot,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { GameSlotCreateQueryTypeOrmFromGameSlotCreateQueryBuilder } from '../builders/GameSlotCreateQueryTypeOrmFromGameSlotCreateQueryBuilder';
import { GameSlotFromGameSlotDbBuilder } from '../builders/GameSlotFromGameSlotDbBuilder';
import { GameSlotDb } from '../models/GameSlotDb';

@Injectable()
export class CreateGameSlotTypeOrmService extends InsertTypeOrmPostgresServiceV2<
  ActiveGameSlot | NonStartedGameSlot,
  GameSlotDb,
  GameSlotCreateQuery
> {
  constructor(
    @InjectRepository(GameSlotDb)
    repository: Repository<GameSlotDb>,
    @Inject(GameSlotFromGameSlotDbBuilder)
    gameSlotFromGameSlotDbBuilder: Builder<
      ActiveGameSlot | NonStartedGameSlot,
      [GameSlotDb]
    >,
    @Inject(GameSlotCreateQueryTypeOrmFromGameSlotCreateQueryBuilder)
    gameSlotCreateQueryTypeOrmFromGameSlotCreateQueryBuilder: Builder<
      QueryDeepPartialEntity<GameSlotDb>,
      [GameSlotCreateQuery]
    >,
  ) {
    super(
      repository,
      gameSlotFromGameSlotDbBuilder,
      gameSlotCreateQueryTypeOrmFromGameSlotCreateQueryBuilder,
    );
  }
}
