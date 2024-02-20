import { Builder } from '@cornie-js/backend-common';
import {
  RefreshTokenFindQuery,
  RefreshTokenUpdateQuery,
} from '@cornie-js/backend-user-domain/tokens';
import { Inject, Injectable } from '@nestjs/common';
import { ObjectLiteral, QueryBuilder, WhereExpressionBuilder } from 'typeorm';

import { RefreshTokenFindQueryTypeOrmFromRefreshTokenFindQueryBuilder } from './RefreshTokenFindQueryTypeOrmFromRefreshTokenFindQueryBuilder';

@Injectable()
export class RefreshTokenFindQueryTypeOrmFromRefreshTokenUpdateQueryBuilder
  implements
    Builder<
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      [
        RefreshTokenUpdateQuery,
        QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      ]
    >
{
  readonly #refreshTokenFindQueryTypeOrmFromRefreshTokenFindQueryBuilder: Builder<
    QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
    [
      RefreshTokenFindQuery,
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
    ]
  >;

  constructor(
    @Inject(RefreshTokenFindQueryTypeOrmFromRefreshTokenFindQueryBuilder)
    refreshTokenFindQueryTypeOrmFromRefreshTokenFindQueryBuilder: Builder<
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      [
        RefreshTokenFindQuery,
        QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      ]
    >,
  ) {
    this.#refreshTokenFindQueryTypeOrmFromRefreshTokenFindQueryBuilder =
      refreshTokenFindQueryTypeOrmFromRefreshTokenFindQueryBuilder;
  }

  public build(
    refreshTokenUpdateQuery: RefreshTokenUpdateQuery,
    queryBuilder: QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
  ): QueryBuilder<ObjectLiteral> & WhereExpressionBuilder {
    return this.#refreshTokenFindQueryTypeOrmFromRefreshTokenFindQueryBuilder.build(
      refreshTokenUpdateQuery.findQuery,
      queryBuilder,
    );
  }
}
