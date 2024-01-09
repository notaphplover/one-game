import { Builder } from '@cornie-js/backend-common';
import {
  UserFindQuery,
  UserUpdateQuery,
} from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';

import { UserDb } from '../models/UserDb';
import { UserFindQueryTypeOrmFromUserFindQueryBuilder } from './UserFindQueryTypeOrmFromUserFindQueryBuilder';

@Injectable()
export class UserFindQueryTypeOrmFromUserUpdateQueryBuilder
  implements Builder<FindManyOptions<UserDb>, [UserUpdateQuery]>
{
  readonly #userFindQueryTypeOrmFromUserFindQueryBuilder: Builder<
    FindManyOptions<UserDb>,
    [UserFindQuery]
  >;

  constructor(
    @Inject(UserFindQueryTypeOrmFromUserFindQueryBuilder)
    userFindQueryTypeOrmFromUserFindQueryBuilder: Builder<
      FindManyOptions<UserDb>,
      [UserFindQuery]
    >,
  ) {
    this.#userFindQueryTypeOrmFromUserFindQueryBuilder =
      userFindQueryTypeOrmFromUserFindQueryBuilder;
  }

  public build(userUpdateQuery: UserUpdateQuery): FindManyOptions<UserDb> {
    return this.#userFindQueryTypeOrmFromUserFindQueryBuilder.build(
      userUpdateQuery.userFindQuery,
    );
  }
}
