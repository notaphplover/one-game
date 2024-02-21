import { Builder } from '@cornie-js/backend-common';
import { UpdateTypeOrmQueryBuilderService } from '@cornie-js/backend-db/adapter/typeorm';
import { RefreshTokenUpdateQuery } from '@cornie-js/backend-user-domain/tokens';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ObjectLiteral,
  QueryBuilder,
  Repository,
  WhereExpressionBuilder,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { RefreshTokenFindQueryTypeOrmFromRefreshTokenUpdateQueryBuilder } from '../builders/RefreshTokenFindQueryTypeOrmFromRefreshTokenUpdateQueryBuilder';
import { RefreshTokenSetQueryTypeOrmFromRefreshTokenUpdateQueryBuilder } from '../builders/RefreshTokenSetQueryTypeOrmFromRefreshTokenUpdateQueryBuilder';
import { RefreshTokenDb } from '../models/RefreshTokenDb';

@Injectable()
export class UpdateRefreshTokenTypeOrmService extends UpdateTypeOrmQueryBuilderService<
  RefreshTokenDb,
  RefreshTokenUpdateQuery
> {
  constructor(
    @InjectRepository(RefreshTokenDb)
    repository: Repository<RefreshTokenDb>,
    @Inject(RefreshTokenFindQueryTypeOrmFromRefreshTokenUpdateQueryBuilder)
    refreshTokenFindQueryTypeOrmFromRefreshTokenUpdateQueryBuilder: Builder<
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      [
        RefreshTokenUpdateQuery,
        QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      ]
    >,
    @Inject(RefreshTokenSetQueryTypeOrmFromRefreshTokenUpdateQueryBuilder)
    refreshTokenSetQueryTypeOrmFromRefreshTokenUpdateQueryBuilder: Builder<
      QueryDeepPartialEntity<RefreshTokenDb>,
      [RefreshTokenUpdateQuery]
    >,
  ) {
    super(
      repository,
      refreshTokenFindQueryTypeOrmFromRefreshTokenUpdateQueryBuilder,
      refreshTokenSetQueryTypeOrmFromRefreshTokenUpdateQueryBuilder,
    );
  }
}
