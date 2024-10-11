import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { IsValidInitialCardSpec } from '../../../cards/domain/specs/IsValidInitialCardSpec';
import { Card } from '../../../cards/domain/valueObjects/Card';
import { CardColor } from '../../../cards/domain/valueObjects/CardColor';
import { NonStartedGame } from '../entities/NonStartedGame';
import { GameDrawMutationFixtures } from '../fixtures/GameDrawMutationFixtures';
import { GameInitialDrawsMutationFixtures } from '../fixtures/GameInitialDrawsMutationFixtures';
import { GameSpecFixtures } from '../fixtures/GameSpecFixtures';
import { NonStartedGameFixtures } from '../fixtures/NonStartedGameFixtures';
import { GameUpdateQuery } from '../query/GameUpdateQuery';
import { GameDrawService } from '../services/GameDrawService';
import { GameService } from '../services/GameService';
import { GameDirection } from '../valueObjects/GameDirection';
import { GameDrawMutation } from '../valueObjects/GameDrawMutation';
import { GameInitialDrawsMutation } from '../valueObjects/GameInitialDrawsMutation';
import { GameSpec } from '../valueObjects/GameSpec';
import { GameStatus } from '../valueObjects/GameStatus';
import { StartGameUpdateQueryFromGameBuilder } from './StartGameUpdateQueryFromGameBuilder';

describe(StartGameUpdateQueryFromGameBuilder.name, () => {
  let gameDrawServiceMock: jest.Mocked<GameDrawService>;
  let gameServiceMock: jest.Mocked<GameService>;
  let isValidInitialCardSpecMock: jest.Mocked<IsValidInitialCardSpec>;

  let startGameUpdateQueryFromGameBuilder: StartGameUpdateQueryFromGameBuilder;

  beforeAll(() => {
    gameDrawServiceMock = {
      calculateDrawMutation: jest.fn(),
      calculateInitialCardsDrawMutation: jest.fn(),
      putCards: jest.fn(),
    } as Partial<jest.Mocked<GameDrawService>> as jest.Mocked<GameDrawService>;

    gameServiceMock = {
      getInitialCardColor: jest.fn(),
      getInitialDirection: jest.fn(),
      getInitialPlayingSlotIndex: jest.fn(),
      getInitialTurn: jest.fn(),
    } as Partial<jest.Mocked<GameService>> as jest.Mocked<GameService>;

    isValidInitialCardSpecMock = {
      isSatisfiedBy: jest.fn(),
    };

    startGameUpdateQueryFromGameBuilder =
      new StartGameUpdateQueryFromGameBuilder(
        gameDrawServiceMock,
        gameServiceMock,
        isValidInitialCardSpecMock,
      );
  });

  describe('.build', () => {
    describe('when called, and isValidInitialCardSpec.isSatisfiedBy() returns true', () => {
      let gameFixture: NonStartedGame;
      let gameSpecFixture: GameSpec;
      let gameInitialDrawsMutationFixture: GameInitialDrawsMutation;
      let initialColorFixture: CardColor;
      let initialDirectionFixture: GameDirection;
      let initialPlayingSlotIndexFixture: number;
      let initialTurnFixture: number;

      let result: unknown;

      beforeAll(() => {
        gameFixture = NonStartedGameFixtures.any;
        gameSpecFixture = GameSpecFixtures.any;
        gameInitialDrawsMutationFixture =
          GameInitialDrawsMutationFixtures.withCardsOneCardArray;
        initialColorFixture = CardColor.blue;
        initialDirectionFixture = GameDirection.antiClockwise;
        initialPlayingSlotIndexFixture = 0;
        initialTurnFixture = 1;

        gameDrawServiceMock.calculateInitialCardsDrawMutation.mockReturnValueOnce(
          gameInitialDrawsMutationFixture,
        );
        isValidInitialCardSpecMock.isSatisfiedBy.mockReturnValueOnce(true);
        gameServiceMock.getInitialCardColor.mockReturnValueOnce(
          initialColorFixture,
        );
        gameServiceMock.getInitialDirection.mockReturnValueOnce(
          initialDirectionFixture,
        );
        gameServiceMock.getInitialPlayingSlotIndex.mockReturnValueOnce(
          initialPlayingSlotIndexFixture,
        );
        gameServiceMock.getInitialTurn.mockReturnValueOnce(initialTurnFixture);

        result = startGameUpdateQueryFromGameBuilder.build(
          gameFixture,
          gameSpecFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameDrawServiceMock.calculateInitialCardsDrawMutation()', () => {
        expect(
          gameDrawServiceMock.calculateInitialCardsDrawMutation,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameDrawServiceMock.calculateInitialCardsDrawMutation,
        ).toHaveBeenCalledWith(gameSpecFixture);
      });

      it('should call isValidInitialCardSpec.isSatisfiedBy()', () => {
        expect(isValidInitialCardSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(
          1,
        );
        expect(isValidInitialCardSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
          gameInitialDrawsMutationFixture.currentCard,
        );
      });

      it('should call gameService.getInitialCardColor()', () => {
        expect(gameServiceMock.getInitialCardColor).toHaveBeenCalledTimes(1);
        expect(gameServiceMock.getInitialCardColor).toHaveBeenCalledWith(
          gameInitialDrawsMutationFixture.currentCard,
        );
      });

      it('should call gameService.getInitialDirection()', () => {
        expect(gameServiceMock.getInitialDirection).toHaveBeenCalledTimes(1);
        expect(gameServiceMock.getInitialDirection).toHaveBeenCalledWith();
      });

      it('should call gameService.getInitialPlayingSlotIndex()', () => {
        expect(
          gameServiceMock.getInitialPlayingSlotIndex,
        ).toHaveBeenCalledTimes(1);
        expect(gameServiceMock.getInitialPlayingSlotIndex).toHaveBeenCalledWith(
          gameSpecFixture,
        );
      });

      it('should call gameService.getInitialTurn()', () => {
        expect(gameServiceMock.getInitialTurn).toHaveBeenCalledTimes(1);
        expect(gameServiceMock.getInitialTurn).toHaveBeenCalledWith();
      });

      it('should return a GameUpdateQuery', () => {
        const expected: GameUpdateQuery = {
          currentCard: gameInitialDrawsMutationFixture.currentCard,
          currentColor: initialColorFixture,
          currentDirection: initialDirectionFixture,
          currentPlayingSlotIndex: initialPlayingSlotIndexFixture,
          currentTurnCardsDrawn: false,
          currentTurnCardsPlayed: false,
          deck: gameInitialDrawsMutationFixture.deck,
          discardPile: [],
          drawCount: 0,
          gameFindQuery: {
            id: gameFixture.id,
          },
          gameSlotUpdateQueries: [
            {
              cards: gameInitialDrawsMutationFixture.cards[0] as Card[],
              gameSlotFindQuery: {
                gameId: gameFixture.id,
                position: 0,
              },
            },
          ],
          skipCount: 0,
          status: GameStatus.active,
          turn: initialTurnFixture,
          turnExpiresAt: expect.any(Date) as unknown as Date,
        };

        expect(result).toStrictEqual(expected);
      });
    });

    describe('when called, and isValidInitialCardSpec.isSatisfiedBy() returns false and, later, true', () => {
      let gameFixture: NonStartedGame;
      let gameSpecFixture: GameSpec;
      let gameInitialDrawsMutationFixture: GameInitialDrawsMutation;
      let gameDrawMutationFixture: GameDrawMutation;
      let initialColorFixture: CardColor;
      let initialDirectionFixture: GameDirection;
      let initialPlayingSlotIndexFixture: number;
      let initialTurnFixture: number;

      let result: unknown;

      beforeAll(() => {
        gameFixture = NonStartedGameFixtures.any;
        gameSpecFixture = GameSpecFixtures.any;
        gameInitialDrawsMutationFixture =
          GameInitialDrawsMutationFixtures.withCardsOneCardArray;
        gameDrawMutationFixture = GameDrawMutationFixtures.withCardsOne;
        initialColorFixture = CardColor.blue;
        initialDirectionFixture = GameDirection.antiClockwise;
        initialPlayingSlotIndexFixture = 0;
        initialTurnFixture = 1;

        gameDrawServiceMock.calculateInitialCardsDrawMutation.mockReturnValueOnce(
          gameInitialDrawsMutationFixture,
        );
        isValidInitialCardSpecMock.isSatisfiedBy
          .mockReturnValueOnce(false)
          .mockReturnValueOnce(true);
        gameDrawServiceMock.calculateDrawMutation.mockReturnValueOnce(
          gameDrawMutationFixture,
        );
        gameServiceMock.getInitialCardColor.mockReturnValueOnce(
          initialColorFixture,
        );
        gameServiceMock.getInitialDirection.mockReturnValueOnce(
          initialDirectionFixture,
        );
        gameServiceMock.getInitialPlayingSlotIndex.mockReturnValueOnce(
          initialPlayingSlotIndexFixture,
        );
        gameServiceMock.getInitialTurn.mockReturnValueOnce(initialTurnFixture);

        result = startGameUpdateQueryFromGameBuilder.build(
          gameFixture,
          gameSpecFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameDrawServiceMock.calculateInitialCardsDrawMutation()', () => {
        expect(
          gameDrawServiceMock.calculateInitialCardsDrawMutation,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameDrawServiceMock.calculateInitialCardsDrawMutation,
        ).toHaveBeenCalledWith(gameSpecFixture);
      });

      it('should call isValidInitialCardSpec.isSatisfiedBy()', () => {
        expect(isValidInitialCardSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(
          2,
        );
        expect(
          isValidInitialCardSpecMock.isSatisfiedBy,
        ).toHaveBeenNthCalledWith(
          1,
          gameInitialDrawsMutationFixture.currentCard,
        );
        expect(
          isValidInitialCardSpecMock.isSatisfiedBy,
        ).toHaveBeenNthCalledWith(2, gameDrawMutationFixture.cards[0]);
      });

      it('should call gameDrawService.putCards()', () => {
        expect(gameDrawServiceMock.putCards).toHaveBeenCalledTimes(1);
        expect(gameDrawServiceMock.putCards).toHaveBeenCalledWith(
          [],
          [gameInitialDrawsMutationFixture.currentCard],
        );
      });

      it('should call gameDrawService.calculateDrawMutation()', () => {
        expect(gameDrawServiceMock.calculateDrawMutation).toHaveBeenCalledTimes(
          1,
        );
        expect(gameDrawServiceMock.calculateDrawMutation).toHaveBeenCalledWith(
          gameInitialDrawsMutationFixture.deck,
          [],
          1,
        );
      });

      it('should call gameService.getInitialCardColor()', () => {
        expect(gameServiceMock.getInitialCardColor).toHaveBeenCalledTimes(1);
        expect(gameServiceMock.getInitialCardColor).toHaveBeenCalledWith(
          gameInitialDrawsMutationFixture.currentCard,
        );
      });

      it('should call gameService.getInitialDirection()', () => {
        expect(gameServiceMock.getInitialDirection).toHaveBeenCalledTimes(1);
        expect(gameServiceMock.getInitialDirection).toHaveBeenCalledWith();
      });

      it('should call gameService.getInitialPlayingSlotIndex()', () => {
        expect(
          gameServiceMock.getInitialPlayingSlotIndex,
        ).toHaveBeenCalledTimes(1);
        expect(gameServiceMock.getInitialPlayingSlotIndex).toHaveBeenCalledWith(
          gameSpecFixture,
        );
      });

      it('should call gameService.getInitialTurn()', () => {
        expect(gameServiceMock.getInitialTurn).toHaveBeenCalledTimes(1);
        expect(gameServiceMock.getInitialTurn).toHaveBeenCalledWith();
      });

      it('should return a GameUpdateQuery', () => {
        const expected: GameUpdateQuery = {
          currentCard: gameInitialDrawsMutationFixture.currentCard,
          currentColor: initialColorFixture,
          currentDirection: initialDirectionFixture,
          currentPlayingSlotIndex: initialPlayingSlotIndexFixture,
          currentTurnCardsDrawn: false,
          currentTurnCardsPlayed: false,
          deck: gameInitialDrawsMutationFixture.deck,
          discardPile: [],
          drawCount: 0,
          gameFindQuery: {
            id: gameFixture.id,
          },
          gameSlotUpdateQueries: [
            {
              cards: gameInitialDrawsMutationFixture.cards[0] as Card[],
              gameSlotFindQuery: {
                gameId: gameFixture.id,
                position: 0,
              },
            },
          ],
          skipCount: 0,
          status: GameStatus.active,
          turn: initialTurnFixture,
          turnExpiresAt: expect.any(Date) as unknown as Date,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
