import { Inject, Injectable } from '@nestjs/common';

import { UserPersistenceOutputPort } from '../../../application/ports/output/UserPersistenceOutputPort';
import { User } from '../../../domain/models/User';
import { UserCreateQuery } from '../../../domain/models/UserCreateQuery';
import { CreateUserTypeOrmService } from '../services/CreateUserTypeOrmService';

@Injectable()
export class UserPersistenceTypeOrmAdapter
  implements UserPersistenceOutputPort
{
  readonly #createUserTypeOrmService: CreateUserTypeOrmService;

  constructor(
    @Inject(CreateUserTypeOrmService)
    createUserTypeOrmService: CreateUserTypeOrmService,
  ) {
    this.#createUserTypeOrmService = createUserTypeOrmService;
  }

  public async create(userCreateQuery: UserCreateQuery): Promise<User> {
    return this.#createUserTypeOrmService.insertOne(userCreateQuery);
  }
}
