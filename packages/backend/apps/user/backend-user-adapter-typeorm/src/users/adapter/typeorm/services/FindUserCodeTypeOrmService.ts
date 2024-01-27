import { Builder } from '@cornie-js/backend-common';
import { FindTypeOrmService } from '@cornie-js/backend-db/adapter/typeorm';
import {
  UserCode,
  UserCodeFindQuery,
} from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import { UserCodeFindQueryTypeOrmFromUserCodeFindQueryBuilder } from '../builders/UserCodeFindQueryTypeOrmFromUserCodeFindQueryBuilder';
import { UserCodeFromUserDbCodeBuilder } from '../builders/UserCodeFromUserCodeDbBuilder';
import { UserCodeDb } from '../models/UserCodeDb';

@Injectable()
export class FindUserCodeTypeOrmService extends FindTypeOrmService<
  UserCode,
  UserCodeDb,
  UserCodeFindQuery
> {
  constructor(
    @InjectRepository(UserCodeDb)
    repository: Repository<UserCodeDb>,
    @Inject(UserCodeFromUserDbCodeBuilder)
    userCodeFromUserDbCodeBuilder: Builder<UserCode, [UserCodeDb]>,
    @Inject(UserCodeFindQueryTypeOrmFromUserCodeFindQueryBuilder)
    userCodeFindQueryTypeOrmFromUserCodeFindQueryBuilder: Builder<
      FindManyOptions<UserCodeDb>,
      [UserCodeFindQuery]
    >,
  ) {
    super(
      repository,
      userCodeFromUserDbCodeBuilder,
      userCodeFindQueryTypeOrmFromUserCodeFindQueryBuilder,
    );
  }
}
