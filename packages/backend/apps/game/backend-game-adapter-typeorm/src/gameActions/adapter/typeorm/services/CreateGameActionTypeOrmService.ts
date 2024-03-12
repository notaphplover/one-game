import { Builder } from '@cornie-js/backend-common';
import { InsertTypeOrmPostgresService } from '@cornie-js/backend-db/adapter/typeorm';
import {
  GameAction,
  GameActionCreateQuery,
} from '@cornie-js/backend-game-domain/gameActions';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { GameActionCreateQueryTypeOrmFromGameActionCreateQueryBuilder } from '../builders/GameActionCreateQueryTypeOrmFromGameActionCreateQueryBuilder';
import { GameActionFromGameActionDbBuilder } from '../builders/GameActionFromGameActionDbBuilder';
import { GameActionDb } from '../models/GameActionDb';

@Injectable()
export class CreateGameActionTypeOrmService extends InsertTypeOrmPostgresService<
  GameAction,
  GameActionDb,
  GameActionCreateQuery
> {
  constructor(
    @InjectRepository(GameActionDb)
    repository: Repository<GameActionDb>,
    @Inject(GameActionFromGameActionDbBuilder)
    gameActionFromGameActionDbBuilder: Builder<GameAction, [GameActionDb]>,
    @Inject(GameActionCreateQueryTypeOrmFromGameActionCreateQueryBuilder)
    gameActionCreateQueryTypeOrmFromGameActionCreateQueryBuilder: Builder<
      QueryDeepPartialEntity<GameActionDb>,
      [GameActionCreateQuery]
    >,
  ) {
    super(
      repository,
      gameActionFromGameActionDbBuilder,
      gameActionCreateQueryTypeOrmFromGameActionCreateQueryBuilder,
    );
  }
}
