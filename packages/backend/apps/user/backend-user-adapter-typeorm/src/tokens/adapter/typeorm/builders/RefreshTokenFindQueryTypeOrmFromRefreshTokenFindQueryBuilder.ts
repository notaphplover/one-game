import { Builder } from '@cornie-js/backend-common';
import { RefreshTokenFindQuery } from '@cornie-js/backend-user-domain/tokens';
import { Injectable } from '@nestjs/common';
import { ObjectLiteral, QueryBuilder, WhereExpressionBuilder } from 'typeorm';

import { BaseFindQueryToFindQueryTypeOrmBuilder } from '../../../../foundation/db/adapter/typeorm/builders/BaseFindQueryToFindQueryTypeOrmBuilder';
import { RefreshTokenDb } from '../models/RefreshTokenDb';

@Injectable()
export class RefreshTokenFindQueryTypeOrmFromRefreshTokenFindQueryBuilder
  extends BaseFindQueryToFindQueryTypeOrmBuilder
  implements
    Builder<
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      [
        RefreshTokenFindQuery,
        QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      ]
    >
{
  public build(
    refreshTokenFindQuery: RefreshTokenFindQuery,
    queryBuilder: QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
  ): QueryBuilder<ObjectLiteral> & WhereExpressionBuilder {
    const gamePropertiesPrefix: string = this._getEntityPrefix(
      queryBuilder,
      RefreshTokenDb,
    );

    if (refreshTokenFindQuery.id !== undefined) {
      queryBuilder = queryBuilder.andWhere(
        `${gamePropertiesPrefix}id = :${RefreshTokenDb.name}id`,
        {
          [`${RefreshTokenDb.name}id`]: refreshTokenFindQuery.id,
        },
      );
    }

    return queryBuilder;
  }
}
