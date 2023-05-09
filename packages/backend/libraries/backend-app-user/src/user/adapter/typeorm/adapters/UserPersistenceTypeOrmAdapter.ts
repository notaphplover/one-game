import { Inject, Injectable } from '@nestjs/common';

import { UserPersistenceOutputPort } from '../../../application/ports/output/UserPersistenceOutputPort';
import { User } from '../../../domain/models/User';
import { UserCreateQuery } from '../../../domain/models/UserCreateQuery';
import { UserFindQuery } from '../../../domain/models/UserFindQuery';
import { CreateUserTypeOrmService } from '../services/CreateUserTypeOrmService';
import { FindUserTypeOrmService } from '../services/FindUserTypeOrmService';

@Injectable()
export class UserPersistenceTypeOrmAdapter
  implements UserPersistenceOutputPort
{
  readonly #createUserTypeOrmService: CreateUserTypeOrmService;
  readonly #findUserTypeOrmService: FindUserTypeOrmService;

  constructor(
    @Inject(CreateUserTypeOrmService)
    createUserTypeOrmService: CreateUserTypeOrmService,
    @Inject(FindUserTypeOrmService)
    findUserTypeOrmService: FindUserTypeOrmService,
  ) {
    this.#createUserTypeOrmService = createUserTypeOrmService;
    this.#findUserTypeOrmService = findUserTypeOrmService;
  }

  public async create(userCreateQuery: UserCreateQuery): Promise<User> {
    return this.#createUserTypeOrmService.insertOne(userCreateQuery);
  }

  public async findOne(
    userFindQuery: UserFindQuery,
  ): Promise<User | undefined> {
    return this.#findUserTypeOrmService.findOne(userFindQuery);
  }
}
