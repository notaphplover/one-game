import { GameCardSpec } from '../models/GameCardSpec';
import { GameOptionsCreateQuery } from './GameOptionsCreateQuery';

export interface GameSpecCreateQuery {
  readonly cards: GameCardSpec[];
  readonly options: GameOptionsCreateQuery;
}
