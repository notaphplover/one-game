import { GameState } from '../valueObjects/GameState';

export interface BaseGame<TState extends GameState> {
  readonly id: string;
  readonly name: string | null;
  readonly state: TState;
}
