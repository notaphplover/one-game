import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import {
  ActiveGame,
  GameFindQuery,
  GameService,
  GameSpec,
  GameSpecFindQuery,
  GameUpdateQuery,
  NonStartedGame,
} from '@cornie-js/backend-game-domain/games';
import {
  ActiveGameFixtures,
  GameSpecFixtures,
  GameUpdateQueryFixtures,
  NonStartedGameFixtures,
} from '@cornie-js/backend-game-domain/games/fixtures';

import { NonStartedGameFilledEventFixtures } from '../fixtures/NonStartedGameFilledEventFixtures';
import { NonStartedGameFilledEvent } from '../models/NonStartedGameFilledEvent';
import { GamePersistenceOutputPort } from '../ports/output/GamePersistenceOutputPort';
import { GameSpecPersistenceOutputPort } from '../ports/output/GameSpecPersistenceOutputPort';
import { NonStartedGameFilledEventHandler } from './NonStartedGameFilledEventHandler';

describe(NonStartedGameFilledEventHandler.name, () => {
  let gamePersistenceOutputPortMock: jest.Mocked<GamePersistenceOutputPort>;
  let gameServiceMock: jest.Mocked<GameService>;
  let gameSpecPersistenceOutputPortMock: jest.Mocked<GameSpecPersistenceOutputPort>;

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

    gameSpecPersistenceOutputPortMock = {
      findOne: jest.fn(),
    } as Partial<
      jest.Mocked<GameSpecPersistenceOutputPort>
    > as jest.Mocked<GameSpecPersistenceOutputPort>;

    nonStartedGameFilledEventHandler = new NonStartedGameFilledEventHandler(
      gamePersistenceOutputPortMock,
      gameServiceMock,
      gameSpecPersistenceOutputPortMock,
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
        } catch (error: unknown) {
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
        } catch (error: unknown) {
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

    describe('when called, and gamePersistenceOutputPort.findOne() returns a non started game and gameSpecPersistenceOutputPort.findOne() returns a game spec', () => {
      let gameFixture: NonStartedGame;
      let gameSpecFixture: GameSpec;
      let gameUpdateQueryFixture: GameUpdateQuery;

      let result: unknown;

      beforeAll(async () => {
        gameFixture = NonStartedGameFixtures.withGameSlotsOne;
        gameSpecFixture = GameSpecFixtures.any;
        gameUpdateQueryFixture = GameUpdateQueryFixtures.any;

        gameServiceMock.buildStartGameUpdateQuery.mockReturnValueOnce(
          gameUpdateQueryFixture,
        );

        gameSpecPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          gameSpecFixture,
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

      it('should call gameSpecPersistenceOutputPort.findOne()', () => {
        const expected: GameSpecFindQuery = {
          gameIds: [nonStartedGameFilledEventFixture.gameId],
        };

        expect(gameSpecPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(
          1,
        );
        expect(gameSpecPersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          expected,
        );
      });

      it('should call gameService.buildStartGameUpdateQuery()', () => {
        expect(gameServiceMock.buildStartGameUpdateQuery).toHaveBeenCalledTimes(
          1,
        );
        expect(gameServiceMock.buildStartGameUpdateQuery).toHaveBeenCalledWith(
          gameFixture,
          gameSpecFixture,
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
