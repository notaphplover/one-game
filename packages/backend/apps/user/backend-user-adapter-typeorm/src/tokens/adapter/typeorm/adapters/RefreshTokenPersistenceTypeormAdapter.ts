import { TransactionWrapper } from '@cornie-js/backend-db/application';
import { RefreshTokenPersistenceOutputPort } from '@cornie-js/backend-user-application/tokens';
import {
  RefreshTokenCreateQuery,
  RefreshToken,
  RefreshTokenFindQuery,
} from '@cornie-js/backend-user-domain/tokens';
import { Inject, Injectable } from '@nestjs/common';

import { CreateRefreshTokenTypeOrmService } from '../services/CreateRefreshTokenTypeOrmService';
import { FindRefreshTokenTypeOrmService } from '../services/FindRefreshTokenTypeOrmService';

@Injectable()
export class RefreshTokenPersistenceTypeormAdapter
  implements RefreshTokenPersistenceOutputPort
{
  readonly #createRefreshTokenTypeOrmService: CreateRefreshTokenTypeOrmService;
  readonly #findRefreshTokenTypeOrmService: FindRefreshTokenTypeOrmService;

  constructor(
    @Inject(CreateRefreshTokenTypeOrmService)
    createRefreshTokenTypeOrmService: CreateRefreshTokenTypeOrmService,
    @Inject(FindRefreshTokenTypeOrmService)
    findRefreshTokenTypeOrmService: FindRefreshTokenTypeOrmService,
  ) {
    this.#createRefreshTokenTypeOrmService = createRefreshTokenTypeOrmService;
    this.#findRefreshTokenTypeOrmService = findRefreshTokenTypeOrmService;
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
}
