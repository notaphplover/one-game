import { Builder } from '@cornie-js/backend-common';
import { FindTypeOrmQueryBuilderService } from '@cornie-js/backend-db/adapter/typeorm';
import { Game, GameFindQuery } from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryBuilder, Repository, WhereExpressionBuilder } from 'typeorm';

import { GameFindQueryTypeOrmFromGameFindQueryBuilder } from '../builders/GameFindQueryTypeOrmFromGameFindQueryBuilder';
import { GameFromGameDbBuilder } from '../builders/GameFromGameDbBuilder';
import { GameDb } from '../models/GameDb';

@Injectable()
export class FindGameTypeOrmService extends FindTypeOrmQueryBuilderService<
  Game,
  GameDb,
  GameFindQuery
> {
  constructor(
    @InjectRepository(GameDb)
    repository: Repository<GameDb>,
    @Inject(GameFromGameDbBuilder)
    gameFromGameDbBuilder: Builder<Game, [GameDb]>,
    @Inject(GameFindQueryTypeOrmFromGameFindQueryBuilder)
    gameFindQueryTypeOrmFromGameFindQueryBuilder: Builder<
      QueryBuilder<GameDb> & WhereExpressionBuilder,
      [GameFindQuery, QueryBuilder<GameDb> & WhereExpressionBuilder]
    >,
  ) {
    super(
      repository,
      gameFromGameDbBuilder,
      gameFindQueryTypeOrmFromGameFindQueryBuilder,
    );
  }
}
