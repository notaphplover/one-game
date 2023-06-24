import { GameCreateQuery } from '@cornie-js/backend-game-domain/games';

export interface GameCreatedEvent {
  gameCreateQuery: GameCreateQuery;
}
