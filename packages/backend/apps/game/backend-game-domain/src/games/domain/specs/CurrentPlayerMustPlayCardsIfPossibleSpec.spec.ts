import { beforeAll, describe, expect, it } from '@jest/globals';

import { ActiveGame } from '../entities/ActiveGame';
import { ActiveGameFixtures } from '../fixtures/ActiveGameFixtures';
import { GameOptionsFixtures } from '../fixtures/GameOptionsFixtures';
import { GameOptions } from '../valueObjects/GameOptions';
import { CurrentPlayerMustPlayCardsIfPossibleSpec } from './CurrentPlayerMustPlayCardsIfPossibleSpec';

describe(CurrentPlayerMustPlayCardsIfPossibleSpec.name, () => {
  let currentPlayerMustPlayCardsIfPossibleSpec: CurrentPlayerMustPlayCardsIfPossibleSpec;

  beforeAll(() => {
    currentPlayerMustPlayCardsIfPossibleSpec =
      new CurrentPlayerMustPlayCardsIfPossibleSpec();
  });

  describe('.isSatisfiedBy', () => {
    describe('having a game and gameOptions with playCardIsMandatory false', () => {
      let gameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;

      beforeAll(() => {
        gameFixture = ActiveGameFixtures.any;
        gameOptionsFixture =
          GameOptionsFixtures.withPlayCardIsMandatoryDisabled;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = currentPlayerMustPlayCardsIfPossibleSpec.isSatisfiedBy(
            gameFixture,
            gameOptionsFixture,
          );
        });

        it('should return false', () => {
          expect(result).toBe(false);
        });
      });
    });

    describe('having a game with currentTurnCardsPlayed true and gameOptions with playCardIsMandatory true', () => {
      let gameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;

      beforeAll(() => {
        gameFixture = ActiveGameFixtures.withCurrentTurnCardsPlayedTrue;
        gameOptionsFixture = GameOptionsFixtures.withPlayCardIsMandatoryEnabled;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = currentPlayerMustPlayCardsIfPossibleSpec.isSatisfiedBy(
            gameFixture,
            gameOptionsFixture,
          );
        });

        it('should return false', () => {
          expect(result).toBe(false);
        });
      });
    });

    describe('having a game with currentTurnCardsPlayed false and gameOptions with playCardIsMandatory true', () => {
      let gameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;

      beforeAll(() => {
        gameFixture = ActiveGameFixtures.withCurrentTurnCardsPlayedFalse;
        gameOptionsFixture = GameOptionsFixtures.withPlayCardIsMandatoryEnabled;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = currentPlayerMustPlayCardsIfPossibleSpec.isSatisfiedBy(
            gameFixture,
            gameOptionsFixture,
          );
        });

        it('should return true', () => {
          expect(result).toBe(true);
        });
      });
    });
  });
});
