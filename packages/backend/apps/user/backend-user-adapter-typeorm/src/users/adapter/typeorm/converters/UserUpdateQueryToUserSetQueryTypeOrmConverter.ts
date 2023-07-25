import { Converter, Writable } from '@cornie-js/backend-common';
import { UserUpdateQuery } from '@cornie-js/backend-user-domain/users';
import { Injectable } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { UserDb } from '../models/UserDb';

@Injectable()
export class UserUpdateQueryToUserSetQueryTypeOrmConverter
  implements Converter<UserUpdateQuery, QueryDeepPartialEntity<UserDb>>
{
  public convert(
    userUpdateQuery: UserUpdateQuery,
  ): QueryDeepPartialEntity<UserDb> {
    const userSetQueryTypeOrm: Writable<QueryDeepPartialEntity<UserDb>> = {};

    if (userUpdateQuery.active !== undefined) {
      userSetQueryTypeOrm.active = userUpdateQuery.active;
    }

    if (userUpdateQuery.name !== undefined) {
      userSetQueryTypeOrm.name = userUpdateQuery.name;
    }

    return userSetQueryTypeOrm;
  }
}
