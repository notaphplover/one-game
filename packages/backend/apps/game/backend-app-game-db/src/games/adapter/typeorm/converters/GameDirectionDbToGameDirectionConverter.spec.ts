import { beforeAll, describe, expect, it } from '@jest/globals';

import { GameDirection } from '@cornie-js/backend-app-game-domain/games/domain';

import { GameDirectionDb } from '../models/GameDirectionDb';
import { GameDirectionDbToGameDirectionConverter } from './GameDirectionDbToGameDirectionConverter';

describe(GameDirectionDbToGameDirectionConverter.name, () => {
  let gameDirectionDbToGameDirectionConverter: GameDirectionDbToGameDirectionConverter;

  beforeAll(() => {
    gameDirectionDbToGameDirectionConverter =
      new GameDirectionDbToGameDirectionConverter();
  });

  describe('.convert', () => {
    describe.each<[GameDirectionDb, GameDirection]>([
      [GameDirectionDb.antiClockwise, GameDirection.antiClockwise],
      [GameDirectionDb.clockwise, GameDirection.clockwise],
    ])(
      'having a game direction %s',
      (gameDirectionDb: GameDirectionDb, gameDirection: GameDirection) => {
        describe('when called', () => {
          let result: unknown;

          beforeAll(() => {
            result =
              gameDirectionDbToGameDirectionConverter.convert(gameDirectionDb);
          });

          it('should return a GameDirectionDb', () => {
            expect(result).toBe(gameDirection);
          });
        });
      },
    );
  });
});
