import {
  Game,
  GameCreateQuery,
  GameFindQuery,
  GameUpdateQuery,
} from '@cornie-js/backend-game-domain/games';

export interface GamePersistenceOutputPort {
  create(gameCreateQuery: GameCreateQuery): Promise<Game>;
  find(gameFindQuery: GameFindQuery): Promise<Game[]>;
  findOne(gameFindQuery: GameFindQuery): Promise<Game | undefined>;
  update(gameUpdateQuery: GameUpdateQuery): Promise<void>;
}

export const gamePersistenceOutputPortSymbol: symbol = Symbol.for(
  'GamePersistenceOutputPort',
);
