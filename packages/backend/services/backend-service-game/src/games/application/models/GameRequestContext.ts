import { Game } from '../../domain/models/Game';

export interface GameRequestContext extends Record<string | symbol, unknown> {
  game: Game;
}
