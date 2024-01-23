import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { GameDirection } from '@cornie-js/backend-game-domain/games';

import { GameDirectionV1FromGameDirectionBuilder } from './GameDirectionV1FromGameDirectionBuilder';

describe(GameDirectionV1FromGameDirectionBuilder.name, () => {
  let gameDirectionV1FromGameDirectionBuilder: GameDirectionV1FromGameDirectionBuilder;

  beforeAll(() => {
    gameDirectionV1FromGameDirectionBuilder =
      new GameDirectionV1FromGameDirectionBuilder();
  });

  describe('.builder', () => {
    describe.each<[GameDirection, apiModels.GameDirectionV1]>([
      [GameDirection.antiClockwise, 'antiClockwise'],
      [GameDirection.clockwise, 'clockwise'],
    ])(
      'having a game direction %s',
      (
        gameDirection: GameDirection,
        gameDirectionV1: apiModels.GameDirectionV1,
      ) => {
        describe('when called', () => {
          let result: unknown;

          beforeAll(() => {
            result =
              gameDirectionV1FromGameDirectionBuilder.build(gameDirection);
          });

          it('should return a GameDirectionDb', () => {
            expect(result).toBe(gameDirectionV1);
          });
        });
      },
    );
  });
});
