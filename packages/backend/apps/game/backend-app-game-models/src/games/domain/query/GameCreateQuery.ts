import { GameCardSpec } from '../models/GameCardSpec';

export interface GameCreateQuery {
  readonly gameSlotsAmount: number;
  readonly id: string;
  readonly spec: GameCardSpec[];
}
