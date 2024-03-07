import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { AppError, AppErrorKind } from '@cornie-js/backend-common';

import { CardFixtures } from '../../../cards/domain/fixtures/CardFixtures';
import { Card } from '../../../cards/domain/valueObjects/Card';
import { CardColor } from '../../../cards/domain/valueObjects/CardColor';
import { ColoredCard } from '../../../cards/domain/valueObjects/ColoredCard';
import { ActiveGame } from '../entities/ActiveGame';
import { ActiveGameFixtures } from '../fixtures/ActiveGameFixtures';
import { GameUpdateQuery } from '../query/GameUpdateQuery';
import { GameCardsEffectUpdateQueryFromGameBuilder } from './GameCardsEffectUpdateQueryFromGameBuilder';

describe(GameCardsEffectUpdateQueryFromGameBuilder.name, () => {
  let gameCardsEffectUpdateQueryFromGameBuilder: GameCardsEffectUpdateQueryFromGameBuilder;

  beforeAll(() => {
    gameCardsEffectUpdateQueryFromGameBuilder =
      new GameCardsEffectUpdateQueryFromGameBuilder();
  });

  describe('.build', () => {
    describe('having a colored card and no color choice', () => {
      let cardFixture: Card & ColoredCard;
      let gameFixture: ActiveGame;
      let cardsAmountFixture: number;

      beforeAll(() => {
        cardFixture = CardFixtures.normalBlueTwoCard;
        gameFixture = ActiveGameFixtures.withSlotsOne;
        cardsAmountFixture = 1;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameCardsEffectUpdateQueryFromGameBuilder.build(
            gameFixture,
            cardFixture,
            cardsAmountFixture,
            undefined,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a GameUpdateQuery', () => {
          const expectedGameUpdateQuery: GameUpdateQuery = {
            currentColor: cardFixture.color,
            gameFindQuery: {
              id: gameFixture.id,
              state: {
                currentPlayingSlotIndex:
                  gameFixture.state.currentPlayingSlotIndex,
              },
            },
          };

          expect(result).toStrictEqual(expectedGameUpdateQuery);
        });
      });
    });

    describe('having a draw card and no color choice', () => {
      let cardFixture: Card & ColoredCard;
      let gameFixture: ActiveGame;
      let cardsAmountFixture: number;

      beforeAll(() => {
        cardFixture = CardFixtures.drawBlueCard;
        gameFixture = ActiveGameFixtures.withSlotsOne;
        cardsAmountFixture = 1;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameCardsEffectUpdateQueryFromGameBuilder.build(
            gameFixture,
            cardFixture,
            cardsAmountFixture,
            undefined,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a GameUpdateQuery', () => {
          const expectedGameUpdateQuery: GameUpdateQuery = {
            currentColor: cardFixture.color,
            drawCount: gameFixture.state.drawCount + 2,
            gameFindQuery: {
              id: gameFixture.id,
              state: {
                currentPlayingSlotIndex:
                  gameFixture.state.currentPlayingSlotIndex,
              },
            },
          };

          expect(result).toStrictEqual(expectedGameUpdateQuery);
        });
      });
    });

    describe('having a single skip card and no color choice', () => {
      let cardFixture: Card & ColoredCard;
      let gameFixture: ActiveGame;
      let cardsAmountFixture: number;

      beforeAll(() => {
        cardFixture = CardFixtures.skipBlueCard;
        gameFixture = ActiveGameFixtures.withSlotsOne;
        cardsAmountFixture = 1;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameCardsEffectUpdateQueryFromGameBuilder.build(
            gameFixture,
            cardFixture,
            cardsAmountFixture,
            undefined,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a GameUpdateQuery', () => {
          const expectedGameUpdateQuery: GameUpdateQuery = {
            currentColor: cardFixture.color,
            gameFindQuery: {
              id: gameFixture.id,
              state: {
                currentPlayingSlotIndex:
                  gameFixture.state.currentPlayingSlotIndex,
              },
            },
            skipCount: 1,
          };

          expect(result).toStrictEqual(expectedGameUpdateQuery);
        });
      });
    });

    describe('having a colored card and color choice', () => {
      let cardFixture: Card & ColoredCard;
      let gameFixture: ActiveGame;
      let cardsAmountFixture: number;
      let colorChoiceFixture: CardColor;

      beforeAll(() => {
        cardFixture = CardFixtures.normalBlueTwoCard;
        gameFixture = ActiveGameFixtures.withSlotsOne;
        cardsAmountFixture = 1;
        colorChoiceFixture = CardColor.green;
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          try {
            result = gameCardsEffectUpdateQueryFromGameBuilder.build(
              gameFixture,
              cardFixture,
              cardsAmountFixture,
              colorChoiceFixture,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        it('should throw an Error', () => {
          const expectedErrorProperties: Partial<AppError> = {
            kind: AppErrorKind.unprocessableOperation,
            message:
              'Operation not allowed. Reason: unexpected color choice when playing these cards',
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedErrorProperties),
          );
        });
      });
    });

    describe('having a non colored card and color choice', () => {
      let cardFixture: Card;
      let gameFixture: ActiveGame;
      let cardsAmountFixture: number;
      let colorChoiceFixture: CardColor;

      beforeAll(() => {
        cardFixture = CardFixtures.wildCard;
        gameFixture = ActiveGameFixtures.withSlotsOne;
        cardsAmountFixture = 1;
        colorChoiceFixture = CardColor.green;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameCardsEffectUpdateQueryFromGameBuilder.build(
            gameFixture,
            cardFixture,
            cardsAmountFixture,
            colorChoiceFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a GameUpdateQuery', () => {
          const expectedGameUpdateQuery: GameUpdateQuery = {
            currentColor: colorChoiceFixture,
            gameFindQuery: {
              id: gameFixture.id,
              state: {
                currentPlayingSlotIndex:
                  gameFixture.state.currentPlayingSlotIndex,
              },
            },
          };

          expect(result).toStrictEqual(expectedGameUpdateQuery);
        });
      });
    });

    describe('having a wild draw 4 card and color choice', () => {
      let cardFixture: Card;
      let gameFixture: ActiveGame;
      let cardsAmountFixture: number;
      let colorChoiceFixture: CardColor;

      beforeAll(() => {
        cardFixture = CardFixtures.wildDraw4Card;
        gameFixture = ActiveGameFixtures.withSlotsOne;
        cardsAmountFixture = 1;
        colorChoiceFixture = CardColor.green;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameCardsEffectUpdateQueryFromGameBuilder.build(
            gameFixture,
            cardFixture,
            cardsAmountFixture,
            colorChoiceFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a GameUpdateQuery', () => {
          const expectedGameUpdateQuery: GameUpdateQuery = {
            currentColor: colorChoiceFixture,
            drawCount: gameFixture.state.drawCount + 4,
            gameFindQuery: {
              id: gameFixture.id,
              state: {
                currentPlayingSlotIndex:
                  gameFixture.state.currentPlayingSlotIndex,
              },
            },
          };

          expect(result).toStrictEqual(expectedGameUpdateQuery);
        });
      });
    });

    describe('having a non colored card and no color choice', () => {
      let cardFixture: Card;
      let gameFixture: ActiveGame;
      let cardsAmountFixture: number;

      beforeAll(() => {
        cardFixture = CardFixtures.wildCard;
        gameFixture = ActiveGameFixtures.withSlotsOne;
        cardsAmountFixture = 1;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          try {
            result = gameCardsEffectUpdateQueryFromGameBuilder.build(
              gameFixture,
              cardFixture,
              cardsAmountFixture,
              undefined,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        it('should throw an Error', () => {
          const expectedErrorProperties: Partial<AppError> = {
            kind: AppErrorKind.unprocessableOperation,
            message:
              'Operation not allowed. Reason: expecting a color choice when playing these cards',
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedErrorProperties),
          );
        });
      });
    });
  });
});
