import { TransactionWrapper } from '@cornie-js/backend-db/application';
import { RefreshTokenPersistenceOutputPort } from '@cornie-js/backend-user-application/tokens';
import {
  RefreshToken,
  RefreshTokenCreateQuery,
  RefreshTokenFindQuery,
  RefreshTokenUpdateQuery,
} from '@cornie-js/backend-user-domain/tokens';
import { Inject, Injectable } from '@nestjs/common';

import { CreateRefreshTokenTypeOrmService } from '../services/CreateRefreshTokenTypeOrmService';
import { FindRefreshTokenTypeOrmService } from '../services/FindRefreshTokenTypeOrmService';
import { UpdateRefreshTokenTypeOrmService } from '../services/UpdateRefreshTokenTypeOrmService';

@Injectable()
export class RefreshTokenPersistenceTypeormAdapter
  implements RefreshTokenPersistenceOutputPort
{
  readonly #createRefreshTokenTypeOrmService: CreateRefreshTokenTypeOrmService;
  readonly #findRefreshTokenTypeOrmService: FindRefreshTokenTypeOrmService;
  readonly #updateRefreshTokenTypeOrmService: UpdateRefreshTokenTypeOrmService;

  constructor(
    @Inject(CreateRefreshTokenTypeOrmService)
    createRefreshTokenTypeOrmService: CreateRefreshTokenTypeOrmService,
    @Inject(FindRefreshTokenTypeOrmService)
    findRefreshTokenTypeOrmService: FindRefreshTokenTypeOrmService,
    @Inject(UpdateRefreshTokenTypeOrmService)
    updateRefreshTokenTypeOrmService: UpdateRefreshTokenTypeOrmService,
  ) {
    this.#createRefreshTokenTypeOrmService = createRefreshTokenTypeOrmService;
    this.#findRefreshTokenTypeOrmService = findRefreshTokenTypeOrmService;
    this.#updateRefreshTokenTypeOrmService = updateRefreshTokenTypeOrmService;
  }

  public async create(
    refreshTokenCreateQuery: RefreshTokenCreateQuery,
    transactionWrapper?: TransactionWrapper | undefined,
  ): Promise<RefreshToken> {
    return this.#createRefreshTokenTypeOrmService.insertOne(
      refreshTokenCreateQuery,
      transactionWrapper,
    );
  }

  public async find(
    refreshTokenFindQuery: RefreshTokenFindQuery,
    transactionWrapper?: TransactionWrapper | undefined,
  ): Promise<RefreshToken[]> {
    return this.#findRefreshTokenTypeOrmService.find(
      refreshTokenFindQuery,
      transactionWrapper,
    );
  }

  public async findOne(
    refreshTokenFindQuery: RefreshTokenFindQuery,
    transactionWrapper?: TransactionWrapper | undefined,
  ): Promise<RefreshToken | undefined> {
    return this.#findRefreshTokenTypeOrmService.findOne(
      refreshTokenFindQuery,
      transactionWrapper,
    );
  }

  public async update(
    refreshTokenUpdateQuery: RefreshTokenUpdateQuery,
    transactionWrapper?: TransactionWrapper | undefined,
  ): Promise<void> {
    return this.#updateRefreshTokenTypeOrmService.update(
      refreshTokenUpdateQuery,
      transactionWrapper,
    );
  }
}
