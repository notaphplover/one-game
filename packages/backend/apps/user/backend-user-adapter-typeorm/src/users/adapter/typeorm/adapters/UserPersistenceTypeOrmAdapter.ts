import { TransactionWrapper } from '@cornie-js/backend-db/application';
import { UserPersistenceOutputPort } from '@cornie-js/backend-user-application/users';
import {
  User,
  UserCreateQuery,
  UserFindQuery,
  UserUpdateQuery,
} from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';

import { CreateUserTypeOrmService } from '../services/CreateUserTypeOrmService';
import { DeleteUserTypeOrmService } from '../services/DeleteUserTypeOrmService';
import { FindUserTypeOrmService } from '../services/FindUserTypeOrmService';
import { UpdateUserTypeOrmService } from '../services/UpdateUserTypeOrmService';

@Injectable()
export class UserPersistenceTypeOrmAdapter
  implements UserPersistenceOutputPort
{
  readonly #createUserTypeOrmService: CreateUserTypeOrmService;
  readonly #deleteUserTypeOrmService: DeleteUserTypeOrmService;
  readonly #findUserTypeOrmService: FindUserTypeOrmService;
  readonly #updateUserTypeOrmService: UpdateUserTypeOrmService;

  constructor(
    @Inject(CreateUserTypeOrmService)
    createUserTypeOrmService: CreateUserTypeOrmService,
    @Inject(DeleteUserTypeOrmService)
    deleteUserTypeOrmService: DeleteUserTypeOrmService,
    @Inject(FindUserTypeOrmService)
    findUserTypeOrmService: FindUserTypeOrmService,
    @Inject(UpdateUserTypeOrmService)
    updateUserTypeOrmService: UpdateUserTypeOrmService,
  ) {
    this.#createUserTypeOrmService = createUserTypeOrmService;
    this.#deleteUserTypeOrmService = deleteUserTypeOrmService;
    this.#findUserTypeOrmService = findUserTypeOrmService;
    this.#updateUserTypeOrmService = updateUserTypeOrmService;
  }

  public async create(
    userCreateQuery: UserCreateQuery,
    transactionWrapper?: TransactionWrapper,
  ): Promise<User> {
    return this.#createUserTypeOrmService.insertOne(
      userCreateQuery,
      transactionWrapper,
    );
  }

  public async delete(userFindQuery: UserFindQuery): Promise<void> {
    await this.#deleteUserTypeOrmService.delete(userFindQuery);
  }

  public async find(userFindQuery: UserFindQuery): Promise<User[]> {
    return this.#findUserTypeOrmService.find(userFindQuery);
  }

  public async findOne(
    userFindQuery: UserFindQuery,
  ): Promise<User | undefined> {
    return this.#findUserTypeOrmService.findOne(userFindQuery);
  }

  public async update(userUpdateQuery: UserUpdateQuery): Promise<void> {
    return this.#updateUserTypeOrmService.update(userUpdateQuery);
  }
}
