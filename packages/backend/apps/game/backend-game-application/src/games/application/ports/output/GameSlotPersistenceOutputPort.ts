import {
  ActiveGameSlot,
  GameSlotCreateQuery,
  GameSlotUpdateQuery,
  NonStartedGameSlot,
} from '@cornie-js/backend-game-domain/games';

export interface GameSlotPersistenceOutputPort {
  create(
    gameSlotCreateQuery: GameSlotCreateQuery,
  ): Promise<ActiveGameSlot | NonStartedGameSlot>;
  update(gameSlotUpdateQuery: GameSlotUpdateQuery): Promise<void>;
}

export const gameSlotPersistenceOutputPortSymbol: symbol = Symbol.for(
  'GameSlotPersistenceOutputPort',
);
