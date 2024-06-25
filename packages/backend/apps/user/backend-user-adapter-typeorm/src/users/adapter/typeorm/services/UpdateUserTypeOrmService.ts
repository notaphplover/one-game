import { Builder } from '@cornie-js/backend-common';
import {
  FindQueryTypeOrmFromQueryBuilder,
  UpdateTypeOrmService,
} from '@cornie-js/backend-db/adapter/typeorm';
import { UserUpdateQuery } from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { UserFindQueryTypeOrmFromUserUpdateQueryBuilder } from '../builders/UserFindQueryTypeOrmFromUserUpdateQueryBuilder';
import { UserSetQueryTypeOrmFromUserUpdateQueryBuilder } from '../builders/UserSetQueryTypeOrmFromUserUpdateQueryBuilder';
import { UserDb } from '../models/UserDb';

@Injectable()
export class UpdateUserTypeOrmService extends UpdateTypeOrmService<
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
    @Inject(UserSetQueryTypeOrmFromUserUpdateQueryBuilder)
    userSetQueryTypeOrmFromUserUpdateQueryBuilder: Builder<
      QueryDeepPartialEntity<UserDb>,
      [UserUpdateQuery]
    >,
  ) {
    super(
      repository,
      userFindQueryTypeOrmFromUserUpdateQueryBuilder,
      userSetQueryTypeOrmFromUserUpdateQueryBuilder,
    );
  }
}
