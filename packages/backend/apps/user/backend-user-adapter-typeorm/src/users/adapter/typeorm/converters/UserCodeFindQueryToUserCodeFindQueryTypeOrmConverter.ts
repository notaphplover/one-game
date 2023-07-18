import { Converter, Writable } from '@cornie-js/backend-common';
import { UserCodeFindQuery } from '@cornie-js/backend-user-domain/users';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';

import { UserCodeDb } from '../models/UserCodeDb';

@Injectable()
export class UserCodeFindQueryToUserCodeFindQueryTypeOrmConverter
  implements Converter<UserCodeFindQuery, FindManyOptions<UserCodeDb>>
{
  public convert(
    userCodeFindQuery: UserCodeFindQuery,
  ): FindManyOptions<UserCodeDb> {
    const userCodeFindQueryTypeOrmWhere: Writable<
      FindOptionsWhere<UserCodeDb>
    > = {};
    const userCodeFindQueryTypeOrm: FindManyOptions<UserCodeDb> = {
      where: userCodeFindQueryTypeOrmWhere,
    };

    if (userCodeFindQuery.code !== undefined) {
      userCodeFindQueryTypeOrmWhere.code = userCodeFindQuery.code;
    }

    if (userCodeFindQuery.userId !== undefined) {
      userCodeFindQueryTypeOrmWhere.user = {
        id: userCodeFindQuery.userId,
      };
    }

    return userCodeFindQueryTypeOrm;
  }
}
