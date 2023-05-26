import { UserFindQuery } from './UserFindQuery';

export interface UserUpdateQuery {
  userFindQuery: UserFindQuery;

  name?: string;
}
