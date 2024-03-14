import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';

import { CardFixtures } from '../../../cards/domain/fixtures/CardFixtures';
import { Card } from '../../../cards/domain/valueObjects/Card';
import { ActiveGame } from '../entities/ActiveGame';
import { ActiveGameFixtures } from '../fixtures/ActiveGameFixtures';
import { ActiveGameSlotFixtures } from '../fixtures/ActiveGameSlotFixtures';
import { GameUpdateQuery } from '../query/GameUpdateQuery';
import { GameDrawService } from '../services/GameDrawService';
import { GameService } from '../services/GameService';
import { ActiveGameSlot } from '../valueObjects/ActiveGameSlot';
import { GamePlayCardsUpdateQueryFromGameBuilder } from './GamePlayCardsUpdateQueryFromGameBuilder';

describe(GamePlayCardsUpdateQueryFromGameBuilder.name, () => {
  let cardsFromActiveGameSlotBuilderMock: jest.Mocked<
    Builder<Card[], [ActiveGameSlot, number[]]>
  >;
  let gameDrawServiceMock: jest.Mocked<GameDrawService>;
  let gameServiceMock: jest.Mocked<GameService>;

  let gamePlayCardsUpdateQueryFromGameBuilder: GamePlayCardsUpdateQueryFromGameBuilder;

  beforeAll(() => {
    cardsFromActiveGameSlotBuilderMock = {
      build: jest.fn(),
    };
    gameDrawServiceMock = {
      putCards: jest.fn(),
    } as Partial<jest.Mocked<GameDrawService>> as jest.Mocked<GameDrawService>;

    gameServiceMock = {
      getGameSlotOrThrow: jest.fn() as unknown,
    } as Partial<jest.Mocked<GameService>> as jest.Mocked<GameService>;

    gamePlayCardsUpdateQueryFromGameBuilder =
      new GamePlayCardsUpdateQueryFromGameBuilder(
        cardsFromActiveGameSlotBuilderMock,
        gameDrawServiceMock,
        gameServiceMock,
      );
  });

  describe('.build', () => {
    describe('having an existing slotIndex and cardIndexes', () => {
      let gameFixture: ActiveGame;
      let gameSlotFixture: ActiveGameSlot;
      let cardIndexesFixture: number[];
      let slotIndexFixture: number;

      beforeAll(() => {
        gameFixture = ActiveGameFixtures.withSlotsOne;
        gameSlotFixture = ActiveGameSlotFixtures.any;
        cardIndexesFixture = [];
        slotIndexFixture = 0;
      });

      describe('when called, and cardsFromActiveGameSlotBuilder.build() returns an empty array', () => {
        let result: unknown;

        beforeAll(() => {
          gameServiceMock.getGameSlotOrThrow.mockReturnValueOnce(
            gameSlotFixture,
          );

          cardsFromActiveGameSlotBuilderMock.build.mockReturnValueOnce([]);

          try {
            gamePlayCardsUpdateQueryFromGameBuilder.build(
              gameFixture,
              cardIndexesFixture,
              slotIndexFixture,
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

        it('should call cardsFromActiveGameSlotBuilder.build()', () => {
          expect(
            cardsFromActiveGameSlotBuilderMock.build,
          ).toHaveBeenCalledTimes(1);
          expect(cardsFromActiveGameSlotBuilderMock.build).toHaveBeenCalledWith(
            gameSlotFixture,
            cardIndexesFixture,
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

      describe('when called, and cardsFromActiveGameSlotBuilder.build() returns array with a single Card and areCardsEqualsSpec.isSatisfiedBy() returns false', () => {
        let cardFixture: Card;

        let result: unknown;

        beforeAll(() => {
          cardFixture = CardFixtures.any;

          gameServiceMock.getGameSlotOrThrow.mockReturnValueOnce(
            gameSlotFixture,
          );

          cardsFromActiveGameSlotBuilderMock.build.mockReturnValueOnce([
            cardFixture,
          ]);

          result = gamePlayCardsUpdateQueryFromGameBuilder.build(
            gameFixture,
            cardIndexesFixture,
            slotIndexFixture,
          );
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

        it('should call cardsFromActiveGameSlotBuilder.build()', () => {
          expect(
            cardsFromActiveGameSlotBuilderMock.build,
          ).toHaveBeenCalledTimes(1);
          expect(cardsFromActiveGameSlotBuilderMock.build).toHaveBeenCalledWith(
            gameSlotFixture,
            cardIndexesFixture,
          );
        });

        it('should call gameDrawService.putCards()', () => {
          expect(gameDrawServiceMock.putCards).toHaveBeenCalledTimes(1);
          expect(gameDrawServiceMock.putCards).toHaveBeenCalledWith(
            gameFixture.state.discardPile,
            expect.any(Array),
          );
        });

        it('should return a GameUpdateQuery', () => {
          const expectedCards: Card[] = gameSlotFixture.cards.filter(
            (_: Card, index: number): boolean =>
              !cardIndexesFixture.includes(index),
          );

          const expectedGameUpdateQuery: GameUpdateQuery = {
            currentCard: cardFixture,
            currentTurnCardsPlayed: true,
            discardPile: gameFixture.state.discardPile,
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
  });
});
