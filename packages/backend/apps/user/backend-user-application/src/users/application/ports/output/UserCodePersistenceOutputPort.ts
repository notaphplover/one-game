import { TransactionContext } from '@cornie-js/backend-db/application';
import {
  UserCode,
  UserCodeCreateQuery,
  UserCodeFindQuery,
} from '@cornie-js/backend-user-domain/users';

export interface UserCodePersistenceOutputPort {
  create(
    userCodeCreateQuery: UserCodeCreateQuery,
    transactionContext?: TransactionContext,
  ): Promise<UserCode>;
  delete(userCodeFindQuery: UserCodeFindQuery): Promise<void>;
  findOne(userCodeFindQuery: UserCodeFindQuery): Promise<UserCode | undefined>;
}

export const userCodePersistenceOutputPortSymbol: symbol = Symbol.for(
  'UserCodePersistenceOutputPort',
);
