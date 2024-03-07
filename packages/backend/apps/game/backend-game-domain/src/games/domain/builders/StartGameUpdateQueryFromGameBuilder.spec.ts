import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Card } from '../../../cards/domain/valueObjects/Card';
import { CardColor } from '../../../cards/domain/valueObjects/CardColor';
import { NonStartedGame } from '../entities/NonStartedGame';
import { GameInitialDrawsMutationFixtures } from '../fixtures/GameInitialDrawsMutationFixtures';
import { GameSpecFixtures } from '../fixtures/GameSpecFixtures';
import { NonStartedGameFixtures } from '../fixtures/NonStartedGameFixtures';
import { GameUpdateQuery } from '../query/GameUpdateQuery';
import { GameDrawService } from '../services/GameDrawService';
import { GameService } from '../services/GameService';
import { GameDirection } from '../valueObjects/GameDirection';
import { GameInitialDrawsMutation } from '../valueObjects/GameInitialDrawsMutation';
import { GameSpec } from '../valueObjects/GameSpec';
import { GameStatus } from '../valueObjects/GameStatus';
import { StartGameUpdateQueryFromGameBuilder } from './StartGameUpdateQueryFromGameBuilder';

describe(StartGameUpdateQueryFromGameBuilder.name, () => {
  let gameDrawServiceMock: jest.Mocked<GameDrawService>;
  let gameServiceMock: jest.Mocked<GameService>;

  let startGameUpdateQueryFromGameBuilder: StartGameUpdateQueryFromGameBuilder;

  beforeAll(() => {
    gameDrawServiceMock = {
      calculateInitialCardsDrawMutation: jest.fn(),
    } as Partial<jest.Mocked<GameDrawService>> as jest.Mocked<GameDrawService>;

    gameServiceMock = {
      getInitialCardColor: jest.fn(),
      getInitialDirection: jest.fn(),
      getInitialPlayingSlotIndex: jest.fn(),
      getInitialTurn: jest.fn(),
    } as Partial<jest.Mocked<GameService>> as jest.Mocked<GameService>;

    startGameUpdateQueryFromGameBuilder =
      new StartGameUpdateQueryFromGameBuilder(
        gameDrawServiceMock,
        gameServiceMock,
      );
  });

  describe('.build', () => {
    describe('when called', () => {
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
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
