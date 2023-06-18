import { Game } from '@cornie-js/backend-game-domain/games';

export interface GameRequestContext extends Record<string | symbol, unknown> {
  game: Game;
}
