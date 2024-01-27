import { Builder } from '@cornie-js/backend-common';
import { DeleteTypeOrmService } from '@cornie-js/backend-db/adapter/typeorm';
import { UserFindQuery } from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import { UserFindQueryTypeOrmFromUserFindQueryBuilder } from '../builders/UserFindQueryTypeOrmFromUserFindQueryBuilder';
import { UserDb } from '../models/UserDb';

@Injectable()
export class DeleteUserTypeOrmService extends DeleteTypeOrmService<
  UserDb,
  UserFindQuery
> {
  constructor(
    @InjectRepository(UserDb)
    repository: Repository<UserDb>,
    @Inject(UserFindQueryTypeOrmFromUserFindQueryBuilder)
    userFindQueryTypeOrmFromUserFindQueryBuilder: Builder<
      FindManyOptions<UserDb>,
      [UserFindQuery]
    >,
  ) {
    super(repository, userFindQueryTypeOrmFromUserFindQueryBuilder);
  }
}
