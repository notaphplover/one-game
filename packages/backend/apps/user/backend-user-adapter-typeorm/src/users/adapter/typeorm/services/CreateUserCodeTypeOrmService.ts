import { Converter } from '@cornie-js/backend-common';
import { InsertTypeOrmPostgresService } from '@cornie-js/backend-db';
import {
  UserCode,
  UserCodeCreateQuery,
} from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { UserCodeCreateQueryToUserCodeCreateQueryTypeOrmConverter } from '../converters/UserCodeCreateQueryToUserCodeCreateQueryTypeOrmConverter';
import { UserCodeDbToUserCodeConverter } from '../converters/UserCodeDbToUserCodeConverter';
import { UserCodeDb } from '../models/UserCodeDb';

@Injectable()
export class CreateUserCodeTypeOrmService extends InsertTypeOrmPostgresService<
  UserCode,
  UserCodeDb,
  UserCodeCreateQuery
> {
  constructor(
    @InjectRepository(UserCodeDb)
    repository: Repository<UserCodeDb>,
    @Inject(UserCodeDbToUserCodeConverter)
    userCodeDbToUserCodeConverter: Converter<UserCodeDb, UserCode>,
    @Inject(UserCodeCreateQueryToUserCodeCreateQueryTypeOrmConverter)
    userCodeCreateQueryToUserCodeCreateQueryTypeOrmConverter: Converter<
      UserCodeCreateQuery,
      QueryDeepPartialEntity<UserCodeDb>
    >,
  ) {
    super(
      repository,
      userCodeDbToUserCodeConverter,
      userCodeCreateQueryToUserCodeCreateQueryTypeOrmConverter,
    );
  }
}
