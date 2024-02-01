import { TransactionContext } from '@cornie-js/backend-db/application';
import {
  GameSpec,
  GameSpecCreateQuery,
  GameSpecFindQuery,
} from '@cornie-js/backend-game-domain/games';

export interface GameSpecPersistenceOutputPort {
  create(
    gameSpecCreateQuery: GameSpecCreateQuery,
    transactionContext?: TransactionContext,
  ): Promise<GameSpec>;
  find(gameSpecFindQuery: GameSpecFindQuery): Promise<GameSpec[]>;
  findOne(gameSpecFindQuery: GameSpecFindQuery): Promise<GameSpec | undefined>;
}

export const gameSpecPersistenceOutputPortSymbol: symbol = Symbol.for(
  'GameSpecPersistenceOutputPort',
);
