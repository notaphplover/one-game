import {
  UserFindQuery,
  UserUpdateQuery,
} from '@cornie-js/backend-app-user-models/domain';
import { Converter } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';

import { UserDb } from '../models/UserDb';

@Injectable()
export class UserUpdateQueryToUserFindQueryTypeOrmConverter
  implements Converter<UserUpdateQuery, FindManyOptions<UserDb>>
{
  readonly #userFindQueryToUserFindQueryTypeOrmConverter: Converter<
    UserFindQuery,
    FindManyOptions<UserDb>
  >;

  constructor(
    userFindQueryToUserFindQueryTypeOrmConverter: Converter<
      UserFindQuery,
      FindManyOptions<UserDb>
    >,
  ) {
    this.#userFindQueryToUserFindQueryTypeOrmConverter =
      userFindQueryToUserFindQueryTypeOrmConverter;
  }

  public convert(userUpdateQuery: UserUpdateQuery): FindManyOptions<UserDb> {
    return this.#userFindQueryToUserFindQueryTypeOrmConverter.convert(
      userUpdateQuery.userFindQuery,
    );
  }
}
