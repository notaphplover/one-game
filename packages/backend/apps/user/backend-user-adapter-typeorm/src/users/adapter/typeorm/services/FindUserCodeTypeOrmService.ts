import { Builder } from '@cornie-js/backend-common';
import { FindTypeOrmServiceV2 } from '@cornie-js/backend-db';
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
export class FindUserCodeTypeOrmService extends FindTypeOrmServiceV2<
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
