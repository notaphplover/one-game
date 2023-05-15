import { GameCardSpec } from './GameCardSpec';

export interface BaseGame {
  readonly deck: GameCardSpec[];
  readonly gameSlotsAmount: number;
  readonly id: string;
  readonly spec: GameCardSpec[];
}
