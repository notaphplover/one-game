import { GameSpecCreateQuery } from './GameSpecCreateQuery';

export interface GameCreateQuery {
  readonly gameSlotsAmount: number;
  readonly id: string;
  readonly spec: GameSpecCreateQuery;
}
