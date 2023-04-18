import { ActiveGameSlot } from '../../../domain/models/ActiveGameSlot';
import { NonStartedGameSlot } from '../../../domain/models/NonStartedGameSlot';
import { GameSlotCreateQuery } from '../../../domain/query/GameSlotCreateQuery';

export interface GameSlotPersistenceOutputPort {
  create(
    gameSlotCreateQuery: GameSlotCreateQuery,
  ): Promise<ActiveGameSlot | NonStartedGameSlot>;
}

export const gameSlotPersistenceOutputPortSymbol: symbol = Symbol.for(
  'GameSlotPersistenceOutputPort',
);
