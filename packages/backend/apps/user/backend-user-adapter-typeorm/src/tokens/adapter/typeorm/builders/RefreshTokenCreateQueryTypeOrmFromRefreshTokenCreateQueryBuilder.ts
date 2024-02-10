import { Builder } from '@cornie-js/backend-common';
import { RefreshTokenCreateQuery } from '@cornie-js/backend-user-domain/tokens';
import { Injectable } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { RefreshTokenDb } from '../models/RefreshTokenDb';

@Injectable()
export class RefreshTokenCreateQueryTypeOrmFromRefreshTokenCreateQueryBuilder
  implements
    Builder<QueryDeepPartialEntity<RefreshTokenDb>, [RefreshTokenCreateQuery]>
{
  public build(
    refreshTokenCreateQuery: RefreshTokenCreateQuery,
  ): QueryDeepPartialEntity<RefreshTokenDb> {
    return {
      active: refreshTokenCreateQuery.active,
      family: refreshTokenCreateQuery.family,
      id: refreshTokenCreateQuery.id,
      token: refreshTokenCreateQuery.token,
    };
  }
}
