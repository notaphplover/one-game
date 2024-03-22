import { Builder } from '@cornie-js/backend-common';
import { FindTypeOrmQueryBuilderService } from '@cornie-js/backend-db/adapter/typeorm';
import {
  RefreshToken,
  RefreshTokenFindQuery,
} from '@cornie-js/backend-user-domain/tokens';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ObjectLiteral,
  QueryBuilder,
  Repository,
  WhereExpressionBuilder,
} from 'typeorm';

import { RefreshTokenFindQueryTypeOrmFromRefreshTokenFindQueryBuilder } from '../builders/RefreshTokenFindQueryTypeOrmFromRefreshTokenFindQueryBuilder';
import { RefreshTokenFromRefreshTokenDbBuilder } from '../builders/RefreshTokenFromRefreshTokenDbBuilder';
import { RefreshTokenDb } from '../models/RefreshTokenDb';

@Injectable()
export class FindRefreshTokenTypeOrmService extends FindTypeOrmQueryBuilderService<
  RefreshToken,
  RefreshTokenDb,
  RefreshTokenFindQuery
> {
  constructor(
    @InjectRepository(RefreshTokenDb)
    repository: Repository<RefreshTokenDb>,
    @Inject(RefreshTokenFromRefreshTokenDbBuilder)
    refreshTokenFromRefreshTokenDbBuilder: Builder<
      RefreshTokenDb,
      [RefreshToken]
    >,
    @Inject(RefreshTokenFindQueryTypeOrmFromRefreshTokenFindQueryBuilder)
    refreshTokenFindQueryTypeOrmFromRefreshTokenFindQueryBuilder: Builder<
      QueryBuilder<RefreshTokenDb> & WhereExpressionBuilder,
      [
        RefreshTokenFindQuery,
        QueryBuilder<RefreshTokenDb> & WhereExpressionBuilder,
      ]
    >,
  ) {
    super(
      repository,
      refreshTokenFromRefreshTokenDbBuilder,
      refreshTokenFindQueryTypeOrmFromRefreshTokenFindQueryBuilder,
    );
  }
}
