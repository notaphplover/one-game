import { Builder } from '@cornie-js/backend-common';
import { InsertTypeOrmPostgresServiceV2 } from '@cornie-js/backend-db';
import {
  UserCode,
  UserCodeCreateQuery,
} from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { UserCodeCreateQueryTypeOrmFromUserCodeCreateQueryBuilder } from '../builders/UserCodeCreateQueryTypeOrmFromUserCodeCreateQueryBuilder';
import { UserCodeFromUserDbCodeBuilder } from '../builders/UserCodeFromUserCodeDbBuilder';
import { UserCodeDb } from '../models/UserCodeDb';

@Injectable()
export class CreateUserCodeTypeOrmService extends InsertTypeOrmPostgresServiceV2<
  UserCode,
  UserCodeDb,
  UserCodeCreateQuery
> {
  constructor(
    @InjectRepository(UserCodeDb)
    repository: Repository<UserCodeDb>,
    @Inject(UserCodeFromUserDbCodeBuilder)
    userCodeFromUserDbCodeBuilder: Builder<UserCode, [UserCodeDb]>,
    @Inject(UserCodeCreateQueryTypeOrmFromUserCodeCreateQueryBuilder)
    userCodeCreateQueryTypeOrmFromUserCodeCreateQueryBuilder: Builder<
      QueryDeepPartialEntity<UserCodeDb>,
      [UserCodeCreateQuery]
    >,
  ) {
    super(
      repository,
      userCodeFromUserDbCodeBuilder,
      userCodeCreateQueryTypeOrmFromUserCodeCreateQueryBuilder,
    );
  }
}
