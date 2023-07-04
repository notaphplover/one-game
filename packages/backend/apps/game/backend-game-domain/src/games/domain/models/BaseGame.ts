import { GameSpec } from './GameSpec';
import { GameState } from './GameState';

export interface BaseGame<TState extends GameState> {
  readonly id: string;
  readonly spec: GameSpec;
  readonly state: TState;
}
