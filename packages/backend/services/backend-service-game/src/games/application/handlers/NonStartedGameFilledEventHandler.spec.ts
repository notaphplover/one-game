import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { AppError, AppErrorKind } from '@cornie-js/backend-common';

import { CardFixtures } from '../../../cards/domain/fixtures/CardFixtures';
import { Card } from '../../../cards/domain/models/Card';
import { CardColor } from '../../../cards/domain/models/CardColor';
import { NonStartedGameFilledEvent } from '../../domain/events/NonStartedGameFilledEvent';
import { GameCardSpecFixtures } from '../../domain/fixtures/GameCardSpecFixtures';
import { NonStartedGameFixtures } from '../../domain/fixtures/NonStartedGameFixtures';
import { GameDirection } from '../../domain/models/GameDirection';
import { GameInitialDraws } from '../../domain/models/GameInitialDraws';
import { NonStartedGame } from '../../domain/models/NonStartedGame';
import { GameFindQuery } from '../../domain/query/GameFindQuery';
import { GameUpdateQuery } from '../../domain/query/GameUpdateQuery';
import { GameService } from '../../domain/services/GameService';
import { NonStartedGameFilledEventFixtures } from '../fixtures/NonStartedGameFilledEventFixtures';
import { GamePersistenceOutputPort } from '../ports/output/GamePersistenceOutputPort';
import { NonStartedGameFilledEventHandler } from './NonStartedGameFilledEventHandler';

describe(NonStartedGameFilledEventHandler.name, () => {
  let gamePersistenceOutputPortMock: jest.Mocked<GamePersistenceOutputPort>;
  let gameServiceMock: jest.Mocked<GameService>;

  let nonStartedGameFilledEventHandler: NonStartedGameFilledEventHandler;

  beforeAll(() => {
    gamePersistenceOutputPortMock = {
      findOne: jest.fn(),
      update: jest.fn(),
    } as Partial<
      jest.Mocked<GamePersistenceOutputPort>
    > as jest.Mocked<GamePersistenceOutputPort>;

    gameServiceMock = {
      getInitialCardColor: jest.fn(),
      getInitialCardsDraw: jest.fn(),
      getInitialDirection: jest.fn(),
      getInitialPlayingSlotIndex: jest.fn(),
    } as Partial<jest.Mocked<GameService>> as jest.Mocked<GameService>;

    nonStartedGameFilledEventHandler = new NonStartedGameFilledEventHandler(
      gamePersistenceOutputPortMock,
      gameServiceMock,
    );
  });

  describe('.handle', () => {
    let nonStartedGameFilledEventFixture: NonStartedGameFilledEvent;

    beforeAll(() => {
      nonStartedGameFilledEventFixture = NonStartedGameFilledEventFixtures.any;
    });

    describe('when called, and gamePersistenceOutputPort.findOne() returns undefined', () => {
      let result: unknown;

      beforeAll(async () => {
        gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(undefined);

        try {
          await nonStartedGameFilledEventHandler.handle(
            nonStartedGameFilledEventFixture,
          );
        } catch (error) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gamePersistenceOutputPort.findOne()', () => {
        const expected: GameFindQuery = {
          id: nonStartedGameFilledEventFixture.gameId,
        };

        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(1);
        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          expected,
        );
      });

      it('should throw an Error', () => {
        const expectedErrorProperties: Partial<AppError> = {
          kind: AppErrorKind.unknown,
          message: expect.stringContaining(
            'expecting game "',
          ) as unknown as string,
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });

    describe('when called, and gamePersistenceOutputPort.findOne() returns a game', () => {
      let playerCardsFixture: Card[];
      let gameInitialDrawsFixture: GameInitialDraws;
      let gameFixture: NonStartedGame;
      let initialColorFixture: CardColor;
      let initialDirectionFixture: GameDirection;
      let initialPlayingSlotIndexFixture: number;

      let result: unknown;

      beforeAll(async () => {
        playerCardsFixture = [CardFixtures.any, CardFixtures.any];
        gameInitialDrawsFixture = {
          currentCard: CardFixtures.any,
          playersCards: [playerCardsFixture],
          remainingDeck: [GameCardSpecFixtures.withAmount120],
        };
        gameFixture = NonStartedGameFixtures.withGameSlotsAmountOneAndSlotsOne;
        initialColorFixture = CardColor.blue;
        initialDirectionFixture = GameDirection.antiClockwise;
        initialPlayingSlotIndexFixture = 0;

        gameServiceMock.getInitialCardsDraw.mockReturnValueOnce(
          gameInitialDrawsFixture,
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

        gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          gameFixture,
        );

        result = await nonStartedGameFilledEventHandler.handle(
          nonStartedGameFilledEventFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gamePersistenceOutputPort.findOne()', () => {
        const expected: GameFindQuery = {
          id: nonStartedGameFilledEventFixture.gameId,
        };

        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(1);
        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          expected,
        );
      });

      it('should call gameService.getInitialCardsDraw()', () => {
        expect(gameServiceMock.getInitialCardsDraw).toHaveBeenCalledTimes(1);
        expect(gameServiceMock.getInitialCardsDraw).toHaveBeenCalledWith(
          gameFixture,
        );
      });

      it('should call gameService.getInitialCardColor()', () => {
        expect(gameServiceMock.getInitialCardColor).toHaveBeenCalledTimes(1);
        expect(gameServiceMock.getInitialCardColor).toHaveBeenCalledWith(
          gameInitialDrawsFixture.currentCard,
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
        expect(
          gameServiceMock.getInitialPlayingSlotIndex,
        ).toHaveBeenCalledWith();
      });

      it('should call gamePersistenceOutputPort.update()', () => {
        const expected: GameUpdateQuery = {
          active: true,
          currentCard: gameInitialDrawsFixture.currentCard,
          currentColor: initialColorFixture,
          currentDirection: initialDirectionFixture,
          currentPlayingSlotIndex: initialPlayingSlotIndexFixture,
          deck: gameInitialDrawsFixture.remainingDeck,
          gameFindQuery: {
            id: gameFixture.id,
          },
          gameSlotUpdateQueries: [
            {
              cards: playerCardsFixture,
              gameSlotFindQuery: {
                gameId: gameFixture.id,
                position: 0,
              },
            },
          ],
        };

        expect(gamePersistenceOutputPortMock.update).toHaveBeenCalledTimes(1);
        expect(gamePersistenceOutputPortMock.update).toHaveBeenCalledWith(
          expected,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
