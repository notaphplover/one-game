import { TransactionWrapper } from '@cornie-js/backend-db/application';
import {
  RefreshToken,
  RefreshTokenCreateQuery,
} from '@cornie-js/backend-user-domain/tokens';

export const refreshTokenPersistenceOutputPortSymbol: symbol = Symbol.for(
  'RefreshTokenPersistenceOutputPort',
);

export interface RefreshTokenPersistenceOutputPort {
  create(
    refreshTokenCreateQuery: RefreshTokenCreateQuery,
    transactionWrapper?: TransactionWrapper,
  ): Promise<RefreshToken>;
}
