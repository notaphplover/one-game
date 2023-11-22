import { Builder } from '@cornie-js/backend-common';
import {
  FindQueryTypeOrmFromQueryBuilder,
  UpdateTypeOrmServiceV2,
} from '@cornie-js/backend-db';
import { UserUpdateQuery } from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { UserFindQueryTypeOrmFromUserUpdateQueryBuilder } from '../builders/UserFindQueryTypeOrmFromUserUpdateQueryBuilder';
import { UserUpdateQueryFromUserSetQueryTypeOrmBuilder } from '../builders/UserUpdateQueryFromUserSetQueryTypeOrmBuilder';
import { UserDb } from '../models/UserDb';

@Injectable()
export class UpdateUserTypeOrmService extends UpdateTypeOrmServiceV2<
  UserDb,
  UserUpdateQuery
> {
  constructor(
    @InjectRepository(UserDb)
    repository: Repository<UserDb>,
    @Inject(UserFindQueryTypeOrmFromUserUpdateQueryBuilder)
    userFindQueryTypeOrmFromUserUpdateQueryBuilder: FindQueryTypeOrmFromQueryBuilder<
      UserDb,
      UserUpdateQuery
    >,
    @Inject(UserUpdateQueryFromUserSetQueryTypeOrmBuilder)
    userUpdateQueryFromUserSetQueryTypeOrmBuilder: Builder<
      QueryDeepPartialEntity<UserDb>,
      [UserUpdateQuery]
    >,
  ) {
    super(
      repository,
      userFindQueryTypeOrmFromUserUpdateQueryBuilder,
      userUpdateQueryFromUserSetQueryTypeOrmBuilder,
    );
  }
}
