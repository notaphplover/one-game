import { UserPersistenceOutputPort } from '@cornie-js/backend-app-user-models/application';
import {
  User,
  UserCreateQuery,
  UserFindQuery,
  UserUpdateQuery,
} from '@cornie-js/backend-app-user-models/domain';
import { Inject, Injectable } from '@nestjs/common';

import { CreateUserTypeOrmService } from '../services/CreateUserTypeOrmService';
import { FindUserTypeOrmService } from '../services/FindUserTypeOrmService';
import { UpdateUserTypeOrmService } from '../services/UpdateUserTypeOrmService';

@Injectable()
export class UserPersistenceTypeOrmAdapter
  implements UserPersistenceOutputPort
{
  readonly #createUserTypeOrmService: CreateUserTypeOrmService;
  readonly #findUserTypeOrmService: FindUserTypeOrmService;
  readonly #updateUserTypeOrmService: UpdateUserTypeOrmService;

  constructor(
    @Inject(CreateUserTypeOrmService)
    createUserTypeOrmService: CreateUserTypeOrmService,
    @Inject(FindUserTypeOrmService)
    findUserTypeOrmService: FindUserTypeOrmService,
    @Inject(UpdateUserTypeOrmService)
    updateUserTypeOrmService: UpdateUserTypeOrmService,
  ) {
    this.#createUserTypeOrmService = createUserTypeOrmService;
    this.#findUserTypeOrmService = findUserTypeOrmService;
    this.#updateUserTypeOrmService = updateUserTypeOrmService;
  }

  public async create(userCreateQuery: UserCreateQuery): Promise<User> {
    return this.#createUserTypeOrmService.insertOne(userCreateQuery);
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
