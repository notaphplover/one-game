export interface GameActionFindQuery {
  id?: string;
  limit?: number;
  position?: {
    gt?: number;
  };
}
