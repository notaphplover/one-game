import { Builder } from '@cornie-js/backend-common';
import { DeleteTypeOrmService } from '@cornie-js/backend-db';
import { UserCodeFindQuery } from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import { UserCodeFindQueryTypeOrmFromUserCodeFindQueryBuilder } from '../builders/UserCodeFindQueryTypeOrmFromUserCodeFindQueryBuilder';
import { UserCodeDb } from '../models/UserCodeDb';

@Injectable()
export class DeleteUserCodeTypeOrmService extends DeleteTypeOrmService<
  UserCodeDb,
  UserCodeFindQuery
> {
  constructor(
    @InjectRepository(UserCodeDb)
    repository: Repository<UserCodeDb>,
    @Inject(UserCodeFindQueryTypeOrmFromUserCodeFindQueryBuilder)
    userCodeFindQueryTypeOrmFromUserCodeFindQueryBuilder: Builder<
      FindManyOptions<UserCodeDb>,
      [UserCodeFindQuery]
    >,
  ) {
    super(repository, userCodeFindQueryTypeOrmFromUserCodeFindQueryBuilder);
  }
}
