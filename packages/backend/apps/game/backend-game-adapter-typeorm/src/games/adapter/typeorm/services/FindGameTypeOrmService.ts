import { Builder } from '@cornie-js/backend-common';
import { FindTypeOrmService } from '@cornie-js/backend-db/adapter/typeorm';
import { Game, GameFindQuery } from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ObjectLiteral,
  QueryBuilder,
  Repository,
  WhereExpressionBuilder,
} from 'typeorm';

import { GameFindQueryTypeOrmFromGameFindQueryBuilder } from '../builders/GameFindQueryTypeOrmFromGameFindQueryBuilder';
import { GameFromGameDbBuilder } from '../builders/GameFromGameDbBuilder';
import { GameDb } from '../models/GameDb';

@Injectable()
export class FindGameTypeOrmService extends FindTypeOrmService<
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
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      [GameFindQuery, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
    >,
  ) {
    super(
      repository,
      gameFromGameDbBuilder,
      gameFindQueryTypeOrmFromGameFindQueryBuilder,
    );
  }
}
