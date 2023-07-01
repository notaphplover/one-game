import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import {
  ActiveGame,
  GameFindQuery,
  GameOptions,
  GameOptionsFindQuery,
  GameService,
  GameUpdateQuery,
  PlayerCanPassTurnSpec,
  PlayerCanUpdateGameSpec,
} from '@cornie-js/backend-game-domain/games';
import {
  ActiveGameFixtures,
  ActiveGameSlotFixtures,
  GameOptionsFixtures,
  GameUpdateQueryFixtures,
} from '@cornie-js/backend-game-domain/games/fixtures';

import { UserV1Fixtures } from '../../../users/application/fixtures/models/UserV1Fixtures';
import { GameIdPassTurnQueryV1Fixtures } from '../fixtures/GameIdPassTurnQueryV1Fixtures';
import { GameOptionsPersistenceOutputPort } from '../ports/output/GameOptionsPersistenceOutputPort';
import { GamePersistenceOutputPort } from '../ports/output/GamePersistenceOutputPort';
import { GameIdPassTurnQueryV1Handler } from './GameIdPassTurnQueryV1Handler';

describe(GameIdPassTurnQueryV1Handler.name, () => {
  let gameOptionsPersistenceOutputPortMock: jest.Mocked<GameOptionsPersistenceOutputPort>;
  let gamePersistenceOutputPortMock: jest.Mocked<GamePersistenceOutputPort>;
  let gameServiceMock: jest.Mocked<GameService>;
  let playerCanUpdateGameSpecMock: jest.Mocked<PlayerCanUpdateGameSpec>;
  let playerCanPassTurnSpecMock: jest.Mocked<PlayerCanPassTurnSpec>;

  let gameIdPassTurnQueryV1Handler: GameIdPassTurnQueryV1Handler;

  beforeAll(() => {
    gameOptionsPersistenceOutputPortMock = {
      findOne: jest.fn(),
    } as Partial<
      jest.Mocked<GameOptionsPersistenceOutputPort>
    > as jest.Mocked<GameOptionsPersistenceOutputPort>;
    gamePersistenceOutputPortMock = {
      findOne: jest.fn(),
      update: jest.fn(),
    } as Partial<
      jest.Mocked<GamePersistenceOutputPort>
    > as jest.Mocked<GamePersistenceOutputPort>;
    gameServiceMock = {
      buildPassTurnGameUpdateQuery: jest.fn(),
    } as Partial<jest.Mocked<GameService>> as jest.Mocked<GameService>;
    playerCanUpdateGameSpecMock = {
      isSatisfiedBy: jest.fn(),
    };
    playerCanPassTurnSpecMock = {
      isSatisfiedBy: jest.fn(),
    } as Partial<
      jest.Mocked<PlayerCanPassTurnSpec>
    > as jest.Mocked<PlayerCanPassTurnSpec>;

    gameIdPassTurnQueryV1Handler = new GameIdPassTurnQueryV1Handler(
      gameOptionsPersistenceOutputPortMock,
      gamePersistenceOutputPortMock,
      gameServiceMock,
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
        gameOptionsPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          GameOptionsFixtures.any,
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

      it('should call gameOptionsPersistenceOutputPort.findOne()', () => {
        const expectedGameOptionsFindQuery: GameOptionsFindQuery = {
          gameId: gameIdFixture,
        };

        expect(
          gameOptionsPersistenceOutputPortMock.findOne,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameOptionsPersistenceOutputPortMock.findOne,
        ).toHaveBeenCalledWith(expectedGameOptionsFindQuery);
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

    describe('when called, and gameOptionsPersistenceOutputPort.findOne() returns undefined', () => {
      let result: unknown;

      beforeAll(async () => {
        gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          ActiveGameFixtures.any,
        );
        gameOptionsPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
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

      it('should call gameOptionsPersistenceOutputPort.findOne()', () => {
        const expectedGameOptionsFindQuery: GameOptionsFindQuery = {
          gameId: gameIdFixture,
        };

        expect(
          gameOptionsPersistenceOutputPortMock.findOne,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameOptionsPersistenceOutputPortMock.findOne,
        ).toHaveBeenCalledWith(expectedGameOptionsFindQuery);
      });

      it('should throw an Error', () => {
        const expectedErrorProperties: Partial<AppError> = {
          kind: AppErrorKind.unknown,
          message: `Expecting game "${gameIdFixture}" to have options, none found`,
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

    describe('when called, and gamePersistenceOutputPort.findOne() returns Game, gameOptionsPersistenceOutputPort.findOne() returns GameOptions and and playerCanUpdateGameSpec.isSatisfiedBy returns false', () => {
      let activeGameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;
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
        gameOptionsFixture = GameOptionsFixtures.any;
        gameUpdateQueryFixture = GameUpdateQueryFixtures.any;

        gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          activeGameFixture,
        );
        gameOptionsPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          gameOptionsFixture,
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

      it('should call gameOptionsPersistenceOutputPort.findOne()', () => {
        const expectedGameOptionsFindQuery: GameOptionsFindQuery = {
          gameId: gameIdFixture,
        };

        expect(
          gameOptionsPersistenceOutputPortMock.findOne,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameOptionsPersistenceOutputPortMock.findOne,
        ).toHaveBeenCalledWith(expectedGameOptionsFindQuery);
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

    describe('when called, and gamePersistenceOutputPort.findOne() returns Game, gameOptionsPersistenceOutputPort.findOne() returns GameOptions and and playerCanUpdateGameSpec.isSatisfiedBy returns true and playerCanPassTurnSpec.isSatisfiedBy returns false', () => {
      let activeGameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;
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
        gameOptionsFixture = GameOptionsFixtures.any;
        gameUpdateQueryFixture = GameUpdateQueryFixtures.any;

        gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          activeGameFixture,
        );
        gameOptionsPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          gameOptionsFixture,
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

      it('should call gameOptionsPersistenceOutputPort.findOne()', () => {
        const expectedGameOptionsFindQuery: GameOptionsFindQuery = {
          gameId: gameIdFixture,
        };

        expect(
          gameOptionsPersistenceOutputPortMock.findOne,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameOptionsPersistenceOutputPortMock.findOne,
        ).toHaveBeenCalledWith(expectedGameOptionsFindQuery);
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
          gameOptionsFixture,
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

    describe('when called, and gamePersistenceOutputPort.findOne() returns Game, gameOptionsPersistenceOutputPort.findOne() returns GameOptions and and playerCanUpdateGameSpec.isSatisfiedBy returns true and playerCanPassTurnSpec.isSatisfiedBy returns true', () => {
      let activeGameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;
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
        gameOptionsFixture = GameOptionsFixtures.any;
        gameUpdateQueryFixture = GameUpdateQueryFixtures.any;

        gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          activeGameFixture,
        );
        gameOptionsPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          gameOptionsFixture,
        );

        gameServiceMock.buildPassTurnGameUpdateQuery.mockReturnValueOnce(
          gameUpdateQueryFixture,
        );

        playerCanUpdateGameSpecMock.isSatisfiedBy.mockReturnValueOnce(true);

        playerCanPassTurnSpecMock.isSatisfiedBy.mockReturnValueOnce(true);

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

      it('should call gameOptionsPersistenceOutputPort.findOne()', () => {
        const expectedGameOptionsFindQuery: GameOptionsFindQuery = {
          gameId: gameIdFixture,
        };

        expect(
          gameOptionsPersistenceOutputPortMock.findOne,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameOptionsPersistenceOutputPortMock.findOne,
        ).toHaveBeenCalledWith(expectedGameOptionsFindQuery);
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
          gameOptionsFixture,
          gameIdPassTurnQueryV1Fixture.slotIndex,
        );
      });

      it('should call gameService.buildPassTurnGameUpdateQuery()', () => {
        expect(
          gameServiceMock.buildPassTurnGameUpdateQuery,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameServiceMock.buildPassTurnGameUpdateQuery,
        ).toHaveBeenCalledWith(activeGameFixture);
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
