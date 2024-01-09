import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind, Handler } from '@cornie-js/backend-common';
import {
  ActiveGame,
  GameFindQuery,
  GameSpec,
  GameSpecFindQuery,
  GameService,
  GameUpdateQuery,
  PlayerCanPassTurnSpec,
  PlayerCanUpdateGameSpec,
} from '@cornie-js/backend-game-domain/games';
import {
  ActiveGameFixtures,
  ActiveGameSlotFixtures,
  GameSpecFixtures,
  GameUpdateQueryFixtures,
} from '@cornie-js/backend-game-domain/games/fixtures';

import { UserV1Fixtures } from '../../../users/application/fixtures/models/UserV1Fixtures';
import { GameIdPassTurnQueryV1Fixtures } from '../fixtures/GameIdPassTurnQueryV1Fixtures';
import { GameUpdatedEvent } from '../models/GameUpdatedEvent';
import { GamePersistenceOutputPort } from '../ports/output/GamePersistenceOutputPort';
import { GameSpecPersistenceOutputPort } from '../ports/output/GameSpecPersistenceOutputPort';
import { GameIdPassTurnQueryV1Handler } from './GameIdPassTurnQueryV1Handler';

describe(GameIdPassTurnQueryV1Handler.name, () => {
  let gameSpecPersistenceOutputPortMock: jest.Mocked<GameSpecPersistenceOutputPort>;
  let gamePersistenceOutputPortMock: jest.Mocked<GamePersistenceOutputPort>;
  let gameServiceMock: jest.Mocked<GameService>;
  let gameUpdatedEventHandlerMock: jest.Mocked<
    Handler<[GameUpdatedEvent], void>
  >;
  let playerCanUpdateGameSpecMock: jest.Mocked<PlayerCanUpdateGameSpec>;
  let playerCanPassTurnSpecMock: jest.Mocked<PlayerCanPassTurnSpec>;

  let gameIdPassTurnQueryV1Handler: GameIdPassTurnQueryV1Handler;

  beforeAll(() => {
    gameSpecPersistenceOutputPortMock = {
      findOne: jest.fn(),
    } as Partial<
      jest.Mocked<GameSpecPersistenceOutputPort>
    > as jest.Mocked<GameSpecPersistenceOutputPort>;
    gamePersistenceOutputPortMock = {
      findOne: jest.fn(),
      update: jest.fn(),
    } as Partial<
      jest.Mocked<GamePersistenceOutputPort>
    > as jest.Mocked<GamePersistenceOutputPort>;
    gameServiceMock = {
      buildPassTurnGameUpdateQuery: jest.fn(),
    } as Partial<jest.Mocked<GameService>> as jest.Mocked<GameService>;
    gameUpdatedEventHandlerMock = {
      handle: jest.fn(),
    };
    playerCanUpdateGameSpecMock = {
      isSatisfiedBy: jest.fn(),
    };
    playerCanPassTurnSpecMock = {
      isSatisfiedBy: jest.fn(),
    } as Partial<
      jest.Mocked<PlayerCanPassTurnSpec>
    > as jest.Mocked<PlayerCanPassTurnSpec>;

    gameIdPassTurnQueryV1Handler = new GameIdPassTurnQueryV1Handler(
      gameSpecPersistenceOutputPortMock,
      gamePersistenceOutputPortMock,
      gameServiceMock,
      gameUpdatedEventHandlerMock,
      playerCanUpdateGameSpecMock,
      playerCanPassTurnSpecMock,
    );
  });

  describe('having a gameId', () => {
    let gameIdFixture: string;
    let gameIdPassTurnQueryV1Fixture: apiModels.GameIdPassTurnQueryV1;
    let userV1Fixture: apiModels.UserV1;

    beforeAll(() => {
      gameIdFixture = ActiveGameFixtures.any.id;
      gameIdPassTurnQueryV1Fixture = GameIdPassTurnQueryV1Fixtures.any;
      userV1Fixture = UserV1Fixtures.any;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    describe('when called, and gamePersistenceOutputPort.findOne() returns undefined', () => {
      let result: unknown;

      beforeAll(async () => {
        gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(undefined);
        gameSpecPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          GameSpecFixtures.any,
        );

        try {
          await gameIdPassTurnQueryV1Handler.handle(
            gameIdFixture,
            gameIdPassTurnQueryV1Fixture,
            userV1Fixture,
          );
        } catch (error) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gamePersistenceOutputPort.findOne()', () => {
        const expectedGameFindQuery: GameFindQuery = {
          id: gameIdFixture,
        };

        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(1);
        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          expectedGameFindQuery,
        );
      });

      it('should call gameSpecPersistenceOutputPort.findOne()', () => {
        const expectedGameSpecFindQuery: GameSpecFindQuery = {
          gameIds: [gameIdFixture],
        };

        expect(gameSpecPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(
          1,
        );
        expect(gameSpecPersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          expectedGameSpecFindQuery,
        );
      });

      it('should throw an Error', () => {
        const expectedErrorProperties: Partial<AppError> = {
          kind: AppErrorKind.entityNotFound,
          message: `Game "${gameIdFixture}" not found`,
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });

    describe('when called, and gameSpecPersistenceOutputPort.findOne() returns undefined', () => {
      let result: unknown;

      beforeAll(async () => {
        gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          ActiveGameFixtures.any,
        );
        gameSpecPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          undefined,
        );

        try {
          await gameIdPassTurnQueryV1Handler.handle(
            gameIdFixture,
            gameIdPassTurnQueryV1Fixture,
            userV1Fixture,
          );
        } catch (error) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gamePersistenceOutputPort.findOne()', () => {
        const expectedGameFindQuery: GameFindQuery = {
          id: gameIdFixture,
        };

        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(1);
        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          expectedGameFindQuery,
        );
      });

      it('should call gameSpecPersistenceOutputPort.findOne()', () => {
        const expectedGameSpecFindQuery: GameSpecFindQuery = {
          gameIds: [gameIdFixture],
        };

        expect(gameSpecPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(
          1,
        );
        expect(gameSpecPersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          expectedGameSpecFindQuery,
        );
      });

      it('should throw an Error', () => {
        const expectedErrorProperties: Partial<AppError> = {
          kind: AppErrorKind.unknown,
          message: `Expecting game "${gameIdFixture}" to have spec, none found`,
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });
  });

  describe('having a gameId, a gameIdPassTurnQueryV1 and a user', () => {
    let gameIdFixture: string;
    let gameIdPassTurnQueryV1Fixture: apiModels.GameIdPassTurnQueryV1;
    let userV1Fixture: apiModels.UserV1;

    beforeAll(() => {
      gameIdFixture = ActiveGameFixtures.any.id;
      gameIdPassTurnQueryV1Fixture =
        GameIdPassTurnQueryV1Fixtures.withSlotIndexZero;
      userV1Fixture = UserV1Fixtures.any;
    });

    describe('when called, and gamePersistenceOutputPort.findOne() returns Game, gameSpecPersistenceOutputPort.findOne() returns GameSpec and and playerCanUpdateGameSpec.isSatisfiedBy returns false', () => {
      let activeGameFixture: ActiveGame;
      let gameSpecFixture: GameSpec;
      let gameUpdateQueryFixture: GameUpdateQuery;

      let result: unknown;

      beforeAll(async () => {
        const anyFixtures: ActiveGame = ActiveGameFixtures.any;

        activeGameFixture = {
          ...anyFixtures,
          state: {
            ...anyFixtures.state,
            currentPlayingSlotIndex: 0,
            slots: [
              {
                ...ActiveGameSlotFixtures.withPositionZero,
                userId: userV1Fixture.id,
              },
              ActiveGameSlotFixtures.withPositionOne,
            ],
          },
        };
        gameSpecFixture = GameSpecFixtures.any;
        gameUpdateQueryFixture = GameUpdateQueryFixtures.any;

        gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          activeGameFixture,
        );
        gameSpecPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          gameSpecFixture,
        );

        gameServiceMock.buildPassTurnGameUpdateQuery.mockReturnValueOnce(
          gameUpdateQueryFixture,
        );

        playerCanUpdateGameSpecMock.isSatisfiedBy.mockReturnValueOnce(false);

        try {
          await gameIdPassTurnQueryV1Handler.handle(
            gameIdFixture,
            gameIdPassTurnQueryV1Fixture,
            userV1Fixture,
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gamePersistenceOutputPort.findOne()', () => {
        const expectedGameFindQuery: GameFindQuery = {
          id: gameIdFixture,
        };

        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(1);
        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          expectedGameFindQuery,
        );
      });

      it('should call gameSpecPersistenceOutputPort.findOne()', () => {
        const expectedGameSpecFindQuery: GameSpecFindQuery = {
          gameIds: [gameIdFixture],
        };

        expect(gameSpecPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(
          1,
        );
        expect(gameSpecPersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          expectedGameSpecFindQuery,
        );
      });

      it('should call playerCanUpdateGameSpec.isSatisfiedBy()', () => {
        expect(playerCanUpdateGameSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(
          1,
        );
        expect(playerCanUpdateGameSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
          activeGameFixture,
          userV1Fixture.id,
          gameIdPassTurnQueryV1Fixture.slotIndex,
        );
      });

      it('should throw an Error', () => {
        const expectedErrorProperties: Partial<AppError> = {
          kind: AppErrorKind.unprocessableOperation,
          message:
            'Invalid game update request. Expecting the owner of the playing slot to perform this action',
        };

        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });

    describe('when called, and gamePersistenceOutputPort.findOne() returns Game, gameSpecPersistenceOutputPort.findOne() returns GameSpec and and playerCanUpdateGameSpec.isSatisfiedBy returns true and playerCanPassTurnSpec.isSatisfiedBy returns false', () => {
      let activeGameFixture: ActiveGame;
      let gameSpecFixture: GameSpec;
      let gameUpdateQueryFixture: GameUpdateQuery;

      let result: unknown;

      beforeAll(async () => {
        const anyFixtures: ActiveGame = ActiveGameFixtures.any;

        activeGameFixture = {
          ...anyFixtures,
          state: {
            ...anyFixtures.state,
            currentPlayingSlotIndex: 0,
            slots: [
              {
                ...ActiveGameSlotFixtures.withPositionZero,
                userId: userV1Fixture.id,
              },
              ActiveGameSlotFixtures.withPositionOne,
            ],
          },
        };
        gameSpecFixture = GameSpecFixtures.any;
        gameUpdateQueryFixture = GameUpdateQueryFixtures.any;

        gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          activeGameFixture,
        );
        gameSpecPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          gameSpecFixture,
        );

        gameServiceMock.buildPassTurnGameUpdateQuery.mockReturnValueOnce(
          gameUpdateQueryFixture,
        );

        playerCanUpdateGameSpecMock.isSatisfiedBy.mockReturnValueOnce(true);

        playerCanPassTurnSpecMock.isSatisfiedBy.mockReturnValueOnce(false);

        try {
          await gameIdPassTurnQueryV1Handler.handle(
            gameIdFixture,
            gameIdPassTurnQueryV1Fixture,
            userV1Fixture,
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gamePersistenceOutputPort.findOne()', () => {
        const expectedGameFindQuery: GameFindQuery = {
          id: gameIdFixture,
        };

        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(1);
        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          expectedGameFindQuery,
        );
      });

      it('should call gameSpecPersistenceOutputPort.findOne()', () => {
        const expectedGameSpecFindQuery: GameSpecFindQuery = {
          gameIds: [gameIdFixture],
        };

        expect(gameSpecPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(
          1,
        );
        expect(gameSpecPersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          expectedGameSpecFindQuery,
        );
      });

      it('should call playerCanUpdateGameSpec.isSatisfiedBy()', () => {
        expect(playerCanUpdateGameSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(
          1,
        );
        expect(playerCanUpdateGameSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
          activeGameFixture,
          userV1Fixture.id,
          gameIdPassTurnQueryV1Fixture.slotIndex,
        );
      });

      it('playerCanPassTurnSpec.isSatisfiedBy()', () => {
        expect(playerCanPassTurnSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(
          1,
        );
        expect(playerCanPassTurnSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
          activeGameFixture,
          gameSpecFixture.options,
          gameIdPassTurnQueryV1Fixture.slotIndex,
        );
      });

      it('should throw an Error', () => {
        const expectedErrorProperties: Partial<AppError> = {
          kind: AppErrorKind.unprocessableOperation,
          message:
            'Player cannot end the turn. Reason: there is a pending action preventing the turn to be ended',
        };

        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });

    describe('when called, and gamePersistenceOutputPort.findOne() returns Game, gameSpecPersistenceOutputPort.findOne() returns GameSpec and and playerCanUpdateGameSpec.isSatisfiedBy returns true and playerCanPassTurnSpec.isSatisfiedBy returns true', () => {
      let activeGameFixture: ActiveGame;
      let gameSpecFixture: GameSpec;
      let gameUpdateQueryFixture: GameUpdateQuery;

      let result: unknown;

      beforeAll(async () => {
        const anyFixtures: ActiveGame = ActiveGameFixtures.any;

        activeGameFixture = {
          ...anyFixtures,
          state: {
            ...anyFixtures.state,
            currentPlayingSlotIndex: 0,
            slots: [
              {
                ...ActiveGameSlotFixtures.withPositionZero,
                userId: userV1Fixture.id,
              },
              ActiveGameSlotFixtures.withPositionOne,
            ],
          },
        };
        gameSpecFixture = GameSpecFixtures.any;
        gameUpdateQueryFixture = GameUpdateQueryFixtures.any;

        gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          activeGameFixture,
        );
        gameSpecPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          gameSpecFixture,
        );

        gameServiceMock.buildPassTurnGameUpdateQuery.mockReturnValueOnce(
          gameUpdateQueryFixture,
        );

        playerCanUpdateGameSpecMock.isSatisfiedBy.mockReturnValueOnce(true);

        playerCanPassTurnSpecMock.isSatisfiedBy.mockReturnValueOnce(true);

        gameUpdatedEventHandlerMock.handle.mockResolvedValueOnce(undefined);

        result = await gameIdPassTurnQueryV1Handler.handle(
          gameIdFixture,
          gameIdPassTurnQueryV1Fixture,
          userV1Fixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gamePersistenceOutputPort.findOne()', () => {
        const expectedGameFindQuery: GameFindQuery = {
          id: gameIdFixture,
        };

        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(1);
        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          expectedGameFindQuery,
        );
      });

      it('should call gameSpecPersistenceOutputPort.findOne()', () => {
        const expectedGameSpecFindQuery: GameSpecFindQuery = {
          gameIds: [gameIdFixture],
        };

        expect(gameSpecPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(
          1,
        );
        expect(gameSpecPersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          expectedGameSpecFindQuery,
        );
      });

      it('should call playerCanUpdateGameSpec.isSatisfiedBy()', () => {
        expect(playerCanUpdateGameSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(
          1,
        );
        expect(playerCanUpdateGameSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
          activeGameFixture,
          userV1Fixture.id,
          gameIdPassTurnQueryV1Fixture.slotIndex,
        );
      });

      it('should call playerCanPassTurnSpec.isSatisfiedBy()', () => {
        expect(playerCanPassTurnSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(
          1,
        );
        expect(playerCanPassTurnSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
          activeGameFixture,
          gameSpecFixture.options,
          gameIdPassTurnQueryV1Fixture.slotIndex,
        );
      });

      it('should call gameService.buildPassTurnGameUpdateQuery()', () => {
        expect(
          gameServiceMock.buildPassTurnGameUpdateQuery,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameServiceMock.buildPassTurnGameUpdateQuery,
        ).toHaveBeenCalledWith(activeGameFixture, gameSpecFixture);
      });

      it('should call gamePersistenceOutputPort.update()', () => {
        expect(gamePersistenceOutputPortMock.update).toHaveBeenCalledTimes(1);
        expect(gamePersistenceOutputPortMock.update).toHaveBeenCalledWith(
          gameUpdateQueryFixture,
        );
      });

      it('should call gameUpdatedEventHandler.handle()', () => {
        const expectedGameUpdatedEvent: GameUpdatedEvent = {
          gameBeforeUpdate: activeGameFixture,
          gameUpdateQuery: gameUpdateQueryFixture,
        };

        expect(gameUpdatedEventHandlerMock.handle).toHaveBeenCalledTimes(1);
        expect(gameUpdatedEventHandlerMock.handle).toHaveBeenCalledWith(
          expectedGameUpdatedEvent,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
