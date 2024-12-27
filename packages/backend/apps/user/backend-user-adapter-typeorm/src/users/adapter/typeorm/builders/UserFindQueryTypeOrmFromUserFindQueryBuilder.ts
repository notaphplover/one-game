import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import {
  UserFindQuery,
  UserFindQuerySortOption,
} from '@cornie-js/backend-user-domain/users';
import { Injectable } from '@nestjs/common';
import {
  InstanceChecker,
  QueryBuilder,
  SelectQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';

import { BaseFindQueryToFindQueryTypeOrmBuilder } from '../../../../foundation/db/adapter/typeorm/builders/BaseFindQueryToFindQueryTypeOrmBuilder';
import { UserDb } from '../models/UserDb';

@Injectable()
export class UserFindQueryTypeOrmFromUserFindQueryBuilder
  extends BaseFindQueryToFindQueryTypeOrmBuilder
  implements
    Builder<
      QueryBuilder<UserDb> & WhereExpressionBuilder,
      [UserFindQuery, QueryBuilder<UserDb> & WhereExpressionBuilder]
    >
{
  public build(
    userFindQuery: UserFindQuery,
    queryBuilder: QueryBuilder<UserDb> & WhereExpressionBuilder,
  ): QueryBuilder<UserDb> & WhereExpressionBuilder {
    const userPropertiesPrefix: string = this._getEntityPrefix(
      queryBuilder,
      UserDb,
    );

    if (userFindQuery.email !== undefined) {
      queryBuilder.andWhere(
        `${userPropertiesPrefix}email = :${UserDb.name}email`,
        {
          [`${UserDb.name}email`]: userFindQuery.email,
        },
      );
    }

    if (userFindQuery.id !== undefined) {
      queryBuilder.andWhere(`${userPropertiesPrefix}id = :${UserDb.name}id`, {
        [`${UserDb.name}id`]: userFindQuery.id,
      });
    }

    this.#processIds(userFindQuery, userPropertiesPrefix, queryBuilder);

    if (userFindQuery.limit !== undefined) {
      this.#assertSelectQueryBuilderIsUsedForSelectFilters(queryBuilder);
      queryBuilder = queryBuilder.limit(userFindQuery.limit);
    }

    if (userFindQuery.offset !== undefined) {
      this.#assertSelectQueryBuilderIsUsedForSelectFilters(queryBuilder);
      queryBuilder = queryBuilder.offset(userFindQuery.offset);
    }

    this.#processSort(userFindQuery, userPropertiesPrefix, queryBuilder);

    return queryBuilder;
  }

  #assertSelectQueryBuilderIsUsedForSelectFilters(
    queryBuilder: QueryBuilder<UserDb>,
  ): asserts queryBuilder is SelectQueryBuilder<UserDb> {
    if (!InstanceChecker.isSelectQueryBuilder(queryBuilder)) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        'Error trying to filter users in a non search context',
      );
    }
  }

  #isArrayWithOneElement<T>(array: T[]): array is [T] {
    return array.length === 1;
  }

  #processIds(
    userFindQuery: UserFindQuery,
    userPropertiesPrefix: string,
    queryBuilder: QueryBuilder<UserDb> & WhereExpressionBuilder,
  ): void {
    if (userFindQuery.ids !== undefined) {
      if (userFindQuery.ids.length > 0) {
        if (this.#isArrayWithOneElement(userFindQuery.ids)) {
          const [id]: [string] = userFindQuery.ids;

          queryBuilder.andWhere(
            `${userPropertiesPrefix}id = :${UserDb.name}id`,
            {
              [`${UserDb.name}id`]: id,
            },
          );
        } else {
          queryBuilder.andWhere(
            `${userPropertiesPrefix}id IN (:...${UserDb.name}ids)`,
            {
              [`${UserDb.name}ids`]: userFindQuery.ids,
            },
          );
        }
      }
    }
  }

  #processSort(
    userFindQuery: UserFindQuery,
    userPropertiesPrefix: string,
    queryBuilder: QueryBuilder<UserDb> & WhereExpressionBuilder,
  ): void {
    if (userFindQuery.sort !== undefined) {
      this.#assertSelectQueryBuilderIsUsedForSelectFilters(queryBuilder);

      switch (userFindQuery.sort) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        case UserFindQuerySortOption.ids:
          if (userFindQuery.ids === undefined) {
            throw new AppError(
              AppErrorKind.unprocessableOperation,
              'Unable to sort users by ids. Reason: id list was not provided',
            );
          }

          if (userFindQuery.ids.length > 1) {
            /*
             * TODO: Consider extracting this to support different dbs.
             * The query builder has a datasource with options with a discriminator good enough to detect the current db.
             */
            queryBuilder = queryBuilder.addOrderBy(
              `array_position(ARRAY[:...${UserDb.name}ids], ${userPropertiesPrefix}id)`,
            );
          }
      }
    }
  }
}
