import { UserFindQuery } from './UserFindQuery';

export interface UserUpdateQuery {
  readonly userFindQuery: UserFindQuery;

  readonly active?: true;
  readonly name?: string;
}
