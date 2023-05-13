import { UserDb } from '@cornie-js/backend-app-user-db/entities';
import { userSeeds } from '@cornie-js/backend-app-user-seeds';
import { DataSource } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { BaseSeeder } from '../../seeder/application/modules/BaseSeeder';

export class UserSeeder extends BaseSeeder<UserDb> {
  constructor(datasourde: DataSource) {
    super(datasourde.getRepository(UserDb));
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
}
