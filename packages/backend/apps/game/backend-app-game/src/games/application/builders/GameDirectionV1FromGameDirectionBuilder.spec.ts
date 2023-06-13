import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { GameDirection } from '@cornie-js/backend-app-game-domain/games/domain';

import { GameDirectionV1FromGameDirectionBuilder } from './GameDirectionV1FromGameDirectionBuilder';

describe(GameDirectionV1FromGameDirectionBuilder.name, () => {
  let gameDirectionToGameDirectionDbConverter: GameDirectionV1FromGameDirectionBuilder;

  beforeAll(() => {
    gameDirectionToGameDirectionDbConverter =
      new GameDirectionV1FromGameDirectionBuilder();
  });

  describe('.convert', () => {
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
              gameDirectionToGameDirectionDbConverter.build(gameDirection);
          });

          it('should return a GameDirectionDb', () => {
            expect(result).toBe(gameDirectionV1);
          });
        });
      },
    );
  });
});
