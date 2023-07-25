import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { GameCardSpec, GameSpec } from '@cornie-js/backend-game-domain/games';
import { GameSpecFixtures } from '@cornie-js/backend-game-domain/games/fixtures';

import { GameCardSpecV1Fixtures } from '../fixtures/GameCardSpecV1Fixtures';
import { GameSpecV1FromGameSpecBuilder } from './GameSpecV1FromGameSpecBuilder';

describe(GameSpecV1FromGameSpecBuilder.name, () => {
  let gameCardSpecV1FromGameSpecBuilderMock: jest.Mocked<
    Builder<apiModels.GameCardSpecV1, [GameCardSpec]>
  >;

  let gameSpecV1FromGameCardSpecsBuilder: GameSpecV1FromGameSpecBuilder;

  beforeAll(() => {
    gameCardSpecV1FromGameSpecBuilderMock = {
      build: jest.fn(),
    };

    gameSpecV1FromGameCardSpecsBuilder = new GameSpecV1FromGameSpecBuilder(
      gameCardSpecV1FromGameSpecBuilderMock,
    );
  });

  describe('.build', () => {
    let gameSpecFixture: GameSpec;

    beforeAll(() => {
      gameSpecFixture = GameSpecFixtures.withCardsOne;
    });

    describe('when called', () => {
      let gameCardSpecV1Fixture: apiModels.GameCardSpecV1;

      let result: unknown;

      beforeAll(() => {
        gameCardSpecV1Fixture = GameCardSpecV1Fixtures.any;

        gameCardSpecV1FromGameSpecBuilderMock.build.mockReturnValueOnce(
          gameCardSpecV1Fixture,
        );

        result = gameSpecV1FromGameCardSpecsBuilder.build(gameSpecFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameCardSpecV1FromGameCardSpecBuilder.build()', () => {
        expect(
          gameCardSpecV1FromGameSpecBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameCardSpecV1FromGameSpecBuilderMock.build,
        ).toHaveBeenCalledWith(gameSpecFixture.cards[0]);
      });

      it('should return a GameSpecV1', () => {
        const expected: apiModels.GameSpecV1 = {
          cardSpecs: [gameCardSpecV1Fixture],
          gameSlotsAmount: gameSpecFixture.gameSlotsAmount,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
