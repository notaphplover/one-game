import { Builder } from '@cornie-js/backend-common';
import { UserCreateQuery } from '@cornie-js/backend-user-domain/users';
import { Injectable } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { UserDb } from '../models/UserDb';

@Injectable()
export class UserCreateQueryTypeOrmFromUserCreateQueryBuilder
  implements Builder<QueryDeepPartialEntity<UserDb>, [UserCreateQuery]>
{
  public build(
    userCreateQuery: UserCreateQuery,
  ): QueryDeepPartialEntity<UserDb> {
    return {
      active: userCreateQuery.active,
      email: userCreateQuery.email,
      id: userCreateQuery.id,
      name: userCreateQuery.name,
      passwordHash: userCreateQuery.passwordHash,
    };
  }
}
