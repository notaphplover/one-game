import { GameSpecCreateQuery } from './GameSpecCreateQuery';

export interface GameCreateQuery {
  readonly id: string;
  readonly isPublic: boolean;
  readonly name: string | undefined;
  readonly spec: GameSpecCreateQuery;
}
