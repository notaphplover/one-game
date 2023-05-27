import { UserFindQuery } from '@cornie-js/backend-app-user-models/domain';
import { Converter, Writable } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';

import { UserDb } from '../models/UserDb';

@Injectable()
export class UserFindQueryToUserFindQueryTypeOrmConverter
  implements Converter<UserFindQuery, FindManyOptions<UserDb>>
{
  public convert(userFindQuery: UserFindQuery): FindManyOptions<UserDb> {
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
