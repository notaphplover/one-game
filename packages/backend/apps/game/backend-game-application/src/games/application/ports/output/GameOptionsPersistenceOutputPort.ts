import {
  GameOptions,
  GameOptionsCreateQuery,
  GameOptionsFindQuery,
} from '@cornie-js/backend-game-domain/games';

export interface GameOptionsPersistenceOutputPort {
  create(gameOptionsCreateQuery: GameOptionsCreateQuery): Promise<GameOptions>;
  findOne(
    gameOptionsFindQuery: GameOptionsFindQuery,
  ): Promise<GameOptions | undefined>;
}

export const gameOptionsPersistenceOutputPortSymbol: symbol = Symbol.for(
  'GameOptionsPersistenceOutputPort',
);
