import { Game } from '@cornie-js/backend-app-game-models/games/domain';

export interface GameRequestContext extends Record<string | symbol, unknown> {
  game: Game;
}
