import { beforeAll, describe, expect, it } from '@jest/globals';

import { GameDirection } from '@cornie-js/backend-game-domain/games';

import { GameDirectionDb } from '../models/GameDirectionDb';
import { GameDirectionFromGameDirectionDbBuilder } from './GameDirectionFromGameDirectionDbBuilder';

describe(GameDirectionFromGameDirectionDbBuilder.name, () => {
  let gameDirectionFromGameDirectionDbBuilder: GameDirectionFromGameDirectionDbBuilder;

  beforeAll(() => {
    gameDirectionFromGameDirectionDbBuilder =
      new GameDirectionFromGameDirectionDbBuilder();
  });

  describe('.build', () => {
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
              gameDirectionFromGameDirectionDbBuilder.build(gameDirectionDb);
          });

          it('should return a GameDirectionDb', () => {
            expect(result).toBe(gameDirection);
          });
        });
      },
    );
  });
});
