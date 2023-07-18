import { Converter } from '@cornie-js/backend-common';
import { FindTypeOrmService } from '@cornie-js/backend-db';
import {
  UserCode,
  UserCodeFindQuery,
} from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import { UserCodeDbToUserCodeConverter } from '../converters/UserCodeDbToUserCodeConverter';
import { UserCodeFindQueryToUserCodeFindQueryTypeOrmConverter } from '../converters/UserCodeFindQueryToUserCodeFindQueryTypeOrmConverter';
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
    @Inject(UserCodeDbToUserCodeConverter)
    userCodeDbToUserCodeConverter: Converter<UserCodeDb, UserCode>,
    @Inject(UserCodeFindQueryToUserCodeFindQueryTypeOrmConverter)
    userCodeFindQueryToUserCodeFindQueryTypeOrmConverter: Converter<
      UserCodeFindQuery,
      FindManyOptions<UserCodeDb>
    >,
  ) {
    super(
      repository,
      userCodeDbToUserCodeConverter,
      userCodeFindQueryToUserCodeFindQueryTypeOrmConverter,
    );
  }
}
