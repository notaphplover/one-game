import { Game } from '../../../domain/models/Game';
import { GameCreateQuery } from '../../../domain/query/GameCreateQuery';
import { GameFindQuery } from '../../../domain/query/GameFindQuery';

export interface GamePersistenceOutputPort {
  create(gameCreateQuery: GameCreateQuery): Promise<Game>;
  findOne(gameFindQuery: GameFindQuery): Promise<Game | undefined>;
}

export const gamePersistenceOutputPortSymbol: symbol = Symbol.for(
  'GamePersistenceOutputPort',
);
