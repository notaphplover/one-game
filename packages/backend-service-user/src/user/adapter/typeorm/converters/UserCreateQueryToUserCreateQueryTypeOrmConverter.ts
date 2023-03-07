import { Injectable } from '@nestjs/common';
import { Converter } from '@one-game-js/backend-common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { UserCreateQuery } from '../../../domain/models/UserCreateQuery';
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
    };
  }
}
