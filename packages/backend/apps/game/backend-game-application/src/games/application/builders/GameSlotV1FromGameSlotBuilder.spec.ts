import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import {
  ActiveGameSlot,
  NonStartedGameSlot,
} from '@cornie-js/backend-game-domain/games';
import {
  ActiveGameSlotFixtures,
  NonStartedGameSlotFixtures,
} from '@cornie-js/backend-game-domain/games/fixtures';

import { ActiveGameSlotV1Fixtures } from '../fixtures/ActiveGameSlotV1Fixtures';
import { NonStartedGameSlotV1Fixtures } from '../fixtures/NonStartedGameSlotV1Fixtures';
import { GameSlotV1FromGameSlotBuilder } from './GameSlotV1FromGameSlotBuilder';

describe(GameSlotV1FromGameSlotBuilder.name, () => {
  let activeGameSlotV1FromActiveGameSlotBuilderMock: jest.Mocked<
    Builder<apiModels.ActiveGameSlotV1, [ActiveGameSlot]>
  >;
  let nonStartedGameSlotV1FromNonStartedGameSlotBuilderMock: jest.Mocked<
    Builder<apiModels.NonStartedGameSlotV1, [NonStartedGameSlot]>
  >;

  let gameSlotV1FromGameSlotBuilder: GameSlotV1FromGameSlotBuilder;

  describe('.build', () => {
    beforeAll(() => {
      activeGameSlotV1FromActiveGameSlotBuilderMock = {
        build: jest.fn(),
      };

      nonStartedGameSlotV1FromNonStartedGameSlotBuilderMock = {
        build: jest.fn(),
      };

      gameSlotV1FromGameSlotBuilder = new GameSlotV1FromGameSlotBuilder(
        activeGameSlotV1FromActiveGameSlotBuilderMock,
        nonStartedGameSlotV1FromNonStartedGameSlotBuilderMock,
      );
    });

    describe('having an ActiveGameSlot', () => {
      let gameSlotFixture: ActiveGameSlot;

      beforeAll(() => {
        gameSlotFixture = ActiveGameSlotFixtures.any;
      });

      describe('when called', () => {
        let gameSlotV1Fixture: apiModels.ActiveGameSlotV1;

        let result: unknown;

        beforeAll(() => {
          gameSlotV1Fixture = ActiveGameSlotV1Fixtures.any;

          activeGameSlotV1FromActiveGameSlotBuilderMock.build.mockReturnValueOnce(
            gameSlotV1Fixture,
          );

          result = gameSlotV1FromGameSlotBuilder.build(gameSlotFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call activeGameSlotV1FromActiveGameSlotBuilder.build()', () => {
          expect(
            activeGameSlotV1FromActiveGameSlotBuilderMock.build,
          ).toHaveBeenCalledTimes(1);
          expect(
            activeGameSlotV1FromActiveGameSlotBuilderMock.build,
          ).toHaveBeenCalledWith(gameSlotFixture);
        });

        it('should return a GameSlotV1', () => {
          expect(result).toBe(gameSlotV1Fixture);
        });
      });
    });

    describe('having a NonStartedGameSlot', () => {
      let gameSlotFixture: NonStartedGameSlot;

      beforeAll(() => {
        gameSlotFixture = NonStartedGameSlotFixtures.any;
      });

      describe('when called', () => {
        let gameSlotV1Fixture: apiModels.NonStartedGameSlotV1;

        let result: unknown;

        beforeAll(() => {
          gameSlotV1Fixture = NonStartedGameSlotV1Fixtures.any;

          nonStartedGameSlotV1FromNonStartedGameSlotBuilderMock.build.mockReturnValueOnce(
            gameSlotV1Fixture,
          );

          result = gameSlotV1FromGameSlotBuilder.build(gameSlotFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call nonStartedGameSlotV1FromNonStartedGameSlotBuilder.build()', () => {
          expect(
            nonStartedGameSlotV1FromNonStartedGameSlotBuilderMock.build,
          ).toHaveBeenCalledTimes(1);
          expect(
            nonStartedGameSlotV1FromNonStartedGameSlotBuilderMock.build,
          ).toHaveBeenCalledWith(gameSlotFixture);
        });

        it('should return a GameSlotV1', () => {
          expect(result).toBe(gameSlotV1Fixture);
        });
      });
    });
  });
});
