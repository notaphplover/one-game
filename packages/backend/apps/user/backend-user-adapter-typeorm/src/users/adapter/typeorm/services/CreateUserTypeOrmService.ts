import { Builder } from '@cornie-js/backend-common';
import { InsertTypeOrmPostgresService } from '@cornie-js/backend-db/adapter/typeorm';
import { User, UserCreateQuery } from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { UserCreateQueryTypeOrmFromUserCreateQueryBuilder } from '../builders/UserCreateQueryTypeOrmFromUserCreateQueryBuilder';
import { UserFromUserDbBuilder } from '../builders/UserFromUserDbBuilder';
import { UserDb } from '../models/UserDb';

@Injectable()
export class CreateUserTypeOrmService extends InsertTypeOrmPostgresService<
  User,
  UserDb,
  UserCreateQuery
> {
  constructor(
    @InjectRepository(UserDb)
    repository: Repository<UserDb>,
    @Inject(UserFromUserDbBuilder)
    userFromUserDbBuilder: Builder<UserDb, [User]>,
    @Inject(UserCreateQueryTypeOrmFromUserCreateQueryBuilder)
    userCreateQueryTypeOrmFromUserCreateQueryBuilder: Builder<
      QueryDeepPartialEntity<UserDb>,
      [UserCreateQuery]
    >,
  ) {
    super(
      repository,
      userFromUserDbBuilder,
      userCreateQueryTypeOrmFromUserCreateQueryBuilder,
    );
  }
}
