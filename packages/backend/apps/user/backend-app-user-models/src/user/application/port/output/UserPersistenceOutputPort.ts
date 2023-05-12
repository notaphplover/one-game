import { User } from '../../../domain/models/User';
import { UserCreateQuery } from '../../../domain/models/UserCreateQuery';
import { UserFindQuery } from '../../../domain/models/UserFindQuery';

export interface UserPersistenceOutputPort {
  create(userCreateQuery: UserCreateQuery): Promise<User>;
  findOne(userFindQuery: UserFindQuery): Promise<User | undefined>;
}

export const userPersistenceOutputPortSymbol: symbol = Symbol.for(
  'UserPersistenceOutputPort',
);
