import { TransactionContext } from '@cornie-js/backend-db/application';
import {
  Game,
  GameCreateQuery,
  GameFindQuery,
  GameUpdateQuery,
} from '@cornie-js/backend-game-domain/games';

export interface GamePersistenceOutputPort {
  create(
    gameCreateQuery: GameCreateQuery,
    transactionContext?: TransactionContext,
  ): Promise<Game>;
  find(gameFindQuery: GameFindQuery): Promise<Game[]>;
  findOne(gameFindQuery: GameFindQuery): Promise<Game | undefined>;
  update(gameUpdateQuery: GameUpdateQuery): Promise<void>;
}

export const gamePersistenceOutputPortSymbol: symbol = Symbol.for(
  'GamePersistenceOutputPort',
);
