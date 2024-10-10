import { Builder } from '@cornie-js/backend-common';
import {
  UserCodeCreateQuery,
  UserCodeKind,
} from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { UserCodeDb } from '../models/UserCodeDb';
import { UserCodeKindDb } from '../models/UserCodeKindDb';
import { UserCodeKindDbFromUserCodeKindBuilder } from './UserCodeKindDbFromUserCodeKindBuilder';

@Injectable()
export class UserCodeCreateQueryTypeOrmFromUserCodeCreateQueryBuilder
  implements Builder<QueryDeepPartialEntity<UserCodeDb>, [UserCodeCreateQuery]>
{
  readonly #userCodeKindDbFromUserCodeKindBuilder: Builder<
    UserCodeKindDb,
    [UserCodeKind]
  >;

  constructor(
    @Inject(UserCodeKindDbFromUserCodeKindBuilder)
    userCodeKindDbFromUserCodeKindBuilder: Builder<
      UserCodeKindDb,
      [UserCodeKind]
    >,
  ) {
    this.#userCodeKindDbFromUserCodeKindBuilder =
      userCodeKindDbFromUserCodeKindBuilder;
  }

  public build(
    userCodeCreateQuery: UserCodeCreateQuery,
  ): QueryDeepPartialEntity<UserCodeDb> {
    return {
      code: userCodeCreateQuery.code,
      id: userCodeCreateQuery.id,
      kind: this.#userCodeKindDbFromUserCodeKindBuilder.build(
        userCodeCreateQuery.kind,
      ),
      user: {
        id: userCodeCreateQuery.userId,
      },
    };
  }
}
