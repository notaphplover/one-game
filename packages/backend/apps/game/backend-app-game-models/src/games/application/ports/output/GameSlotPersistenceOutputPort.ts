import { ActiveGameSlot } from '../../../domain/models/ActiveGameSlot';
import { NonStartedGameSlot } from '../../../domain/models/NonStartedGameSlot';
import { GameSlotCreateQuery } from '../../../domain/query/GameSlotCreateQuery';
import { GameSlotUpdateQuery } from '../../../domain/query/GameSlotUpdateQuery';

export interface GameSlotPersistenceOutputPort {
  create(
    gameSlotCreateQuery: GameSlotCreateQuery,
  ): Promise<ActiveGameSlot | NonStartedGameSlot>;
  update(gameSlotUpdateQuery: GameSlotUpdateQuery): Promise<void>;
}

export const gameSlotPersistenceOutputPortSymbol: symbol = Symbol.for(
  'GameSlotPersistenceOutputPort',
);
