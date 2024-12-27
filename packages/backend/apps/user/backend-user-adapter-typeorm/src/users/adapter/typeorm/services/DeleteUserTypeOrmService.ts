import { Builder } from '@cornie-js/backend-common';
import { DeleteTypeOrmQueryBuilderService } from '@cornie-js/backend-db/adapter/typeorm';
import { UserFindQuery } from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryBuilder, Repository, WhereExpressionBuilder } from 'typeorm';

import { UserFindQueryTypeOrmFromUserFindQueryBuilder } from '../builders/UserFindQueryTypeOrmFromUserFindQueryBuilder';
import { UserDb } from '../models/UserDb';

@Injectable()
export class DeleteUserTypeOrmService extends DeleteTypeOrmQueryBuilderService<
  UserDb,
  UserFindQuery
> {
  constructor(
    @InjectRepository(UserDb)
    repository: Repository<UserDb>,
    @Inject(UserFindQueryTypeOrmFromUserFindQueryBuilder)
    userFindQueryTypeOrmFromUserFindQueryBuilder: Builder<
      QueryBuilder<UserDb> & WhereExpressionBuilder,
      [UserFindQuery, QueryBuilder<UserDb> & WhereExpressionBuilder]
    >,
  ) {
    super(repository, userFindQueryTypeOrmFromUserFindQueryBuilder);
  }
}
