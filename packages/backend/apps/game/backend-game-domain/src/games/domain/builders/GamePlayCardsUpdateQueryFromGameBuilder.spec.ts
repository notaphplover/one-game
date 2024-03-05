import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { AppError, AppErrorKind } from '@cornie-js/backend-common';

import { CardFixtures } from '../../../cards/domain/fixtures/CardFixtures';
import { AreCardsEqualsSpec } from '../../../cards/domain/specs/AreCardsEqualsSpec';
import { Card } from '../../../cards/domain/valueObjects/Card';
import { CardColor } from '../../../cards/domain/valueObjects/CardColor';
import { ColoredCard } from '../../../cards/domain/valueObjects/ColoredCard';
import { ActiveGame } from '../entities/ActiveGame';
import { ActiveGameFixtures } from '../fixtures/ActiveGameFixtures';
import { ActiveGameSlotFixtures } from '../fixtures/ActiveGameSlotFixtures';
import { GameUpdateQuery } from '../query/GameUpdateQuery';
import { GameService } from '../services/GameService';
import { ActiveGameSlot } from '../valueObjects/ActiveGameSlot';
import { GamePlayCardsUpdateQueryFromGameBuilder } from './GamePlayCardsUpdateQueryFromGameBuilder';

describe(GamePlayCardsUpdateQueryFromGameBuilder.name, () => {
  let areCardsEqualsSpecMock: jest.Mocked<AreCardsEqualsSpec>;
  let gameServiceMock: jest.Mocked<GameService>;

  let gamePlayCardsUpdateQueryFromGameBuilder: GamePlayCardsUpdateQueryFromGameBuilder;

  beforeAll(() => {
    areCardsEqualsSpecMock = {
      isSatisfiedBy: jest.fn(),
    } as Partial<
      jest.Mocked<AreCardsEqualsSpec>
    > as jest.Mocked<AreCardsEqualsSpec>;

    gameServiceMock = {
      getGameSlotOrThrow: jest.fn() as unknown,
    } as Partial<jest.Mocked<GameService>> as jest.Mocked<GameService>;

    gamePlayCardsUpdateQueryFromGameBuilder =
      new GamePlayCardsUpdateQueryFromGameBuilder(
        areCardsEqualsSpecMock,
        gameServiceMock,
      );
  });

  describe('.build', () => {
    describe('having an existing slotIndex and cardIndexes empty', () => {
      let gameFixture: ActiveGame;
      let cardIndexesFixture: number[];
      let slotIndexFixture: number;

      beforeAll(() => {
        gameFixture = ActiveGameFixtures.withSlotsOne;
        cardIndexesFixture = [];
        slotIndexFixture = 0;
      });

      describe('when called', () => {
        let gameSlotFixture: ActiveGameSlot;

        let result: unknown;

        beforeAll(() => {
          gameSlotFixture = ActiveGameSlotFixtures.any;

          gameServiceMock.getGameSlotOrThrow.mockReturnValueOnce(
            gameSlotFixture,
          );

          try {
            gamePlayCardsUpdateQueryFromGameBuilder.build(
              gameFixture,
              cardIndexesFixture,
              slotIndexFixture,
              undefined,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call gameService.getGameSlotOrThrow()', () => {
          expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledTimes(1);
          expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledWith(
            gameFixture,
            slotIndexFixture,
          );
        });

        it('should throw an Error', () => {
          const expectedErrorProperties: Partial<AppError> = {
            kind: AppErrorKind.unknown,
            message:
              'An unexpected error happened while attempting to update game',
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedErrorProperties),
          );
        });
      });
    });

    describe('having existing cardIndexes targeting a colored card and no color choice', () => {
      let cardFixture: Card & ColoredCard;
      let gameFixture: ActiveGame;
      let gameSlotFixture: ActiveGameSlot;
      let cardIndexesFixture: number[];
      let slotIndexFixture: number;

      beforeAll(() => {
        cardFixture = CardFixtures.normalBlueTwoCard;
        gameFixture = ActiveGameFixtures.withSlotsOne;
        gameSlotFixture = {
          ...ActiveGameSlotFixtures.any,
          cards: [cardFixture, CardFixtures.any],
        };
        cardIndexesFixture = [0];
        slotIndexFixture = 0;
      });

      describe('when called, and areCardsEqualsSpec.isSatisfiedBy() returns false', () => {
        let result: unknown;

        beforeAll(() => {
          gameServiceMock.getGameSlotOrThrow.mockReturnValueOnce(
            gameSlotFixture,
          );

          areCardsEqualsSpecMock.isSatisfiedBy.mockReturnValue(false);

          result = gamePlayCardsUpdateQueryFromGameBuilder.build(
            gameFixture,
            cardIndexesFixture,
            slotIndexFixture,
            undefined,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();

          areCardsEqualsSpecMock.isSatisfiedBy.mockReset();
        });

        it('should call gameService.getGameSlotOrThrow()', () => {
          expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledTimes(1);
          expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledWith(
            gameFixture,
            slotIndexFixture,
          );
        });

        it('should return a GameUpdateQuery', () => {
          const expectedCards: Card[] = gameSlotFixture.cards.filter(
            (_: Card, index: number): boolean =>
              !cardIndexesFixture.includes(index),
          );

          const expectedGameUpdateQuery: GameUpdateQuery = {
            currentCard: expect.any(Object) as unknown as Card,
            currentColor: cardFixture.color,
            discardPile: [
              ...gameFixture.state.discardPile,
              {
                amount: 1,
                card: cardFixture,
              },
            ],
            gameFindQuery: {
              id: gameFixture.id,
              state: {
                currentPlayingSlotIndex:
                  gameFixture.state.currentPlayingSlotIndex,
              },
            },
            gameSlotUpdateQueries: [
              {
                cards: expectedCards,
                gameSlotFindQuery: {
                  gameId: gameFixture.id,
                  position: slotIndexFixture,
                },
              },
            ],
          };

          expect(result).toStrictEqual(expectedGameUpdateQuery);
        });
      });
    });

    describe('having existing cardIndexes targeting a draw card and no color choice', () => {
      let cardFixture: Card & ColoredCard;
      let gameFixture: ActiveGame;
      let gameSlotFixture: ActiveGameSlot;
      let cardIndexesFixture: number[];
      let slotIndexFixture: number;

      beforeAll(() => {
        cardFixture = CardFixtures.drawBlueCard;
        gameFixture = ActiveGameFixtures.withSlotsOne;
        gameSlotFixture = {
          ...ActiveGameSlotFixtures.any,
          cards: [cardFixture, CardFixtures.any],
        };
        cardIndexesFixture = [0];
        slotIndexFixture = 0;
      });

      describe('when called, and areCardsEqualsSpec.isSatisfiedBy() returns false', () => {
        let result: unknown;

        beforeAll(() => {
          gameServiceMock.getGameSlotOrThrow.mockReturnValueOnce(
            gameSlotFixture,
          );

          areCardsEqualsSpecMock.isSatisfiedBy.mockReturnValue(false);

          result = gamePlayCardsUpdateQueryFromGameBuilder.build(
            gameFixture,
            cardIndexesFixture,
            slotIndexFixture,
            undefined,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();

          areCardsEqualsSpecMock.isSatisfiedBy.mockReset();
        });

        it('should call gameService.getGameSlotOrThrow()', () => {
          expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledTimes(1);
          expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledWith(
            gameFixture,
            slotIndexFixture,
          );
        });

        it('should return a GameUpdateQuery', () => {
          const expectedCards: Card[] = gameSlotFixture.cards.filter(
            (_: Card, index: number): boolean =>
              !cardIndexesFixture.includes(index),
          );

          const expectedGameUpdateQuery: GameUpdateQuery = {
            currentCard: expect.any(Object) as unknown as Card,
            currentColor: cardFixture.color,
            discardPile: [
              ...gameFixture.state.discardPile,
              {
                amount: 1,
                card: cardFixture,
              },
            ],
            drawCount: gameFixture.state.drawCount + 2,
            gameFindQuery: {
              id: gameFixture.id,
              state: {
                currentPlayingSlotIndex:
                  gameFixture.state.currentPlayingSlotIndex,
              },
            },
            gameSlotUpdateQueries: [
              {
                cards: expectedCards,
                gameSlotFindQuery: {
                  gameId: gameFixture.id,
                  position: slotIndexFixture,
                },
              },
            ],
          };

          expect(result).toStrictEqual(expectedGameUpdateQuery);
        });
      });
    });

    describe('having existing cardIndexes targeting a single skip card and no color choice', () => {
      let cardFixture: Card & ColoredCard;
      let gameFixture: ActiveGame;
      let gameSlotFixture: ActiveGameSlot;
      let cardIndexesFixture: number[];
      let slotIndexFixture: number;

      beforeAll(() => {
        cardFixture = CardFixtures.skipBlueCard;
        gameFixture = ActiveGameFixtures.withSlotsOne;
        gameSlotFixture = {
          ...ActiveGameSlotFixtures.any,
          cards: [cardFixture, CardFixtures.any],
        };
        cardIndexesFixture = [0];
        slotIndexFixture = 0;
      });

      describe('when called, and areCardsEqualsSpec.isSatisfiedBy() returns false', () => {
        let result: unknown;

        beforeAll(() => {
          gameServiceMock.getGameSlotOrThrow.mockReturnValueOnce(
            gameSlotFixture,
          );

          areCardsEqualsSpecMock.isSatisfiedBy.mockReturnValue(false);

          result = gamePlayCardsUpdateQueryFromGameBuilder.build(
            gameFixture,
            cardIndexesFixture,
            slotIndexFixture,
            undefined,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();

          areCardsEqualsSpecMock.isSatisfiedBy.mockReset();
        });

        it('should call gameService.getGameSlotOrThrow()', () => {
          expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledTimes(1);
          expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledWith(
            gameFixture,
            slotIndexFixture,
          );
        });

        it('should return a GameUpdateQuery', () => {
          const expectedCards: Card[] = gameSlotFixture.cards.filter(
            (_: Card, index: number): boolean =>
              !cardIndexesFixture.includes(index),
          );

          const expectedGameUpdateQuery: GameUpdateQuery = {
            currentCard: expect.any(Object) as unknown as Card,
            currentColor: cardFixture.color,
            discardPile: [
              ...gameFixture.state.discardPile,
              {
                amount: 1,
                card: cardFixture,
              },
            ],
            gameFindQuery: {
              id: gameFixture.id,
              state: {
                currentPlayingSlotIndex:
                  gameFixture.state.currentPlayingSlotIndex,
              },
            },
            gameSlotUpdateQueries: [
              {
                cards: expectedCards,
                gameSlotFindQuery: {
                  gameId: gameFixture.id,
                  position: slotIndexFixture,
                },
              },
            ],
            skipCount: 1,
          };

          expect(result).toStrictEqual(expectedGameUpdateQuery);
        });
      });
    });

    describe('having existing cardIndexes targeting a colored card and color choice', () => {
      let cardFixture: Card & ColoredCard;
      let gameFixture: ActiveGame;
      let gameSlotFixture: ActiveGameSlot;
      let cardIndexesFixture: number[];
      let slotIndexFixture: number;
      let colorChoiceFixture: CardColor;

      beforeAll(() => {
        cardFixture = CardFixtures.normalBlueTwoCard;
        gameFixture = ActiveGameFixtures.withSlotsOne;
        gameSlotFixture = {
          ...ActiveGameSlotFixtures.any,
          cards: [cardFixture, CardFixtures.any],
        };
        cardIndexesFixture = [0];
        slotIndexFixture = 0;
        colorChoiceFixture = CardColor.green;
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          gameServiceMock.getGameSlotOrThrow.mockReturnValueOnce(
            gameSlotFixture,
          );

          try {
            gamePlayCardsUpdateQueryFromGameBuilder.build(
              gameFixture,
              cardIndexesFixture,
              slotIndexFixture,
              colorChoiceFixture,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        it('should call gameService.getGameSlotOrThrow()', () => {
          expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledTimes(1);
          expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledWith(
            gameFixture,
            slotIndexFixture,
          );
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

    describe('having existing cardIndexes targeting a non colored card and color choice', () => {
      let cardFixture: Card;
      let gameFixture: ActiveGame;
      let gameSlotFixture: ActiveGameSlot;
      let cardIndexesFixture: number[];
      let slotIndexFixture: number;
      let colorChoiceFixture: CardColor;

      beforeAll(() => {
        cardFixture = CardFixtures.wildCard;
        gameFixture = ActiveGameFixtures.withSlotsOne;
        gameSlotFixture = {
          ...ActiveGameSlotFixtures.any,
          cards: [cardFixture, CardFixtures.any],
        };
        cardIndexesFixture = [0];
        slotIndexFixture = 0;
        colorChoiceFixture = CardColor.green;
      });

      describe('when called, and areCardsEqualsSpec.isSatisfiedBy() returns false', () => {
        let result: unknown;

        beforeAll(() => {
          gameServiceMock.getGameSlotOrThrow.mockReturnValueOnce(
            gameSlotFixture,
          );

          areCardsEqualsSpecMock.isSatisfiedBy.mockReturnValue(false);

          result = gamePlayCardsUpdateQueryFromGameBuilder.build(
            gameFixture,
            cardIndexesFixture,
            slotIndexFixture,
            colorChoiceFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();

          areCardsEqualsSpecMock.isSatisfiedBy.mockReset();
        });

        it('should call gameService.getGameSlotOrThrow()', () => {
          expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledTimes(1);
          expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledWith(
            gameFixture,
            slotIndexFixture,
          );
        });

        it('should return a GameUpdateQuery', () => {
          const expectedCards: Card[] = gameSlotFixture.cards.filter(
            (_: Card, index: number): boolean =>
              !cardIndexesFixture.includes(index),
          );

          const expectedGameUpdateQuery: GameUpdateQuery = {
            currentCard: expect.any(Object) as unknown as Card,
            currentColor: colorChoiceFixture,
            discardPile: [
              ...gameFixture.state.discardPile,
              {
                amount: 1,
                card: cardFixture,
              },
            ],
            gameFindQuery: {
              id: gameFixture.id,
              state: {
                currentPlayingSlotIndex:
                  gameFixture.state.currentPlayingSlotIndex,
              },
            },
            gameSlotUpdateQueries: [
              {
                cards: expectedCards,
                gameSlotFindQuery: {
                  gameId: gameFixture.id,
                  position: slotIndexFixture,
                },
              },
            ],
          };

          expect(result).toStrictEqual(expectedGameUpdateQuery);
        });
      });
    });

    describe('having an existing slotIndex and existing cardIndexes targeting a wild draw 4 card and color choice', () => {
      let cardFixture: Card;
      let gameFixture: ActiveGame;
      let gameSlotFixture: ActiveGameSlot;
      let cardIndexesFixture: number[];
      let slotIndexFixture: number;
      let colorChoiceFixture: CardColor;

      beforeAll(() => {
        cardFixture = CardFixtures.wildDraw4Card;
        gameFixture = ActiveGameFixtures.withSlotsOne;
        gameSlotFixture = {
          ...ActiveGameSlotFixtures.any,
          cards: [cardFixture, CardFixtures.any],
        };
        cardIndexesFixture = [0];
        slotIndexFixture = 0;
        colorChoiceFixture = CardColor.green;
      });

      describe('when called, and areCardsEqualsSpec.isSatisfiedBy() returns false', () => {
        let result: unknown;

        beforeAll(() => {
          gameServiceMock.getGameSlotOrThrow.mockReturnValueOnce(
            gameSlotFixture,
          );

          areCardsEqualsSpecMock.isSatisfiedBy.mockReturnValue(false);

          result = gamePlayCardsUpdateQueryFromGameBuilder.build(
            gameFixture,
            cardIndexesFixture,
            slotIndexFixture,
            colorChoiceFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();

          areCardsEqualsSpecMock.isSatisfiedBy.mockReset();
        });

        it('should call gameService.getGameSlotOrThrow()', () => {
          expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledTimes(1);
          expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledWith(
            gameFixture,
            slotIndexFixture,
          );
        });

        it('should return a GameUpdateQuery', () => {
          const expectedCards: Card[] = gameSlotFixture.cards.filter(
            (_: Card, index: number): boolean =>
              !cardIndexesFixture.includes(index),
          );

          const expectedGameUpdateQuery: GameUpdateQuery = {
            currentCard: expect.any(Object) as unknown as Card,
            currentColor: colorChoiceFixture,
            discardPile: [
              ...gameFixture.state.discardPile,
              {
                amount: 1,
                card: cardFixture,
              },
            ],
            drawCount: gameFixture.state.drawCount + 4,
            gameFindQuery: {
              id: gameFixture.id,
              state: {
                currentPlayingSlotIndex:
                  gameFixture.state.currentPlayingSlotIndex,
              },
            },
            gameSlotUpdateQueries: [
              {
                cards: expectedCards,
                gameSlotFindQuery: {
                  gameId: gameFixture.id,
                  position: slotIndexFixture,
                },
              },
            ],
          };

          expect(result).toStrictEqual(expectedGameUpdateQuery);
        });
      });
    });

    describe('having an existing slotIndex and existing cardIndexes targeting a non colored card and no color choice', () => {
      let cardFixture: Card;
      let gameFixture: ActiveGame;
      let gameSlotFixture: ActiveGameSlot;
      let cardIndexesFixture: number[];
      let slotIndexFixture: number;

      beforeAll(() => {
        cardFixture = CardFixtures.wildCard;
        gameFixture = ActiveGameFixtures.withSlotsOne;
        gameSlotFixture = {
          ...ActiveGameSlotFixtures.any,
          cards: [cardFixture, CardFixtures.any],
        };
        cardIndexesFixture = [0];
        slotIndexFixture = 0;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          gameServiceMock.getGameSlotOrThrow.mockReturnValueOnce(
            gameSlotFixture,
          );

          try {
            gamePlayCardsUpdateQueryFromGameBuilder.build(
              gameFixture,
              cardIndexesFixture,
              slotIndexFixture,
              undefined,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        it('should call gameService.getGameSlotOrThrow()', () => {
          expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledTimes(1);
          expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledWith(
            gameFixture,
            slotIndexFixture,
          );
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
