import { Builder, Writable } from '@cornie-js/backend-common';
import { UserFindQuery } from '@cornie-js/backend-user-domain/users';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';

import { UserDb } from '../models/UserDb';

@Injectable()
export class UserFindQueryTypeOrmFromUserFindQueryBuilder
  implements Builder<FindManyOptions<UserDb>, [UserFindQuery]>
{
  public build(userFindQuery: UserFindQuery): FindManyOptions<UserDb> {
    const userFindQueryTypeOrmWhere: Writable<FindOptionsWhere<UserDb>> = {};

    const userFindQueryTypeOrm: FindManyOptions<UserDb> = {
      where: userFindQueryTypeOrmWhere,
    };

    if (userFindQuery.id !== undefined) {
      userFindQueryTypeOrmWhere.id = userFindQuery.id;
    }

    if (userFindQuery.email !== undefined) {
      userFindQueryTypeOrmWhere.email = userFindQuery.email;
    }

    return userFindQueryTypeOrm;
  }
}
