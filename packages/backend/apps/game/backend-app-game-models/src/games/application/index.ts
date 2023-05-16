import {
  GamePersistenceOutputPort,
  gamePersistenceOutputPortSymbol,
} from './ports/output/GamePersistenceOutputPort';
import {
  GameSlotPersistenceOutputPort,
  gameSlotPersistenceOutputPortSymbol,
} from './ports/output/GameSlotPersistenceOutputPort';

export { gamePersistenceOutputPortSymbol, gameSlotPersistenceOutputPortSymbol };

export type { GamePersistenceOutputPort, GameSlotPersistenceOutputPort };
