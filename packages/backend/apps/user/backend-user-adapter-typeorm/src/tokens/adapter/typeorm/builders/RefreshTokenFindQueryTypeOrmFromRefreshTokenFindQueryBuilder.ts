import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { Interval } from '@cornie-js/backend-user-domain/foundation/domain';
import { RefreshTokenFindQuery } from '@cornie-js/backend-user-domain/tokens';
import { Injectable } from '@nestjs/common';
import {
  InstanceChecker,
  ObjectLiteral,
  QueryBuilder,
  SelectQueryBuilder,
  ValueTransformer,
  WhereExpressionBuilder,
} from 'typeorm';

import { BaseFindQueryToFindQueryTypeOrmBuilder } from '../../../../foundation/db/adapter/typeorm/builders/BaseFindQueryToFindQueryTypeOrmBuilder';
import { RefreshTokenDb } from '../models/RefreshTokenDb';

@Injectable()
export class RefreshTokenFindQueryTypeOrmFromRefreshTokenFindQueryBuilder
  extends BaseFindQueryToFindQueryTypeOrmBuilder
  implements
    Builder<
      QueryBuilder<RefreshTokenDb> & WhereExpressionBuilder,
      [
        RefreshTokenFindQuery,
        QueryBuilder<RefreshTokenDb> & WhereExpressionBuilder,
      ]
    >
{
  public build(
    refreshTokenFindQuery: RefreshTokenFindQuery,
    queryBuilder: QueryBuilder<RefreshTokenDb> & WhereExpressionBuilder,
  ): QueryBuilder<RefreshTokenDb> & WhereExpressionBuilder {
    const propertiesPrefix: string = this._getEntityPrefix(
      queryBuilder,
      RefreshTokenDb,
    );

    if (refreshTokenFindQuery.active !== undefined) {
      const transformer: ValueTransformer = this._getSingleValueTransformer(
        queryBuilder,
        RefreshTokenDb,
        'active',
      );

      queryBuilder = queryBuilder.andWhere(
        `${propertiesPrefix}active = :${RefreshTokenDb.name}active`,
        {
          [`${RefreshTokenDb.name}active`]: transformer.to(
            refreshTokenFindQuery.active,
          ) as unknown,
        },
      );
    }

    if (refreshTokenFindQuery.date !== undefined) {
      queryBuilder = this.#handleDate(
        queryBuilder,
        propertiesPrefix,
        refreshTokenFindQuery.date,
      );
    }

    if (refreshTokenFindQuery.familyId !== undefined) {
      queryBuilder = queryBuilder.andWhere(
        `${propertiesPrefix}family = :${RefreshTokenDb.name}familyId`,
        {
          [`${RefreshTokenDb.name}familyId`]: refreshTokenFindQuery.familyId,
        },
      );
    }

    if (refreshTokenFindQuery.id !== undefined) {
      queryBuilder = queryBuilder.andWhere(
        `${propertiesPrefix}id = :${RefreshTokenDb.name}id`,
        {
          [`${RefreshTokenDb.name}id`]: refreshTokenFindQuery.id,
        },
      );
    }

    if (refreshTokenFindQuery.limit !== undefined) {
      this.#assertSelectQueryBuilderIsUsedForSelectFilters(queryBuilder);
      queryBuilder = queryBuilder.limit(refreshTokenFindQuery.limit);
    }

    if (refreshTokenFindQuery.offset !== undefined) {
      this.#assertSelectQueryBuilderIsUsedForSelectFilters(queryBuilder);
      queryBuilder = queryBuilder.take(refreshTokenFindQuery.offset);
    }

    return queryBuilder;
  }

  #assertSelectQueryBuilderIsUsedForSelectFilters(
    queryBuilder: QueryBuilder<ObjectLiteral>,
  ): asserts queryBuilder is SelectQueryBuilder<ObjectLiteral> {
    if (!InstanceChecker.isSelectQueryBuilder(queryBuilder)) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        `Error trying to filter a game with slot filter conditions in a non search context`,
      );
    }
  }

  #handleDate(
    queryBuilder: QueryBuilder<RefreshTokenDb> & WhereExpressionBuilder,
    propertiesPrefix: string,
    date: Interval<Date>,
  ): QueryBuilder<RefreshTokenDb> & WhereExpressionBuilder {
    if (date.from !== undefined) {
      queryBuilder = queryBuilder.andWhere(
        `${propertiesPrefix}createdAt >= :${RefreshTokenDb.name}dateFrom`,
        {
          [`${RefreshTokenDb.name}dateFrom`]: date.from,
        },
      );
    }

    if (date.to !== undefined) {
      queryBuilder = queryBuilder.andWhere(
        `${propertiesPrefix}createdAt < :${RefreshTokenDb.name}dateTo`,
        {
          [`${RefreshTokenDb.name}dateTo`]: date.to,
        },
      );
    }

    return queryBuilder;
  }
}
