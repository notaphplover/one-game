import { Builder } from '@cornie-js/backend-common';
import { FindTypeOrmServiceV2 } from '@cornie-js/backend-db';
import { User, UserFindQuery } from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import { UserFindQueryTypeOrmFromUserFindQueryBuilder } from '../builders/UserFindQueryTypeOrmFromUserFindQueryBuilder';
import { UserFromUserDbBuilder } from '../builders/UserFromUserDbBuilder';
import { UserDb } from '../models/UserDb';

@Injectable()
export class FindUserTypeOrmService extends FindTypeOrmServiceV2<
  User,
  UserDb,
  UserFindQuery
> {
  constructor(
    @InjectRepository(UserDb)
    repository: Repository<UserDb>,
    @Inject(UserFromUserDbBuilder)
    userFromUserDbBuilder: Builder<User, [UserDb]>,
    @Inject(UserFindQueryTypeOrmFromUserFindQueryBuilder)
    userFindQueryTypeOrmFromUserFindQueryBuilder: Builder<
      FindManyOptions<UserDb>,
      [UserFindQuery]
    >,
  ) {
    super(
      repository,
      userFromUserDbBuilder,
      userFindQueryTypeOrmFromUserFindQueryBuilder,
    );
  }
}
