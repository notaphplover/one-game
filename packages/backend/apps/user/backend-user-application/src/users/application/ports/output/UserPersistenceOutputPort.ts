import {
  User,
  UserCreateQuery,
  UserFindQuery,
  UserUpdateQuery,
} from '@cornie-js/backend-user-domain/users';

export interface UserPersistenceOutputPort {
  create(userCreateQuery: UserCreateQuery): Promise<User>;
  delete(userFindQuery: UserFindQuery): Promise<void>;
  findOne(userFindQuery: UserFindQuery): Promise<User | undefined>;
  update(userUpdateQuery: UserUpdateQuery): Promise<void>;
}

export const userPersistenceOutputPortSymbol: symbol = Symbol.for(
  'UserPersistenceOutputPort',
);
