import { TransactionWrapper } from '@cornie-js/backend-db/application';
import {
  ActiveGameSlot,
  GameSlotCreateQuery,
  GameSlotUpdateQuery,
  NonStartedGameSlot,
} from '@cornie-js/backend-game-domain/games';

export interface GameSlotPersistenceOutputPort {
  create(
    gameSlotCreateQuery: GameSlotCreateQuery,
    transactionWrapper?: TransactionWrapper,
  ): Promise<ActiveGameSlot | NonStartedGameSlot>;
  update(
    gameSlotUpdateQuery: GameSlotUpdateQuery,
    transactionWrapper?: TransactionWrapper,
  ): Promise<void>;
}

export const gameSlotPersistenceOutputPortSymbol: symbol = Symbol.for(
  'GameSlotPersistenceOutputPort',
);
