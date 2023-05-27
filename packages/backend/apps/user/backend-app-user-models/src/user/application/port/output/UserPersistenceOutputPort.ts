import { User } from '../../../domain/models/User';
import { UserCreateQuery } from '../../../domain/models/UserCreateQuery';
import { UserFindQuery } from '../../../query/UserFindQuery';
import { UserUpdateQuery } from '../../../query/UserUpdateQuery';

export interface UserPersistenceOutputPort {
  create(userCreateQuery: UserCreateQuery): Promise<User>;
  findOne(userFindQuery: UserFindQuery): Promise<User | undefined>;
  update(userUpdateQuery: UserUpdateQuery): Promise<void>;
}

export const userPersistenceOutputPortSymbol: symbol = Symbol.for(
  'UserPersistenceOutputPort',
);
