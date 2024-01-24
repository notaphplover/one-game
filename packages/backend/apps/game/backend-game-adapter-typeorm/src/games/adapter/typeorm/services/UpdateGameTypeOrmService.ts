import { Builder } from '@cornie-js/backend-common';
import { UpdateTypeOrmServiceV2 } from '@cornie-js/backend-db';
import { GameUpdateQuery } from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ObjectLiteral,
  QueryBuilder,
  Repository,
  WhereExpressionBuilder,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { GameFindQueryTypeOrmFromGameUpdateQueryBuilder } from '../builders/GameFindQueryTypeOrmFromGameUpdateQueryBuilder';
import { GameSetQueryTypeOrmFromGameUpdateQueryBuilder } from '../builders/GameSetQueryTypeOrmFromGameUpdateQueryBuilder';
import { GameDb } from '../models/GameDb';

@Injectable()
export class UpdateGameTypeOrmService extends UpdateTypeOrmServiceV2<
  GameDb,
  GameUpdateQuery
> {
  constructor(
    @InjectRepository(GameDb)
    repository: Repository<GameDb>,
    @Inject(GameFindQueryTypeOrmFromGameUpdateQueryBuilder)
    gameFindQueryTypeOrmFromGameUpdateQueryBuilder: Builder<
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      [GameUpdateQuery, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
    >,
    @Inject(GameSetQueryTypeOrmFromGameUpdateQueryBuilder)
    gameSetQueryTypeOrmFromGameUpdateQueryBuilder: Builder<
      QueryDeepPartialEntity<GameDb>,
      [GameUpdateQuery]
    >,
  ) {
    super(
      repository,
      gameFindQueryTypeOrmFromGameUpdateQueryBuilder,
      gameSetQueryTypeOrmFromGameUpdateQueryBuilder,
    );
  }
}
