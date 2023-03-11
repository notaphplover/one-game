import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Converter, ConverterAsync } from '@one-game-js/backend-common';
import { FindTypeOrmService } from '@one-game-js/backend-db';
import { FindManyOptions, Repository } from 'typeorm';

import { User } from '../../../domain/models/User';
import { UserFindQuery } from '../../../domain/models/UserFindQuery';
import { UserDbToUserConverter } from '../converters/UserDbToUserConverter';
import { UserFindQueryToUserFindQueryTypeOrmConverter } from '../converters/UserFindQueryToUserFindQueryTypeOrmConverter';
import { UserDb } from '../models/UserDb';

@Injectable()
export class FindUserTypeOrmService extends FindTypeOrmService<
  User,
  UserDb,
  UserFindQuery
> {
  constructor(
    @InjectRepository(UserDb)
    repository: Repository<UserDb>,
    @Inject(UserDbToUserConverter)
    userDbToUserConverter: Converter<UserDb, User>,
    @Inject(UserFindQueryToUserFindQueryTypeOrmConverter)
    userCreateQueryToUserCreateQueryTypeOrmConverter: ConverterAsync<
      UserFindQuery,
      FindManyOptions<UserDb>
    >,
  ) {
    super(
      repository,
      userDbToUserConverter,
      userCreateQueryToUserCreateQueryTypeOrmConverter,
    );
  }
}
