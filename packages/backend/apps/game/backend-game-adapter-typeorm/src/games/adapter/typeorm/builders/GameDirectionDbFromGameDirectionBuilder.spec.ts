import { beforeAll, describe, expect, it } from '@jest/globals';

import { GameDirection } from '@cornie-js/backend-game-domain/games';

import { GameDirectionDb } from '../models/GameDirectionDb';
import { GameDirectionDbFromGameDirectionBuilder } from './GameDirectionDbFromGameDirectionBuilder';

describe(GameDirectionDbFromGameDirectionBuilder.name, () => {
  let gameDirectionDbFromGameDirectionBuilder: GameDirectionDbFromGameDirectionBuilder;

  beforeAll(() => {
    gameDirectionDbFromGameDirectionBuilder =
      new GameDirectionDbFromGameDirectionBuilder();
  });

  describe('.build', () => {
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
              gameDirectionDbFromGameDirectionBuilder.build(gameDirection);
          });

          it('should return a GameDirectionDb', () => {
            expect(result).toBe(gameDirectionDb);
          });
        });
      },
    );
  });
});
