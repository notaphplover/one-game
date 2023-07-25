import { GameCardSpec } from './GameCardSpec';

export interface GameSpec {
  readonly cards: GameCardSpec[];
  readonly gameSlotsAmount: number;
}
