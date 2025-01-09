import { Builder } from '@cornie-js/backend-common';
import {
  UserFindQuery,
  UserUpdateQuery,
} from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';
import { QueryBuilder, WhereExpressionBuilder } from 'typeorm';

import { UserDb } from '../models/UserDb';
import { UserFindQueryTypeOrmFromUserFindQueryBuilder } from './UserFindQueryTypeOrmFromUserFindQueryBuilder';

@Injectable()
export class UserFindQueryTypeOrmFromUserUpdateQueryBuilder
  implements
    Builder<
      QueryBuilder<UserDb> & WhereExpressionBuilder,
      [UserUpdateQuery, QueryBuilder<UserDb> & WhereExpressionBuilder]
    >
{
  readonly #userFindQueryTypeOrmFromUserFindQueryBuilder: Builder<
    QueryBuilder<UserDb> & WhereExpressionBuilder,
    [UserFindQuery, QueryBuilder<UserDb> & WhereExpressionBuilder]
  >;

  constructor(
    @Inject(UserFindQueryTypeOrmFromUserFindQueryBuilder)
    userFindQueryTypeOrmFromUserFindQueryBuilder: Builder<
      QueryBuilder<UserDb> & WhereExpressionBuilder,
      [UserFindQuery, QueryBuilder<UserDb> & WhereExpressionBuilder]
    >,
  ) {
    this.#userFindQueryTypeOrmFromUserFindQueryBuilder =
      userFindQueryTypeOrmFromUserFindQueryBuilder;
  }

  public build(
    userUpdateQuery: UserUpdateQuery,
    queryBuilder: QueryBuilder<UserDb> & WhereExpressionBuilder,
  ): QueryBuilder<UserDb> & WhereExpressionBuilder {
    return this.#userFindQueryTypeOrmFromUserFindQueryBuilder.build(
      userUpdateQuery.userFindQuery,
      queryBuilder,
    );
  }
}
