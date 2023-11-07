import { GameSpecCreateQuery } from './GameSpecCreateQuery';

export interface GameCreateQuery {
  readonly id: string;
  readonly name: string | undefined;
  readonly spec: GameSpecCreateQuery;
}
