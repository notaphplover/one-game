import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { AreCardsEqualsSpec } from '../../../cards/domain/specs/AreCardsEqualsSpec';
import { ActiveGameSlotFixtures } from '../fixtures/ActiveGameSlotFixtures';
import { GameOptionsFixtures } from '../fixtures/GameOptionsFixtures';
import { ActiveGameSlot } from '../models/ActiveGameSlot';
import { GameOptions } from '../models/GameOptions';
import { PlayerCanPlayCardsSpec } from './PlayerCanPlayCardsSpec';

describe(PlayerCanPlayCardsSpec.name, () => {
  let areCardsEqualsSpecMock: jest.Mocked<AreCardsEqualsSpec>;

  let playerCanPlayCardsSpec: PlayerCanPlayCardsSpec;

  beforeAll(() => {
    areCardsEqualsSpecMock = {
      isSatisfiedBy: jest.fn(),
    } as Partial<
      jest.Mocked<AreCardsEqualsSpec>
    > as jest.Mocked<AreCardsEqualsSpec>;

    playerCanPlayCardsSpec = new PlayerCanPlayCardsSpec(areCardsEqualsSpecMock);
  });

  describe.each<
    [string, ActiveGameSlot, GameOptions, number[], boolean, boolean]
  >([
    [
      'Repeated card indexes',
      ActiveGameSlotFixtures.withCardsOne,
      GameOptionsFixtures.withPlayMultipleSameCardsEnabled,
      [0, 0],
      true,
      false,
    ],
    [
      'GameOptions with playMultipleSameCards enabled and zero card indexes',
      ActiveGameSlotFixtures.withCardsOne,
      GameOptionsFixtures.withPlayMultipleSameCardsEnabled,
      [],
      true,
      false,
    ],
    [
      'GameOptions with playMultipleSameCards disabled and zero card indexes',
      ActiveGameSlotFixtures.withCardsOne,
      GameOptionsFixtures.withPlayMultipleSameCardsDisabled,
      [],
      true,
      false,
    ],
    [
      'A non existing card index',
      ActiveGameSlotFixtures.withCardsOne,
      GameOptionsFixtures.withPlayMultipleSameCardsEnabled,
      [-1],
      true,
      false,
    ],
    [
      'An existing card index',
      ActiveGameSlotFixtures.withCardsOne,
      GameOptionsFixtures.withPlayMultipleSameCardsEnabled,
      [0],
      false,
      false,
    ],
    [
      'An existing card index',
      ActiveGameSlotFixtures.withCardsOne,
      GameOptionsFixtures.withPlayMultipleSameCardsEnabled,
      [0],
      true,
      true,
    ],
    [
      'Two existing card index',
      ActiveGameSlotFixtures.withCardsTwo,
      GameOptionsFixtures.withPlayMultipleSameCardsEnabled,
      [0, 1],
      false,
      false,
    ],
    [
      'Two existing card index',
      ActiveGameSlotFixtures.withCardsTwo,
      GameOptionsFixtures.withPlayMultipleSameCardsEnabled,
      [0, 1],
      true,
      true,
    ],
  ])(
    'having %s',
    (
      _: string,
      gameSlotFixture: ActiveGameSlot,
      gameOptionsFixture: GameOptions,
      cardIndexesFixture: number[],
      areCardsEquals: boolean,
      expectedResult: boolean,
    ) => {
      describe(`when called, and areCardsEqualsSpec.isSatisfiedBy() returns ${areCardsEquals.toString()}`, () => {
        let result: unknown;

        beforeAll(() => {
          areCardsEqualsSpecMock.isSatisfiedBy.mockReturnValueOnce(
            areCardsEquals,
          );

          result = playerCanPlayCardsSpec.isSatisfiedBy(
            gameSlotFixture,
            gameOptionsFixture,
            cardIndexesFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
          jest.resetAllMocks();
        });

        it(`should return ${expectedResult.toString()}`, () => {
          expect(result).toBe(expectedResult);
        });
      });
    },
  );
});
