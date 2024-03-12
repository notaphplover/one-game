import { TransactionWrapper } from '@cornie-js/backend-db/application';
import {
  GameAction,
  GameActionCreateQuery,
} from '@cornie-js/backend-game-domain/gameActions';

export interface GameActionPersistenceOutputPort {
  create(
    gameActionCreateQuery: GameActionCreateQuery,
    transactionWrapper?: TransactionWrapper,
  ): Promise<GameAction>;
}

export const gameActionPersistenceOutputPortSymbol: symbol = Symbol.for(
  'GameActionPersistenceOutputPort',
);
