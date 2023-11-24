import { GameCardSpec } from '../valueObjects/GameCardSpec';
import { GameOptionsCreateQuery } from './GameOptionsCreateQuery';

export interface GameSpecCreateQuery {
  readonly cards: GameCardSpec[];
  readonly gameId: string;
  readonly gameSlotsAmount: number;
  readonly id: string;
  readonly options: GameOptionsCreateQuery;
}
