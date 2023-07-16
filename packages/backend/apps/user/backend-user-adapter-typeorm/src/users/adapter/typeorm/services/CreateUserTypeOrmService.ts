import { Converter } from '@cornie-js/backend-common';
import { InsertTypeOrmPostgresService } from '@cornie-js/backend-db';
import { User, UserCreateQuery } from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { UserCreateQueryToUserCreateQueryTypeOrmConverter } from '../converters/UserCreateQueryToUserCreateQueryTypeOrmConverter';
import { UserDbToUserConverter } from '../converters/UserDbToUserConverter';
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
    @Inject(UserDbToUserConverter)
    userDbToUserConverter: Converter<UserDb, User>,
    @Inject(UserCreateQueryToUserCreateQueryTypeOrmConverter)
    userCreateQueryToUserCreateQueryTypeOrmConverter: Converter<
      UserCreateQuery,
      QueryDeepPartialEntity<UserDb>
    >,
  ) {
    super(
      repository,
      userDbToUserConverter,
      userCreateQueryToUserCreateQueryTypeOrmConverter,
    );
  }
}
