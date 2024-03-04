import { TransactionWrapper } from '@cornie-js/backend-db/application';
import {
  Game,
  GameCreateQuery,
  GameFindQuery,
  GameUpdateQuery,
} from '@cornie-js/backend-game-domain/games';

export interface GamePersistenceOutputPort {
  create(
    gameCreateQuery: GameCreateQuery,
    transactionWrapper?: TransactionWrapper,
  ): Promise<Game>;
  find(
    gameFindQuery: GameFindQuery,
    transactionWrapper?: TransactionWrapper,
  ): Promise<Game[]>;
  findOne(
    gameFindQuery: GameFindQuery,
    transactionWrapper?: TransactionWrapper,
  ): Promise<Game | undefined>;
  update(
    gameUpdateQuery: GameUpdateQuery,
    transactionWrapper?: TransactionWrapper,
  ): Promise<void>;
}

export const gamePersistenceOutputPortSymbol: symbol = Symbol.for(
  'GamePersistenceOutputPort',
);
