import { NonStartedGame } from '../../../domain/models/NonStartedGame';
import { GameCreateQuery } from '../../../domain/query/GameCreateQuery';

export interface GamePersistenceOutputPort {
  create(userCreateQuery: GameCreateQuery): Promise<NonStartedGame>;
}

export const gamePersistenceOutputPortSymbol: symbol = Symbol.for(
  'GamePersistenceOutputPort',
);
