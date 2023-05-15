import { Game } from '../../../domain/models/Game';
import { GameCreateQuery } from '../../../domain/query/GameCreateQuery';
import { GameFindQuery } from '../../../domain/query/GameFindQuery';
import { GameUpdateQuery } from '../../../domain/query/GameUpdateQuery';

export interface GamePersistenceOutputPort {
  create(gameCreateQuery: GameCreateQuery): Promise<Game>;
  findOne(gameFindQuery: GameFindQuery): Promise<Game | undefined>;
  update(gameUpdateQuery: GameUpdateQuery): Promise<void>;
}

export const gamePersistenceOutputPortSymbol: symbol = Symbol.for(
  'GamePersistenceOutputPort',
);
