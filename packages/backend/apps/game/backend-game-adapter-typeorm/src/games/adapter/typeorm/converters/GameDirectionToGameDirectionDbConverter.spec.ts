import { beforeAll, describe, expect, it } from '@jest/globals';

import { GameDirection } from '@cornie-js/backend-game-domain/games';

import { GameDirectionDb } from '../models/GameDirectionDb';
import { GameDirectionToGameDirectionDbConverter } from './GameDirectionToGameDirectionDbConverter';

describe(GameDirectionToGameDirectionDbConverter.name, () => {
  let gameDirectionToGameDirectionDbConverter: GameDirectionToGameDirectionDbConverter;

  beforeAll(() => {
    gameDirectionToGameDirectionDbConverter =
      new GameDirectionToGameDirectionDbConverter();
  });

  describe('.convert', () => {
    describe.each<[GameDirection, GameDirectionDb]>([
      [GameDirection.antiClockwise, GameDirectionDb.antiClockwise],
      [GameDirection.clockwise, GameDirectionDb.clockwise],
    ])(
      'having a game direction %s',
      (gameDirection: GameDirection, gameDirectionDb: GameDirectionDb) => {
        describe('when called', () => {
          let result: unknown;

          beforeAll(() => {
            result =
              gameDirectionToGameDirectionDbConverter.convert(gameDirection);
          });

          it('should return a GameDirectionDb', () => {
            expect(result).toBe(gameDirectionDb);
          });
        });
      },
    );
  });
});
