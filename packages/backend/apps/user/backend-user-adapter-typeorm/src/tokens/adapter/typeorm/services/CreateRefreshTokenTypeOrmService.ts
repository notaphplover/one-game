import { Builder } from '@cornie-js/backend-common';
import { InsertTypeOrmPostgresService } from '@cornie-js/backend-db/adapter/typeorm';
import {
  RefreshToken,
  RefreshTokenCreateQuery,
} from '@cornie-js/backend-user-domain/tokens';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { RefreshTokenCreateQueryTypeOrmFromRefreshTokenCreateQueryBuilder } from '../builders/RefreshTokenCreateQueryTypeOrmFromRefreshTokenCreateQueryBuilder';
import { RefreshTokenFromRefreshTokenDbBuilder } from '../builders/RefreshTokenFromRefreshTokenDbBuilder';
import { RefreshTokenDb } from '../models/RefreshTokenDb';

@Injectable()
export class CreateRefreshTokenTypeOrmService extends InsertTypeOrmPostgresService<
  RefreshToken,
  RefreshTokenDb,
  RefreshTokenCreateQuery
> {
  constructor(
    @InjectRepository(RefreshTokenDb)
    repository: Repository<RefreshTokenDb>,
    @Inject(RefreshTokenFromRefreshTokenDbBuilder)
    refreshTokenFromRefreshTokenDbBuilder: Builder<
      RefreshTokenDb,
      [RefreshToken]
    >,
    @Inject(RefreshTokenCreateQueryTypeOrmFromRefreshTokenCreateQueryBuilder)
    refreshTokenCreateQueryTypeOrmFromRefreshTokenCreateQueryBuilder: Builder<
      QueryDeepPartialEntity<RefreshTokenDb>,
      [RefreshTokenCreateQuery]
    >,
  ) {
    super(
      repository,
      refreshTokenFromRefreshTokenDbBuilder,
      refreshTokenCreateQueryTypeOrmFromRefreshTokenCreateQueryBuilder,
    );
  }
}
