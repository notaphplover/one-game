import { Injectable } from '@nestjs/common';
import { ConverterAsync } from '@one-game-js/backend-common';
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

    return userFindQueryTypeOrm;
  }
}
