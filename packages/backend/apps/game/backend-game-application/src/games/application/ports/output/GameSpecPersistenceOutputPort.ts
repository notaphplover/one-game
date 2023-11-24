import {
  GameSpec,
  GameSpecCreateQuery,
} from '@cornie-js/backend-game-domain/games';

export interface GameSpecPersistenceOutputPort {
  create(gameSpecCreateQuery: GameSpecCreateQuery): Promise<GameSpec>;
}

export const gameSpecPersistenceOutputPortSymbol: symbol = Symbol.for(
  'GameSpecPersistenceOutputPort',
);
