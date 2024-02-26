import { RefreshTokenFindQuery } from './RefreshTokenFindQuery';

export interface RefreshTokenUpdateQuery {
  active?: boolean;
  findQuery: RefreshTokenFindQuery;
}
