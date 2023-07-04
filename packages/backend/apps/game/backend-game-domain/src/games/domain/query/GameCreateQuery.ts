import { GameSpecCreateQuery } from './GameSpecCreateQuery';

export interface GameCreateQuery {
  readonly id: string;
  readonly spec: GameSpecCreateQuery;
}
