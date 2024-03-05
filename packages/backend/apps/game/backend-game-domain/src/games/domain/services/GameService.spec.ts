import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { AreCardsEqualsSpec } from '../../../cards/domain/specs/AreCardsEqualsSpec';
import { Card } from '../../../cards/domain/valueObjects/Card';
import { CardColor } from '../../../cards/domain/valueObjects/CardColor';
import { NonStartedGame } from '../entities/NonStartedGame';
import { GameSpecFixtures } from '../fixtures';
import { GameInitialDrawsMutationFixtures } from '../fixtures/GameInitialDrawsMutationFixtures';
import { NonStartedGameFixtures } from '../fixtures/NonStartedGameFixtures';
import { GameUpdateQuery } from '../query/GameUpdateQuery';
import { GameDirection } from '../valueObjects/GameDirection';
import { GameInitialDrawsMutation } from '../valueObjects/GameInitialDrawsMutation';
import { GameSpec } from '../valueObjects/GameSpec';
import { GameStatus } from '../valueObjects/GameStatus';
import { GameDrawService } from './GameDrawService';
import { GameService } from './GameService';

describe(GameService.name, () => {
  let areCardsEqualsSpecMock: jest.Mocked<AreCardsEqualsSpec>;
  let gameDrawServiceMock: jest.Mocked<GameDrawService>;

  let gameService: GameService;

  beforeAll(() => {
    areCardsEqualsSpecMock = {
      isSatisfiedBy: jest.fn(),
    } as Partial<
      jest.Mocked<AreCardsEqualsSpec>
    > as jest.Mocked<AreCardsEqualsSpec>;

    gameDrawServiceMock = {
      calculateDrawMutation: jest.fn(),
      calculateInitialCardsDrawMutation: jest.fn(),
    } as Partial<jest.Mocked<GameDrawService>> as jest.Mocked<GameDrawService>;

    gameService = new GameService(areCardsEqualsSpecMock, gameDrawServiceMock);
  });

  describe('.buildStartGameUpdateQuery', () => {
    describe('having a Game', () => {
      let gameFixture: NonStartedGame;
      let gameSpecFixture: GameSpec;

      beforeAll(() => {
        gameFixture = NonStartedGameFixtures.withGameSlotsOne;
        gameSpecFixture = GameSpecFixtures.any;
      });

      describe('when called', () => {
        let gameInitialDrawsMutationFixture: GameInitialDrawsMutation;
        let result: unknown;

        beforeAll(() => {
          gameInitialDrawsMutationFixture =
            GameInitialDrawsMutationFixtures.withCardsOneCardArray;

          gameDrawServiceMock.calculateInitialCardsDrawMutation.mockReturnValueOnce(
            gameInitialDrawsMutationFixture,
          );

          result = gameService.buildStartGameUpdateQuery(
            gameFixture,
            gameSpecFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call gameDrawService.calculateInitialCardsDrawMutation()', () => {
          expect(
            gameDrawServiceMock.calculateInitialCardsDrawMutation,
          ).toHaveBeenCalledTimes(1);
          expect(
            gameDrawServiceMock.calculateInitialCardsDrawMutation,
          ).toHaveBeenCalledWith(gameSpecFixture);
        });

        it('should return a GameUpdateQuery', () => {
          const expectedGameUpdateQueryProperties: Partial<GameUpdateQuery> = {
            currentCard: gameInitialDrawsMutationFixture.currentCard,
            currentColor: expect.any(String) as unknown as CardColor,
            currentDirection: GameDirection.clockwise,
            currentPlayingSlotIndex: 0,
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
            turn: 1,
          };

          expect(result).toStrictEqual(
            expect.objectContaining(expectedGameUpdateQueryProperties),
          );
        });
      });
    });
  });
});
