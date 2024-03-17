import { Builder } from '@cornie-js/backend-common';
import { InsertTypeOrmQueryBuilderPostgresService } from '@cornie-js/backend-db/adapter/typeorm';
import {
  GameAction,
  GameActionCreateQuery,
} from '@cornie-js/backend-game-domain/gameActions';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertQueryBuilder, Repository } from 'typeorm';

import { GameActionCreateQueryTypeOrmFromGameActionCreateQueryBuilder } from '../builders/GameActionCreateQueryTypeOrmFromGameActionCreateQueryBuilder';
import { GameActionFromGameActionDbBuilder } from '../builders/GameActionFromGameActionDbBuilder';
import { GameActionDb } from '../models/GameActionDb';

@Injectable()
export class CreateGameActionTypeOrmService extends InsertTypeOrmQueryBuilderPostgresService<
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
      InsertQueryBuilder<GameActionDb>,
      [GameActionCreateQuery, InsertQueryBuilder<GameActionDb>]
    >,
  ) {
    super(
      repository,
      gameActionFromGameActionDbBuilder,
      gameActionCreateQueryTypeOrmFromGameActionCreateQueryBuilder,
    );
  }
}
