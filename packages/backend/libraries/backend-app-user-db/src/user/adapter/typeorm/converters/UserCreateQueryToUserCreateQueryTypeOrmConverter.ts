import { UserCreateQuery } from '@cornie-js/backend-app-user-models';
import { Converter } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { UserDb } from '../models/UserDb';

@Injectable()
export class UserCreateQueryToUserCreateQueryTypeOrmConverter
  implements Converter<UserCreateQuery, QueryDeepPartialEntity<UserDb>>
{
  public convert(
    userCreateQuery: UserCreateQuery,
  ): QueryDeepPartialEntity<UserDb> {
    return {
      email: userCreateQuery.email,
      id: userCreateQuery.id,
      name: userCreateQuery.name,
      passwordHash: userCreateQuery.passwordHash,
    };
  }
}
