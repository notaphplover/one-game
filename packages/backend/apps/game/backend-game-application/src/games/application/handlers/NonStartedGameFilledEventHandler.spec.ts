import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import {
  ActiveGame,
  GameFindQuery,
  GameService,
  GameUpdateQuery,
  NonStartedGame,
} from '@cornie-js/backend-game-domain/games';
import {
  ActiveGameFixtures,
  GameUpdateQueryFixtures,
  NonStartedGameFixtures,
} from '@cornie-js/backend-game-domain/games/fixtures';

import { NonStartedGameFilledEventFixtures } from '../fixtures/NonStartedGameFilledEventFixtures';
import { NonStartedGameFilledEvent } from '../models/NonStartedGameFilledEvent';
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
      buildStartGameUpdateQuery: jest.fn(),
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

    describe('when called, and gamePersistenceOutputPort.findOne() returns an active game', () => {
      let gameFixture: ActiveGame;
      let result: unknown;

      beforeAll(async () => {
        gameFixture = ActiveGameFixtures.any;

        gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          gameFixture,
        );

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
          message: 'Unexpected attempt to fill an already active game',
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });

    describe('when called, and gamePersistenceOutputPort.findOne() returns a non started game', () => {
      let gameFixture: NonStartedGame;
      let gameUpdateQueryFixture: GameUpdateQuery;

      let result: unknown;

      beforeAll(async () => {
        gameFixture = NonStartedGameFixtures.withGameSlotsAmountOneAndSlotsOne;
        gameUpdateQueryFixture = GameUpdateQueryFixtures.any;

        gameServiceMock.buildStartGameUpdateQuery.mockReturnValueOnce(
          gameUpdateQueryFixture,
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

      it('should call gameService.buildStartGameUpdateQuery()', () => {
        expect(gameServiceMock.buildStartGameUpdateQuery).toHaveBeenCalledTimes(
          1,
        );
        expect(gameServiceMock.buildStartGameUpdateQuery).toHaveBeenCalledWith(
          gameFixture,
        );
      });

      it('should call gamePersistenceOutputPort.update()', () => {
        expect(gamePersistenceOutputPortMock.update).toHaveBeenCalledTimes(1);
        expect(gamePersistenceOutputPortMock.update).toHaveBeenCalledWith(
          gameUpdateQueryFixture,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
