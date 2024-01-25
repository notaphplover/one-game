import { Builder } from '@cornie-js/backend-common';
import { FindTypeOrmService } from '@cornie-js/backend-db';
import {
  GameSpec,
  GameSpecFindQuery,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ObjectLiteral,
  QueryBuilder,
  Repository,
  WhereExpressionBuilder,
} from 'typeorm';

import { GameSpecFindQueryTypeormFromGameSpecFindQueryBuilder } from '../builders/GameSpecFindQueryTypeormFromGameSpecFindQueryBuilder';
import { GameSpecFromGameSpecDbBuilder } from '../builders/GameSpecFromGameSpecDbBuilder';
import { GameSpecDb } from '../models/GameSpecDb';

@Injectable()
export class FindGameSpecTypeOrmService extends FindTypeOrmService<
  GameSpec,
  GameSpecDb,
  GameSpecFindQuery
> {
  constructor(
    @InjectRepository(GameSpecDb)
    repository: Repository<GameSpecDb>,
    @Inject(GameSpecFromGameSpecDbBuilder)
    gameSpecFromGameSpecDbBuilder: Builder<GameSpec, [GameSpecDb]>,
    @Inject(GameSpecFindQueryTypeormFromGameSpecFindQueryBuilder)
    gameSpecFindQueryTypeormFromGameSpecFindQueryBuilder: Builder<
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      [GameSpecFindQuery, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
    >,
  ) {
    super(
      repository,
      gameSpecFromGameSpecDbBuilder,
      gameSpecFindQueryTypeormFromGameSpecFindQueryBuilder,
    );
  }
}
