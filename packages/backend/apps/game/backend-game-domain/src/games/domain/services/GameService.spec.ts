import { beforeAll, describe, expect, it } from '@jest/globals';

import { AppError, AppErrorKind } from '@cornie-js/backend-common';

import { Card } from '../../../cards/domain/models/Card';
import { CardColor } from '../../../cards/domain/models/CardColor';
import { ActiveGameFixtures } from '../fixtures/ActiveGameFixtures';
import { NonStartedGameFixtures } from '../fixtures/NonStartedGameFixtures';
import { ActiveGame } from '../models/ActiveGame';
import { ActiveGameSlot } from '../models/ActiveGameSlot';
import { GameCardSpec } from '../models/GameCardSpec';
import { GameDirection } from '../models/GameDirection';
import { GameStatus } from '../models/GameStatus';
import { NonStartedGame } from '../models/NonStartedGame';
import { GameUpdateQuery } from '../query/GameUpdateQuery';
import { GameService } from './GameService';

describe(GameService.name, () => {
  let gameService: GameService;

  beforeAll(() => {
    gameService = new GameService();
  });

  describe('.buildPassTurnGameUpdateQuery', () => {
    describe('having a Game with two players and enough cards and currentTurnCardsPlayed false and currentPlayingSlotIndex 1 and drawCount 0', () => {
      let gameFixture: ActiveGame;

      let deckCardSpec: GameCardSpec;

      beforeAll(() => {
        const baseFixture: ActiveGame =
          ActiveGameFixtures.withGameSlotsAmountTwoAndDeckWithSpecOneWithAmount120;

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

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameService.buildPassTurnGameUpdateQuery(gameFixture);
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
          ActiveGameFixtures.withGameSlotsAmountTwoAndDeckWithSpecOneWithAmount120;

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

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameService.buildPassTurnGameUpdateQuery(gameFixture);
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
          ActiveGameFixtures.withGameSlotsAmountTwoAndDeckWithSpecOneWithAmount120;

        gameFixture = {
          ...baseFixture,
          state: {
            ...baseFixture.state,
            currentPlayingSlotIndex: 0,
            currentTurnCardsPlayed: true,
          },
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameService.buildPassTurnGameUpdateQuery(gameFixture);
        });

        it('should return a GameUpdateQuery', () => {
          const expectedGameUpdateQuery: GameUpdateQuery = {
            currentPlayingSlotIndex: 1,
            currentTurnCardsPlayed: false,
            drawCount: 0,
            gameFindQuery: {
              id: gameFixture.id,
            },
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

    describe('having an existing slotIndex and existing cardIndexes', () => {
      let gameFixture: ActiveGame;
      let cardIndexesFixture: number[];
      let slotIndexFixture: number;

      beforeAll(() => {
        gameFixture = ActiveGameFixtures.withSlotsOne;
        cardIndexesFixture = [0];
        slotIndexFixture = 0;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameService.buildPlayCardsGameUpdateQuery(
            gameFixture,
            cardIndexesFixture,
            slotIndexFixture,
          );
        });

        it('should return a GameUpdateQuery', () => {
          const expectedGameUpdateQuery: GameUpdateQuery = {
            currentCard: expect.any(Object) as unknown as Card,
            gameFindQuery: {
              id: gameFixture.id,
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
