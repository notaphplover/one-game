import { Game } from '../../../domain/models/Game';
import { GameCreateQuery } from '../../../domain/query/GameCreateQuery';

export interface GamePersistenceOutputPort {
  create(gameCreateQuery: GameCreateQuery): Promise<Game>;
}

export const gamePersistenceOutputPortSymbol: symbol = Symbol.for(
  'GamePersistenceOutputPort',
);
