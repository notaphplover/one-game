import { UserFindQuery } from './UserFindQuery';

export interface UserUpdateQuery {
  readonly userFindQuery: UserFindQuery;

  readonly name?: string;
}
