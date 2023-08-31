import { Game, GameUpdateQuery } from '@cornie-js/backend-game-domain/games';

export interface GameUpdatedEvent {
  gameBeforeUpdate: Game;
  gameUpdateQuery: GameUpdateQuery;
}
