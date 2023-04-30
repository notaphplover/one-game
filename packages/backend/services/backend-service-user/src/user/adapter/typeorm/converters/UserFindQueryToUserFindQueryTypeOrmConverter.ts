import { ConverterAsync } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';

import { Writable } from '../../../../foundation/common/application/models/Writable';
import { UserFindQuery } from '../../../domain/models/UserFindQuery';
import { UserDb } from '../models/UserDb';

@Injectable()
export class UserFindQueryToUserFindQueryTypeOrmConverter
  implements ConverterAsync<UserFindQuery, FindManyOptions<UserDb>>
{
  public async convert(
    userFindQuery: UserFindQuery,
  ): Promise<FindManyOptions<UserDb>> {
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
