import { userSeeds } from '@cornie-js/backend-app-user-seeds';
import { UserDb } from '@cornie-js/backend-user-adapter-typeorm/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { BaseSeeder } from '../../seeder/application/modules/BaseSeeder';

@Injectable()
export class UserSeeder extends BaseSeeder<UserDb> {
  constructor(
    @InjectRepository(UserDb)
    repository: Repository<UserDb>,
  ) {
    super(repository);
  }

  protected _getAppSeeds(): QueryDeepPartialEntity<UserDb>[] {
    return [];
  }

  protected _getDummySeeds(): QueryDeepPartialEntity<UserDb>[] {
    return [
      userSeeds.user1CreateQuery,
      userSeeds.user2CreateQuery,
      userSeeds.user3CreateQuery,
      userSeeds.user4CreateQuery,
    ];
  }

  protected _getEntityDiscriminatorProperties(): (keyof UserDb)[] {
    return ['id'];
  }
}
