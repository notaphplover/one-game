import { GameCardSpec } from './GameCardSpec';

export interface BaseGame {
  readonly id: string;
  readonly spec: GameCardSpec[];
}
