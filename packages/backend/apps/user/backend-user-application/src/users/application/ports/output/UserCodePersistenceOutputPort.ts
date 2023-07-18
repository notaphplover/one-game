import {
  UserCode,
  UserCodeCreateQuery,
  UserCodeFindQuery,
} from '@cornie-js/backend-user-domain/users';

export interface UserCodePersistenceOutputPort {
  create(userCodeCreateQuery: UserCodeCreateQuery): Promise<UserCode>;
  delete(userCodeFindQuery: UserCodeFindQuery): Promise<void>;
  findOne(userCodeFindQuery: UserCodeFindQuery): Promise<UserCode | undefined>;
}

export const userCodePersistenceOutputPortSymbol: symbol = Symbol.for(
  'UserCodePersistenceOutputPort',
);
