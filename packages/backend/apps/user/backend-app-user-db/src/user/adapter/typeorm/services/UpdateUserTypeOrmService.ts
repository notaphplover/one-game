import { UserUpdateQuery } from '@cornie-js/backend-app-user-models/domain';
import { Converter } from '@cornie-js/backend-common';
import {
  QueryToFindQueryTypeOrmConverter,
  UpdateTypeOrmService,
} from '@cornie-js/backend-db';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { UserUpdateQueryToUserFindQueryTypeOrmConverter } from '../converters/UserUpdateQueryToUserFindQueryTypeOrmConverter';
import { UserUpdateQueryToUserSetQueryTypeOrmConverter } from '../converters/UserUpdateQueryToUserSetQueryTypeOrmConverter';
import { UserDb } from '../models/UserDb';

@Injectable()
export class UpdateUserTypeOrmService extends UpdateTypeOrmService<
  UserDb,
  UserUpdateQuery
> {
  constructor(
    @InjectRepository(UserDb)
    repository: Repository<UserDb>,
    @Inject(UserUpdateQueryToUserFindQueryTypeOrmConverter)
    updateQueryToFindQueryTypeOrmConverter: QueryToFindQueryTypeOrmConverter<
      UserDb,
      UserUpdateQuery
    >,
    @Inject(UserUpdateQueryToUserSetQueryTypeOrmConverter)
    updateQueryToSetQueryTypeOrmConverter: Converter<
      UserUpdateQuery,
      QueryDeepPartialEntity<UserDb>
    >,
  ) {
    super(
      repository,
      updateQueryToFindQueryTypeOrmConverter,
      updateQueryToSetQueryTypeOrmConverter,
    );
  }
}
