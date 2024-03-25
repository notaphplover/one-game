export interface GameActionFindQuery {
  id?: string;
  gameId?: string;
  limit?: number;
  position?: {
    gt?: number;
  };
}
