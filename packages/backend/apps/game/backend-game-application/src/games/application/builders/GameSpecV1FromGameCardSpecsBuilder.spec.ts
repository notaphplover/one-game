import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { GameCardSpec } from '@cornie-js/backend-game-domain/games';
import { GameCardSpecFixtures } from '@cornie-js/backend-game-domain/games/fixtures';

import { GameCardSpecV1Fixtures } from '../fixtures/GameCardSpecV1Fixtures';
import { GameSpecV1FromGameCardSpecsBuilder } from './GameSpecV1FromGameCardSpecsBuilder';

describe(GameSpecV1FromGameCardSpecsBuilder.name, () => {
  let gameCardSpecV1FromGameCardSpecBuilderMock: jest.Mocked<
    Builder<apiModels.GameCardSpecV1, [GameCardSpec]>
  >;

  let gameSpecV1FromGameCardSpecsBuilder: GameSpecV1FromGameCardSpecsBuilder;

  beforeAll(() => {
    gameCardSpecV1FromGameCardSpecBuilderMock = {
      build: jest.fn(),
    };

    gameSpecV1FromGameCardSpecsBuilder = new GameSpecV1FromGameCardSpecsBuilder(
      gameCardSpecV1FromGameCardSpecBuilderMock,
    );
  });

  describe('.build', () => {
    let gameCardSpecFixture: GameCardSpec;

    beforeAll(() => {
      gameCardSpecFixture = GameCardSpecFixtures.any;
    });

    describe('when called', () => {
      let gameCardSpecV1Fixture: apiModels.GameCardSpecV1;

      let result: unknown;

      beforeAll(() => {
        gameCardSpecV1Fixture = GameCardSpecV1Fixtures.any;

        gameCardSpecV1FromGameCardSpecBuilderMock.build.mockReturnValueOnce(
          gameCardSpecV1Fixture,
        );

        result = gameSpecV1FromGameCardSpecsBuilder.build([
          gameCardSpecFixture,
        ]);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameCardSpecV1FromGameCardSpecBuilder.build()', () => {
        expect(
          gameCardSpecV1FromGameCardSpecBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameCardSpecV1FromGameCardSpecBuilderMock.build,
        ).toHaveBeenCalledWith(gameCardSpecFixture);
      });

      it('should return a GameSpecV1', () => {
        const expected: apiModels.GameSpecV1 = {
          cardSpecs: [gameCardSpecV1Fixture],
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
