import {
  Game,
  GameCreateQuery,
  GameFindQuery,
  GameUpdateQuery,
} from '@cornie-js/backend-app-game-domain/games/domain';

export interface GamePersistenceOutputPort {
  create(gameCreateQuery: GameCreateQuery): Promise<Game>;
  findOne(gameFindQuery: GameFindQuery): Promise<Game | undefined>;
  update(gameUpdateQuery: GameUpdateQuery): Promise<void>;
}

export const gamePersistenceOutputPortSymbol: symbol = Symbol.for(
  'GamePersistenceOutputPort',
);
