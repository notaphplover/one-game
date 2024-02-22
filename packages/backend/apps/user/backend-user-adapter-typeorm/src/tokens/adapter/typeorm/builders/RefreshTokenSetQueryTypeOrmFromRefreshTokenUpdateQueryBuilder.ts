import { Builder, Writable } from '@cornie-js/backend-common';
import { RefreshTokenUpdateQuery } from '@cornie-js/backend-user-domain/tokens';
import { Injectable } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { RefreshTokenDb } from '../models/RefreshTokenDb';

@Injectable()
export class RefreshTokenSetQueryTypeOrmFromRefreshTokenUpdateQueryBuilder
  implements
    Builder<QueryDeepPartialEntity<RefreshTokenDb>, [RefreshTokenUpdateQuery]>
{
  public build(
    refreshTokenUpdateQuery: RefreshTokenUpdateQuery,
  ): QueryDeepPartialEntity<RefreshTokenDb> {
    const refreshTokenSetQueryTypeOrm: QueryDeepPartialEntity<
      Writable<RefreshTokenDb>
    > = {};

    if (refreshTokenUpdateQuery.active !== undefined) {
      refreshTokenSetQueryTypeOrm.active = refreshTokenUpdateQuery.active;
    }

    return refreshTokenSetQueryTypeOrm;
  }
}
