import { GameCardSpec } from './GameCardSpec';
import { GameOptions } from './GameOptions';

export interface GameSpec {
  readonly cards: GameCardSpec[];
  readonly gameId: string;
  readonly gameSlotsAmount: number;
  readonly options: GameOptions;
}
