import { TransactionWrapper } from '@cornie-js/backend-db/application';
import { RefreshTokenPersistenceOutputPort } from '@cornie-js/backend-user-application/tokens';
import {
  RefreshTokenCreateQuery,
  RefreshToken,
} from '@cornie-js/backend-user-domain/tokens';
import { Inject, Injectable } from '@nestjs/common';

import { CreateRefreshTokenTypeOrmService } from '../services/CreateRefreshTokenTypeOrmService';

@Injectable()
export class RefreshTokenPersistenceTypeormAdapter
  implements RefreshTokenPersistenceOutputPort
{
  readonly #createRefreshTokenTypeOrmService: CreateRefreshTokenTypeOrmService;

  constructor(
    @Inject(CreateRefreshTokenTypeOrmService)
    createRefreshTokenTypeOrmService: CreateRefreshTokenTypeOrmService,
  ) {
    this.#createRefreshTokenTypeOrmService = createRefreshTokenTypeOrmService;
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
}
