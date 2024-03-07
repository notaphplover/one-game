import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { AreCardsEqualsSpec } from '../../../cards/domain/specs/AreCardsEqualsSpec';
import { ActiveGame } from '../entities/ActiveGame';
import { ActiveGameFixtures } from '../fixtures';
import { ActiveGameSlotFixtures } from '../fixtures/ActiveGameSlotFixtures';
import { GameOptionsFixtures } from '../fixtures/GameOptionsFixtures';
import { ActiveGameSlot } from '../valueObjects/ActiveGameSlot';
import { GameOptions } from '../valueObjects/GameOptions';
import { CardCanBePlayedSpec } from './CardCanBePlayedSpec';
import { CurrentPlayerCanPlayCardsSpec } from './CurrentPlayerCanPlayCardsSpec';

describe(CurrentPlayerCanPlayCardsSpec.name, () => {
  let areCardsEqualsSpecMock: jest.Mocked<AreCardsEqualsSpec>;
  let cardCanBePlayedSpecMock: jest.Mocked<CardCanBePlayedSpec>;

  let currentPlayerCanPlayCardsSpec: CurrentPlayerCanPlayCardsSpec;

  beforeAll(() => {
    areCardsEqualsSpecMock = {
      isSatisfiedBy: jest.fn(),
    } as Partial<
      jest.Mocked<AreCardsEqualsSpec>
    > as jest.Mocked<AreCardsEqualsSpec>;

    cardCanBePlayedSpecMock = {
      isSatisfiedBy: jest.fn(),
    } as Partial<
      jest.Mocked<CardCanBePlayedSpec>
    > as jest.Mocked<CardCanBePlayedSpec>;

    currentPlayerCanPlayCardsSpec = new CurrentPlayerCanPlayCardsSpec(
      areCardsEqualsSpecMock,
      cardCanBePlayedSpecMock,
    );
  });

  describe('Having an active game with currentTurnCardsPlayed true', () => {
    let gameFixture: ActiveGame;
    let gameOptionsFixture: GameOptions;
    let cardIndexesFixture: number[];

    beforeAll(() => {
      gameFixture = {
        ...ActiveGameFixtures.any,
        state: {
          ...ActiveGameFixtures.any.state,
          currentTurnCardsPlayed: true,
        },
      };
      gameOptionsFixture = GameOptionsFixtures.any;
      cardIndexesFixture = [0];
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = currentPlayerCanPlayCardsSpec.isSatisfiedBy(
          gameFixture,
          gameOptionsFixture,
          cardIndexesFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should return false', () => {
        expect(result).toBe(false);
      });
    });
  });

  describe.each<
    [string, ActiveGameSlot, GameOptions, number[], boolean, boolean, boolean]
  >([
    [
      'Repeated card indexes',
      ActiveGameSlotFixtures.withCardsOne,
      GameOptionsFixtures.withPlayMultipleSameCardsEnabled,
      [0, 0],
      true,
      true,
      false,
    ],
    [
      'GameOptions with playMultipleSameCards enabled and zero card indexes',
      ActiveGameSlotFixtures.withCardsOne,
      GameOptionsFixtures.withPlayMultipleSameCardsEnabled,
      [],
      true,
      true,
      false,
    ],
    [
      'GameOptions with playMultipleSameCards disabled and zero card indexes',
      ActiveGameSlotFixtures.withCardsOne,
      GameOptionsFixtures.withPlayMultipleSameCardsDisabled,
      [],
      true,
      true,
      false,
    ],
    [
      'A non existing card index',
      ActiveGameSlotFixtures.withCardsOne,
      GameOptionsFixtures.withPlayMultipleSameCardsEnabled,
      [-1],
      true,
      true,
      false,
    ],
    [
      'An existing card index',
      ActiveGameSlotFixtures.withCardsOne,
      GameOptionsFixtures.withPlayMultipleSameCardsEnabled,
      [0],
      false,
      true,
      false,
    ],
    [
      'An existing card index',
      ActiveGameSlotFixtures.withCardsOne,
      GameOptionsFixtures.withPlayMultipleSameCardsEnabled,
      [0],
      true,
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
      true,
    ],
    [
      'Two existing card index',
      ActiveGameSlotFixtures.withCardsTwo,
      GameOptionsFixtures.withPlayMultipleSameCardsEnabled,
      [0, 1],
      false,
      true,
      false,
    ],
    [
      'Two existing card index',
      ActiveGameSlotFixtures.withCardsTwo,
      GameOptionsFixtures.withPlayMultipleSameCardsEnabled,
      [0, 1],
      true,
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
      cardCanBePlayed: boolean,
      expectedResult: boolean,
    ) => {
      describe(`when called, and areCardsEqualsSpec.isSatisfiedBy() returns ${areCardsEquals.toString()} and cardCanBePlayedSpec.isSatisfiedBy() returns ${cardCanBePlayed.toString()}`, () => {
        let gameFixture: ActiveGame;
        let result: unknown;

        beforeAll(() => {
          const activeGameWithOneSlotFixture: ActiveGame =
            ActiveGameFixtures.withSlotsOne;

          gameFixture = {
            ...activeGameWithOneSlotFixture,
            state: {
              ...activeGameWithOneSlotFixture.state,
              currentTurnCardsPlayed: false,
              slots: [gameSlotFixture],
            },
          };

          areCardsEqualsSpecMock.isSatisfiedBy.mockReturnValueOnce(
            areCardsEquals,
          );

          cardCanBePlayedSpecMock.isSatisfiedBy.mockReturnValueOnce(
            cardCanBePlayed,
          );

          result = currentPlayerCanPlayCardsSpec.isSatisfiedBy(
            gameFixture,
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
