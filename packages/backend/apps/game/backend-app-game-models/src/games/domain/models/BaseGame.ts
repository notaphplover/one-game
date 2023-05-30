import { GameCardSpec } from './GameCardSpec';
import { GameSpec } from './GameSpec';
import { GameState } from './GameState';

export interface BaseGame<TState extends GameState> {
  readonly deck: GameCardSpec[];
  readonly gameSlotsAmount: number;
  readonly id: string;
  readonly spec: GameSpec;
  readonly state: TState;
}
