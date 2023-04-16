import { GameCardSpec } from './GameCardSpec';

export interface BaseGame {
  readonly gameSlotsAmount: number;
  readonly id: string;
  readonly spec: GameCardSpec[];
}
