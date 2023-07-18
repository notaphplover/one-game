import { Converter } from '@cornie-js/backend-common';
import { UserCodeCreateQuery } from '@cornie-js/backend-user-domain/users';
import { Injectable } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { UserCodeDb } from '../models/UserCodeDb';

@Injectable()
export class UserCodeCreateQueryToUserCodeCreateQueryTypeOrmConverter
  implements Converter<UserCodeCreateQuery, QueryDeepPartialEntity<UserCodeDb>>
{
  public convert(
    userCodeCreateQuery: UserCodeCreateQuery,
  ): QueryDeepPartialEntity<UserCodeDb> {
    return {
      code: userCodeCreateQuery.code,
      id: userCodeCreateQuery.id,
      user: {
        id: userCodeCreateQuery.userId,
      },
    };
  }
}
