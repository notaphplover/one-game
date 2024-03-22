import { TransactionWrapper } from '@cornie-js/backend-db/application';
import {
  GameAction,
  GameActionCreateQuery,
  GameActionFindQuery,
} from '@cornie-js/backend-game-domain/gameActions';

export interface GameActionPersistenceOutputPort {
  create(
    gameActionCreateQuery: GameActionCreateQuery,
    transactionWrapper?: TransactionWrapper,
  ): Promise<GameAction>;
  find(
    gameActionFindQuery: GameActionFindQuery,
    transactionWrapper?: TransactionWrapper,
  ): Promise<GameAction[]>;
  findOne(
    gameActionFindQuery: GameActionFindQuery,
    transactionWrapper?: TransactionWrapper,
  ): Promise<GameAction | undefined>;
}

export const gameActionPersistenceOutputPortSymbol: symbol = Symbol.for(
  'GameActionPersistenceOutputPort',
);
