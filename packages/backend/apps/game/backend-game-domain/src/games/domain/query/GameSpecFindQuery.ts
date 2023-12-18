import { GameSpecFindQuerySortOption } from './GameSpecFindQuerySortOption';

export interface GameSpecFindQuery {
  readonly limit?: number;
  readonly gameIds?: string[];
  readonly offset?: number;
  readonly sort?: GameSpecFindQuerySortOption;
}
