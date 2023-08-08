import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { AppError, AppErrorKind } from '@cornie-js/backend-common';

import { CardFixtures } from '../../../cards/domain/fixtures/CardFixtures';
import { AreCardsEqualsSpec } from '../../../cards/domain/specs/AreCardsEqualsSpec';
import { Card } from '../../../cards/domain/valueObjects/Card';
import { CardColor } from '../../../cards/domain/valueObjects/CardColor';
import { ColoredCard } from '../../../cards/domain/valueObjects/ColoredCard';
import { ActiveGame } from '../entities/ActiveGame';
import { NonStartedGame } from '../entities/NonStartedGame';
import { ActiveGameFixtures } from '../fixtures/ActiveGameFixtures';
import { NonStartedGameFixtures } from '../fixtures/NonStartedGameFixtures';
import { GameUpdateQuery } from '../query/GameUpdateQuery';
import { IsGameFinishedSpec } from '../specs/IsGameFinishedSpec';
import { ActiveGameSlot } from '../valueObjects/ActiveGameSlot';
import { GameCardSpec } from '../valueObjects/GameCardSpec';
import { GameDirection } from '../valueObjects/GameDirection';
import { GameStatus } from '../valueObjects/GameStatus';
import { GameService } from './GameService';

describe(GameService.name, () => {
  let areCardsEqualsSpecMock: jest.Mocked<AreCardsEqualsSpec>;
  let isGameFinishedSpecMock: jest.Mocked<IsGameFinishedSpec>;

  let gameService: GameService;

  beforeAll(() => {
    areCardsEqualsSpecMock = {
      isSatisfiedBy: jest.fn(),
    } as Partial<
      jest.Mocked<AreCardsEqualsSpec>
    > as jest.Mocked<AreCardsEqualsSpec>;

    isGameFinishedSpecMock = {
      isSatisfiedBy: jest.fn(),
    } as Partial<
      jest.Mocked<IsGameFinishedSpec>
    > as jest.Mocked<IsGameFinishedSpec>;

    gameService = new GameService(
      areCardsEqualsSpecMock,
      isGameFinishedSpecMock,
    );
  });

  describe('.buildPassTurnGameUpdateQuery', () => {
    describe('having a Game with two players and enough cards and currentTurnCardsPlayed false and currentPlayingSlotIndex 1 and drawCount 0', () => {
      let gameFixture: ActiveGame;

      let deckCardSpec: GameCardSpec;

      beforeAll(() => {
        const baseFixture: ActiveGame =
          ActiveGameFixtures.withGameSlotsAmountTwoAndStateWithDeckWithSpecOneWithAmount120;

        gameFixture = {
          ...baseFixture,
          state: {
            ...baseFixture.state,
            currentPlayingSlotIndex: 1,
            currentTurnCardsPlayed: false,
            drawCount: 0,
          },
        };

        [deckCardSpec] = gameFixture.spec.cards as [GameCardSpec];
      });

      describe('when called, and isGameFinishedSpec.isSatisfiedBy() returns false', () => {
        let result: unknown;

        beforeAll(() => {
          isGameFinishedSpecMock.isSatisfiedBy.mockReturnValueOnce(false);

          result = gameService.buildPassTurnGameUpdateQuery(gameFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call isGameFinishedSpec.isSatisfiedBy()', () => {
          expect(isGameFinishedSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(1);
          expect(isGameFinishedSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
            gameFixture,
          );
        });

        it('should return a GameUpdateQuery', () => {
          const currentPlayingGameSlotCards: Card[] = (
            gameFixture.state.slots[
              gameFixture.state.currentPlayingSlotIndex
            ] as ActiveGameSlot
          ).cards;

          const expectedGameUpdateQuery: GameUpdateQuery = {
            currentPlayingSlotIndex: 0,
            currentTurnCardsPlayed: false,
            deck: [
              {
                amount: deckCardSpec.amount - 1,
                card: deckCardSpec.card,
              },
            ],
            drawCount: 0,
            gameFindQuery: {
              id: gameFixture.id,
              state: {
                currentPlayingSlotIndex:
                  gameFixture.state.currentPlayingSlotIndex,
              },
            },
            gameSlotUpdateQueries: [
              {
                cards: [...currentPlayingGameSlotCards, deckCardSpec.card],
                gameSlotFindQuery: {
                  gameId: gameFixture.id,
                  position: gameFixture.state.currentPlayingSlotIndex,
                },
              },
            ],
          };

          expect(result).toStrictEqual(expectedGameUpdateQuery);
        });
      });
    });

    describe('having a Game with two players and enough cards and currentTurnCardsPlayed false and currentPlayingSlotIndex 1 and drawCount 2', () => {
      let gameFixture: ActiveGame;

      let deckCardSpec: GameCardSpec;

      beforeAll(() => {
        const baseFixture: ActiveGame =
          ActiveGameFixtures.withGameSlotsAmountTwoAndStateWithDeckWithSpecOneWithAmount120;

        gameFixture = {
          ...baseFixture,
          state: {
            ...baseFixture.state,
            currentPlayingSlotIndex: 1,
            currentTurnCardsPlayed: false,
            drawCount: 2,
          },
        };

        [deckCardSpec] = gameFixture.spec.cards as [GameCardSpec];
      });

      describe('when called, and isGameFinishedSpec.isSatisfiedBy() returns false', () => {
        let result: unknown;

        beforeAll(() => {
          isGameFinishedSpecMock.isSatisfiedBy.mockReturnValueOnce(false);

          result = gameService.buildPassTurnGameUpdateQuery(gameFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call isGameFinishedSpec.isSatisfiedBy()', () => {
          expect(isGameFinishedSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(1);
          expect(isGameFinishedSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
            gameFixture,
          );
        });

        it('should return a GameUpdateQuery', () => {
          const currentPlayingGameSlotCards: Card[] = (
            gameFixture.state.slots[
              gameFixture.state.currentPlayingSlotIndex
            ] as ActiveGameSlot
          ).cards;

          const expectedGameUpdateQuery: GameUpdateQuery = {
            currentPlayingSlotIndex: 0,
            currentTurnCardsPlayed: false,
            deck: [
              {
                amount: deckCardSpec.amount - 2,
                card: deckCardSpec.card,
              },
            ],
            drawCount: 0,
            gameFindQuery: {
              id: gameFixture.id,
              state: {
                currentPlayingSlotIndex:
                  gameFixture.state.currentPlayingSlotIndex,
              },
            },
            gameSlotUpdateQueries: [
              {
                cards: [
                  ...currentPlayingGameSlotCards,
                  deckCardSpec.card,
                  deckCardSpec.card,
                ],
                gameSlotFindQuery: {
                  gameId: gameFixture.id,
                  position: gameFixture.state.currentPlayingSlotIndex,
                },
              },
            ],
          };

          expect(result).toStrictEqual(expectedGameUpdateQuery);
        });
      });
    });

    describe('having a Game with two players and not enough deck cards and enouth discard pile cards and currentTurnCardsPlayed false and currentPlayingSlotIndex 1 and drawCount 2', () => {
      let gameFixture: ActiveGame;

      let deckCardSpec: GameCardSpec;

      beforeAll(() => {
        const baseFixture: ActiveGame =
          ActiveGameFixtures.withGameSlotsAmountTwoAndStateWithDeckEmptyAndDiscardPileWithSpecOneWithAmount120;

        gameFixture = {
          ...baseFixture,
          state: {
            ...baseFixture.state,
            currentPlayingSlotIndex: 1,
            currentTurnCardsPlayed: false,
            drawCount: 2,
          },
        };

        [deckCardSpec] = gameFixture.spec.cards as [GameCardSpec];
      });

      describe('when called, and isGameFinishedSpec.isSatisfiedBy() returns false', () => {
        let result: unknown;

        beforeAll(() => {
          isGameFinishedSpecMock.isSatisfiedBy.mockReturnValueOnce(false);

          result = gameService.buildPassTurnGameUpdateQuery(gameFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call isGameFinishedSpec.isSatisfiedBy()', () => {
          expect(isGameFinishedSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(1);
          expect(isGameFinishedSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
            gameFixture,
          );
        });

        it('should return a GameUpdateQuery', () => {
          const currentPlayingGameSlotCards: Card[] = (
            gameFixture.state.slots[
              gameFixture.state.currentPlayingSlotIndex
            ] as ActiveGameSlot
          ).cards;

          const expectedGameUpdateQuery: GameUpdateQuery = {
            currentPlayingSlotIndex: 0,
            currentTurnCardsPlayed: false,
            deck: [
              {
                amount: deckCardSpec.amount - 2,
                card: deckCardSpec.card,
              },
            ],
            discardPile: [],
            drawCount: 0,
            gameFindQuery: {
              id: gameFixture.id,
              state: {
                currentPlayingSlotIndex:
                  gameFixture.state.currentPlayingSlotIndex,
              },
            },
            gameSlotUpdateQueries: [
              {
                cards: [
                  ...currentPlayingGameSlotCards,
                  deckCardSpec.card,
                  deckCardSpec.card,
                ],
                gameSlotFindQuery: {
                  gameId: gameFixture.id,
                  position: gameFixture.state.currentPlayingSlotIndex,
                },
              },
            ],
          };

          expect(result).toStrictEqual(expectedGameUpdateQuery);
        });
      });
    });

    describe('having a Game with two players and enough cards and currentTurnCardsPlayed true and currentPlayingSlotIndex 0', () => {
      let gameFixture: ActiveGame;

      beforeAll(() => {
        const baseFixture: ActiveGame =
          ActiveGameFixtures.withGameSlotsAmountTwoAndStateWithDeckWithSpecOneWithAmount120;

        gameFixture = {
          ...baseFixture,
          state: {
            ...baseFixture.state,
            currentPlayingSlotIndex: 0,
            currentTurnCardsPlayed: true,
          },
        };
      });

      describe('when called, and isGameFinishedSpec.isSatisfiedBy() returns false', () => {
        let result: unknown;

        beforeAll(() => {
          isGameFinishedSpecMock.isSatisfiedBy.mockReturnValueOnce(false);

          result = gameService.buildPassTurnGameUpdateQuery(gameFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call isGameFinishedSpec.isSatisfiedBy()', () => {
          expect(isGameFinishedSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(1);
          expect(isGameFinishedSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
            gameFixture,
          );
        });

        it('should return a GameUpdateQuery', () => {
          const expectedGameUpdateQuery: GameUpdateQuery = {
            currentPlayingSlotIndex: 1,
            currentTurnCardsPlayed: false,
            drawCount: 0,
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

      describe('when called, and isGameFinishedSpec.isSatisfiedBy() returns true', () => {
        let result: unknown;

        beforeAll(() => {
          isGameFinishedSpecMock.isSatisfiedBy.mockReturnValueOnce(true);

          result = gameService.buildPassTurnGameUpdateQuery(gameFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call isGameFinishedSpec.isSatisfiedBy()', () => {
          expect(isGameFinishedSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(1);
          expect(isGameFinishedSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
            gameFixture,
          );
        });

        it('should return a GameUpdateQuery', () => {
          const expectedGameUpdateQuery: GameUpdateQuery = {
            currentPlayingSlotIndex: 1,
            currentTurnCardsPlayed: false,
            drawCount: 0,
            gameFindQuery: {
              id: gameFixture.id,
              state: {
                currentPlayingSlotIndex:
                  gameFixture.state.currentPlayingSlotIndex,
              },
            },
            status: GameStatus.finished,
          };

          expect(result).toStrictEqual(expectedGameUpdateQuery);
        });
      });
    });
  });

  describe('.buildPlayCardsGameUpdateQuery', () => {
    describe('having an unexisting slotIndex', () => {
      let gameFixture: ActiveGame;
      let cardIndexesFixture: number[];
      let slotIndexFixture: number;

      beforeAll(() => {
        gameFixture = ActiveGameFixtures.any;
        cardIndexesFixture = [0];
        slotIndexFixture = -1;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          try {
            gameService.buildPlayCardsGameUpdateQuery(
              gameFixture,
              cardIndexesFixture,
              slotIndexFixture,
              undefined,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        it('should throw an Error', () => {
          const expectedErrorProperties: Partial<AppError> = {
            kind: AppErrorKind.unknown,
            message: `Expecting a game slot at index "${slotIndexFixture}", none found instead.`,
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedErrorProperties),
          );
        });
      });
    });

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
        let result: unknown;

        beforeAll(() => {
          try {
            gameService.buildPlayCardsGameUpdateQuery(
              gameFixture,
              cardIndexesFixture,
              slotIndexFixture,
              undefined,
            );
          } catch (error: unknown) {
            result = error;
          }
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

    describe('having an existing slotIndex and existing cardIndexes targeting a colored card and no color choice', () => {
      let cardFixture: Card & ColoredCard;
      let gameFixture: ActiveGame;
      let cardIndexesFixture: number[];
      let slotIndexFixture: number;

      beforeAll(() => {
        cardFixture = CardFixtures.normalBlueTwoCard;
        gameFixture = ActiveGameFixtures.withSlotsOne;
        (gameFixture.state.slots[0] as ActiveGameSlot).cards[0] = cardFixture;
        cardIndexesFixture = [0];
        slotIndexFixture = 0;
      });

      describe('when called, and areCardsEqualsSpec.isSatisfiedBy() returns false', () => {
        let result: unknown;

        beforeAll(() => {
          areCardsEqualsSpecMock.isSatisfiedBy.mockReturnValue(false);

          result = gameService.buildPlayCardsGameUpdateQuery(
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

        it('should return a GameUpdateQuery', () => {
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
                cards: expect.any(Array) as unknown as Card[],
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

    describe('having an existing slotIndex and existing cardIndexes targeting a colored card and color choice', () => {
      let cardFixture: Card & ColoredCard;
      let gameFixture: ActiveGame;
      let cardIndexesFixture: number[];
      let slotIndexFixture: number;
      let colorChoiceFixture: CardColor;

      beforeAll(() => {
        cardFixture = CardFixtures.normalBlueTwoCard;
        gameFixture = ActiveGameFixtures.withSlotsOne;
        (gameFixture.state.slots[0] as ActiveGameSlot).cards[0] = cardFixture;
        cardIndexesFixture = [0];
        slotIndexFixture = 0;
        colorChoiceFixture = CardColor.green;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          try {
            gameService.buildPlayCardsGameUpdateQuery(
              gameFixture,
              cardIndexesFixture,
              slotIndexFixture,
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

    describe('having an existing slotIndex and existing cardIndexes targeting a non colored card and color choice', () => {
      let cardFixture: Card;
      let gameFixture: ActiveGame;
      let cardIndexesFixture: number[];
      let slotIndexFixture: number;
      let colorChoiceFixture: CardColor;

      beforeAll(() => {
        cardFixture = CardFixtures.wildCard;
        gameFixture = ActiveGameFixtures.withSlotsOne;
        (gameFixture.state.slots[0] as ActiveGameSlot).cards[0] = cardFixture;
        cardIndexesFixture = [0];
        slotIndexFixture = 0;
        colorChoiceFixture = CardColor.green;
      });

      describe('when called, and areCardsEqualsSpec.isSatisfiedBy() returns false', () => {
        let result: unknown;

        beforeAll(() => {
          areCardsEqualsSpecMock.isSatisfiedBy.mockReturnValue(false);

          result = gameService.buildPlayCardsGameUpdateQuery(
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

        it('should return a GameUpdateQuery', () => {
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
                cards: expect.any(Array) as unknown as Card[],
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
      let cardIndexesFixture: number[];
      let slotIndexFixture: number;

      beforeAll(() => {
        cardFixture = CardFixtures.wildCard;
        gameFixture = ActiveGameFixtures.withSlotsOne;
        (gameFixture.state.slots[0] as ActiveGameSlot).cards[0] = cardFixture;
        cardIndexesFixture = [0];
        slotIndexFixture = 0;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          try {
            gameService.buildPlayCardsGameUpdateQuery(
              gameFixture,
              cardIndexesFixture,
              slotIndexFixture,
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

  describe('.buildStartGameUpdateQuery', () => {
    describe('having a Game with enough cards', () => {
      let gameFixture: NonStartedGame;
      let deckCardSpec: GameCardSpec;

      beforeAll(() => {
        gameFixture =
          NonStartedGameFixtures.withGameSlotsAmountTwoAndDeckWithSpecOneWithAmount120;

        [deckCardSpec] = gameFixture.spec.cards as [GameCardSpec];
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameService.buildStartGameUpdateQuery(gameFixture);
        });

        it('should return a GameUpdateQuery', () => {
          const expectedDeckSpec: GameCardSpec[] = [
            {
              amount: deckCardSpec.amount - 15,
              card: deckCardSpec.card,
            },
          ];

          const expectedGameUpdateQueryProperties: Partial<GameUpdateQuery> = {
            currentCard: deckCardSpec.card,
            currentColor: expect.any(String) as unknown as CardColor,
            currentDirection: GameDirection.antiClockwise,
            currentPlayingSlotIndex: 0,
            currentTurnCardsPlayed: false,
            deck: expectedDeckSpec,
            drawCount: 0,
            gameFindQuery: {
              id: gameFixture.id,
            },
            gameSlotUpdateQueries: [
              {
                cards: new Array<Card>(7).fill(deckCardSpec.card),
                gameSlotFindQuery: {
                  gameId: gameFixture.id,
                  position: 0,
                },
              },
              {
                cards: new Array<Card>(7).fill(deckCardSpec.card),
                gameSlotFindQuery: {
                  gameId: gameFixture.id,
                  position: 1,
                },
              },
            ],
            status: GameStatus.active,
          };

          expect(result).toStrictEqual(
            expect.objectContaining(expectedGameUpdateQueryProperties),
          );
        });
      });
    });

    describe('having a Game with not enough cards', () => {
      let gameFixture: NonStartedGame;

      beforeAll(() => {
        gameFixture =
          NonStartedGameFixtures.withGameSlotsAmountTwoAndDeckWithSpecOneWithAmount0;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          try {
            gameService.buildStartGameUpdateQuery(gameFixture);
          } catch (error) {
            result = error;
          }
        });

        it('should throw an Error', () => {
          const expectedErrorProperties: Partial<AppError> = {
            kind: AppErrorKind.unprocessableOperation,
            message: 'Not enough cards to perform this operation',
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
