import { TransactionWrapper } from '@cornie-js/backend-db/application';
import {
  RefreshToken,
  RefreshTokenCreateQuery,
  RefreshTokenFindQuery,
} from '@cornie-js/backend-user-domain/tokens';

export const refreshTokenPersistenceOutputPortSymbol: symbol = Symbol.for(
  'RefreshTokenPersistenceOutputPort',
);

export interface RefreshTokenPersistenceOutputPort {
  create(
    refreshTokenCreateQuery: RefreshTokenCreateQuery,
    transactionWrapper?: TransactionWrapper,
  ): Promise<RefreshToken>;

  find(
    refreshTokenFindQuery: RefreshTokenFindQuery,
    transactionWrapper?: TransactionWrapper,
  ): Promise<RefreshToken[]>;

  findOne(
    refreshTokenFindQuery: RefreshTokenFindQuery,
    transactionWrapper?: TransactionWrapper,
  ): Promise<RefreshToken | undefined>;
}
