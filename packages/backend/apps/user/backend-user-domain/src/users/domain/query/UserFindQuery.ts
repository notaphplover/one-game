import { UserFindQuerySortOption } from './UserFindQuerySortOption';

export interface UserFindQuery {
  readonly email?: string;
  readonly id?: string;
  readonly ids?: string[];
  readonly limit?: number;
  readonly offset?: number;
  readonly sort?: UserFindQuerySortOption;
}
