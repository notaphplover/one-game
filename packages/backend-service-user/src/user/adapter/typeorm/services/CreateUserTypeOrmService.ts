import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Converter } from '@one-game-js/backend-common';
import { InsertTypeOrmService } from '@one-game-js/backend-db';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { User } from '../../../domain/models/User';
import { UserCreateQuery } from '../../../domain/models/UserCreateQuery';
import { UserCreateQueryToUserCreateQueryTypeOrmConverter } from '../converters/UserCreateQueryToUserCreateQueryTypeOrmConverter';
import { UserDbToUserConverter } from '../converters/UserDbToUserConverter';
import { UserDb } from '../models/UserDb';

@Injectable()
export class CreateUserTypeOrmService extends InsertTypeOrmService<
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
