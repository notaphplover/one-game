import { User } from '../../../domain/models/User';
import { UserCreateQuery } from '../../../domain/models/UserCreateQuery';

export interface UserPersistenceOutputPort {
  create(userCreateQuery: UserCreateQuery): Promise<User>;
}

export const userPersistenceOutputPortSymbol: symbol = Symbol.for(
  'UserPersistenceOutputPort',
);
