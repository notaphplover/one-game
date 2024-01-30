import { TransactionContext } from '@cornie-js/backend-db/application';
import { UserCodePersistenceOutputPort } from '@cornie-js/backend-user-application/users';
import {
  UserCode,
  UserCodeCreateQuery,
  UserCodeFindQuery,
} from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';

import { CreateUserCodeTypeOrmService } from '../services/CreateUserCodeTypeOrmService';
import { DeleteUserCodeTypeOrmService } from '../services/DeleteUserCodeTypeOrmService';
import { FindUserCodeTypeOrmService } from '../services/FindUserCodeTypeOrmService';

@Injectable()
export class UserCodePersistenceTypeOrmAdapter
  implements UserCodePersistenceOutputPort
{
  readonly #createUserCodeTypeOrmService: CreateUserCodeTypeOrmService;
  readonly #deleteUserCodeTypeOrmService: DeleteUserCodeTypeOrmService;
  readonly #findUserCodeTypeOrmService: FindUserCodeTypeOrmService;

  constructor(
    @Inject(CreateUserCodeTypeOrmService)
    createUserCodeTypeOrmService: CreateUserCodeTypeOrmService,
    @Inject(DeleteUserCodeTypeOrmService)
    deleteUserCodeTypeOrmService: DeleteUserCodeTypeOrmService,
    @Inject(FindUserCodeTypeOrmService)
    findUserCodeTypeOrmService: FindUserCodeTypeOrmService,
  ) {
    this.#createUserCodeTypeOrmService = createUserCodeTypeOrmService;
    this.#deleteUserCodeTypeOrmService = deleteUserCodeTypeOrmService;
    this.#findUserCodeTypeOrmService = findUserCodeTypeOrmService;
  }

  public async create(
    userCodeCreateQuery: UserCodeCreateQuery,
    transactionContext?: TransactionContext,
  ): Promise<UserCode> {
    return this.#createUserCodeTypeOrmService.insertOne(
      userCodeCreateQuery,
      transactionContext,
    );
  }

  public async delete(userCodeFindQuery: UserCodeFindQuery): Promise<void> {
    await this.#deleteUserCodeTypeOrmService.delete(userCodeFindQuery);
  }

  public async findOne(
    userCodeFindQuery: UserCodeFindQuery,
  ): Promise<UserCode | undefined> {
    return this.#findUserCodeTypeOrmService.findOne(userCodeFindQuery);
  }
}
