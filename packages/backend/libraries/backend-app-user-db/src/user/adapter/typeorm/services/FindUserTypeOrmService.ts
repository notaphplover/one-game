import { User, UserFindQuery } from '@cornie-js/backend-app-user-models';
import { Converter, ConverterAsync } from '@cornie-js/backend-common';
import { FindTypeOrmService } from '@cornie-js/backend-db';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

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
