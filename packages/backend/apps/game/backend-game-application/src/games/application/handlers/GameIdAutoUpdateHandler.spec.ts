import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import {
  AppError,
  AppErrorKind,
  Builder,
  Handler,
} from '@cornie-js/backend-common';
import {
  ActiveGame,
  ActiveGameSlot,
  CurrentPlayerMustPlayCardsIfPossibleSpec,
  GameFindQuery,
  GameOptions,
  GameSpec,
  GameSpecFindQuery,
  PlayerCanDrawCardsSpec,
} from '@cornie-js/backend-game-domain/games';
import {
  ActiveGameFixtures,
  GameSpecFixtures,
} from '@cornie-js/backend-game-domain/games/fixtures';

import { UserV1Fixtures } from '../../../users/application/fixtures/models/UserV1Fixtures';
import { UserManagementInputPort } from '../../../users/application/ports/input/UserManagementInputPort';
import { GamePersistenceOutputPort } from '../ports/output/GamePersistenceOutputPort';
import { GameSpecPersistenceOutputPort } from '../ports/output/GameSpecPersistenceOutputPort';
import { GameIdAutoUpdateHandler } from './GameIdAutoUpdateHandler';

describe(GameIdAutoUpdateHandler.name, () => {
  let currentPlayerMustPlayCardsIfPossibleSpecMock: jest.Mocked<CurrentPlayerMustPlayCardsIfPossibleSpec>;
  let gameIdDrawCardsQueryV1HandlerMock: jest.Mocked<
    Handler<[string, apiModels.GameIdDrawCardsQueryV1, apiModels.UserV1], void>
  >;
  let gameIdPassTurnQueryV1HandlerMock: jest.Mocked<
    Handler<[string, apiModels.GameIdPassTurnQueryV1, apiModels.UserV1], void>
  >;
  let gameIdPlayCardsQueryV1HandlerMock: jest.Mocked<
    Handler<[string, apiModels.GameIdPlayCardsQueryV1, apiModels.UserV1], void>
  >;
  let gamePersistenceOutputPortMock: jest.Mocked<GamePersistenceOutputPort>;
  let gameSpecPersistenceOutputPortMock: jest.Mocked<GameSpecPersistenceOutputPort>;
  let playerCanDrawCardsSpecMock: jest.Mocked<PlayerCanDrawCardsSpec>;
  let randomGameIdPlayCardsQueryV1FromActiveGameBuilderMock: jest.Mocked<
    Builder<
      apiModels.GameIdPlayCardsQueryV1 | undefined,
      [ActiveGame, GameOptions]
    >
  >;
  let userManagementInputPortMock: jest.Mocked<UserManagementInputPort>;

  let gameIdAutoUpdateHandler: GameIdAutoUpdateHandler;

  beforeAll(() => {
    currentPlayerMustPlayCardsIfPossibleSpecMock = {
      isSatisfiedBy: jest.fn(),
    };
    gameIdDrawCardsQueryV1HandlerMock = {
      handle: jest.fn(),
    };
    gameIdPassTurnQueryV1HandlerMock = {
      handle: jest.fn(),
    };
    gameIdPlayCardsQueryV1HandlerMock = {
      handle: jest.fn(),
    };
    gamePersistenceOutputPortMock = {
      findOne: jest.fn(),
    } as Partial<
      jest.Mocked<GamePersistenceOutputPort>
    > as jest.Mocked<GamePersistenceOutputPort>;
    gameSpecPersistenceOutputPortMock = {
      findOne: jest.fn(),
    } as Partial<
      jest.Mocked<GameSpecPersistenceOutputPort>
    > as jest.Mocked<GameSpecPersistenceOutputPort>;
    playerCanDrawCardsSpecMock = {
      isSatisfiedBy: jest.fn(),
    } as Partial<
      jest.Mocked<PlayerCanDrawCardsSpec>
    > as jest.Mocked<PlayerCanDrawCardsSpec>;
    randomGameIdPlayCardsQueryV1FromActiveGameBuilderMock = {
      build: jest.fn(),
    };
    userManagementInputPortMock = {
      findOne: jest.fn(),
    } as Partial<
      jest.Mocked<UserManagementInputPort>
    > as jest.Mocked<UserManagementInputPort>;

    gameIdAutoUpdateHandler = new GameIdAutoUpdateHandler(
      currentPlayerMustPlayCardsIfPossibleSpecMock,
      gameIdDrawCardsQueryV1HandlerMock,
      gameIdPassTurnQueryV1HandlerMock,
      gameIdPlayCardsQueryV1HandlerMock,
      gameSpecPersistenceOutputPortMock,
      gamePersistenceOutputPortMock,
      playerCanDrawCardsSpecMock,
      randomGameIdPlayCardsQueryV1FromActiveGameBuilderMock,
      userManagementInputPortMock,
    );
  });

  describe('.handle', () => {
    let gameIdFixture: string;

    beforeAll(() => {
      gameIdFixture = 'game-id-fixture';
    });

    describe('when called, and gamePersistenceOutputPort.findOne() returns undefined', () => {
      let result: unknown;

      beforeAll(async () => {
        gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(undefined);
        gameSpecPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          undefined,
        );

        try {
          await gameIdAutoUpdateHandler.handle(gameIdFixture);
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

      it('should throw an AppError', () => {
        const expected: Partial<AppError> = {
          kind: AppErrorKind.entityNotFound,
          message: `Game "${gameIdFixture}" not found`,
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(expect.objectContaining(expected));
      });
    });

    describe('when called, and gamePersistenceOutputPort.findOne() returns Game and gameSpecPersistenceOutputPort.findOne() returns undefined', () => {
      let result: unknown;

      beforeAll(async () => {
        gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          ActiveGameFixtures.any,
        );
        gameSpecPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          undefined,
        );

        try {
          await gameIdAutoUpdateHandler.handle(gameIdFixture);
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

      it('should throw an AppError', () => {
        const expected: Partial<AppError> = {
          kind: AppErrorKind.unknown,
          message: `Expecting game "${gameIdFixture}" to have spec, none found`,
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(expect.objectContaining(expected));
      });
    });

    describe('when called, and userManagementInputPort.findOne() returns undefined', () => {
      let result: unknown;

      beforeAll(async () => {
        gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          ActiveGameFixtures.withSlotsOne,
        );
        gameSpecPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          GameSpecFixtures.any,
        );

        userManagementInputPortMock.findOne.mockResolvedValueOnce(undefined);

        try {
          await gameIdAutoUpdateHandler.handle(gameIdFixture);
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

      it('should call userManagementInputPortMock.findOne()', () => {
        expect(userManagementInputPortMock.findOne).toHaveBeenCalledTimes(1);
        expect(userManagementInputPortMock.findOne).toHaveBeenCalledWith(
          expect.any(String),
        );
      });

      it('should throw an AppError', () => {
        const expected: Partial<AppError> = {
          kind: AppErrorKind.unprocessableOperation,
          message: expect.stringMatching(
            /^Unable to process operation, User ".+" not found$/,
          ) as unknown as string,
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(expect.objectContaining(expected));
      });
    });

    describe('when called, and currentPlayerMustPlayCardsIfPossibleSpec.isSatisfiedBy() returns false and playerCanDrawCardsSpec.isSatisfiedBy() returns false', () => {
      let gameFixture: ActiveGame;
      let gameSpecFixture: GameSpec;
      let userV1Fixture: apiModels.UserV1;

      let result: unknown;

      beforeAll(async () => {
        gameFixture = ActiveGameFixtures.withSlotsOne;
        gameSpecFixture = GameSpecFixtures.any;
        userV1Fixture = UserV1Fixtures.any;

        gamePersistenceOutputPortMock.findOne
          .mockResolvedValueOnce(gameFixture)
          .mockResolvedValueOnce(gameFixture)
          .mockResolvedValueOnce(gameFixture)
          .mockResolvedValueOnce(gameFixture);
        gameSpecPersistenceOutputPortMock.findOne
          .mockResolvedValueOnce(gameSpecFixture)
          .mockResolvedValueOnce(gameSpecFixture)
          .mockResolvedValueOnce(gameSpecFixture)
          .mockResolvedValueOnce(gameSpecFixture);

        userManagementInputPortMock.findOne.mockResolvedValueOnce(
          userV1Fixture,
        );

        currentPlayerMustPlayCardsIfPossibleSpecMock.isSatisfiedBy
          .mockReturnValueOnce(false)
          .mockReturnValueOnce(false);

        playerCanDrawCardsSpecMock.isSatisfiedBy.mockReturnValueOnce(false);

        gameIdPassTurnQueryV1HandlerMock.handle.mockResolvedValueOnce(
          undefined,
        );

        result = await gameIdAutoUpdateHandler.handle(gameIdFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gamePersistenceOutputPort.findOne()', () => {
        const expectedGameFindQuery: GameFindQuery = {
          id: gameIdFixture,
        };

        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(4);
        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          expectedGameFindQuery,
        );
      });

      it('should call gameSpecPersistenceOutputPort.findOne()', () => {
        const expectedGameSpecFindQuery: GameSpecFindQuery = {
          gameIds: [gameIdFixture],
        };

        expect(gameSpecPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(
          4,
        );
        expect(gameSpecPersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          expectedGameSpecFindQuery,
        );
      });

      it('should call userManagementInputPortMock.findOne()', () => {
        expect(userManagementInputPortMock.findOne).toHaveBeenCalledTimes(1);
        expect(userManagementInputPortMock.findOne).toHaveBeenCalledWith(
          (
            gameFixture.state.slots[
              gameFixture.state.currentPlayingSlotIndex
            ] as ActiveGameSlot
          ).userId,
        );
      });

      it('should call currentPlayerMustPlayCardsIfPossibleSpec.isSatisfiedBy())', () => {
        expect(
          currentPlayerMustPlayCardsIfPossibleSpecMock.isSatisfiedBy,
        ).toHaveBeenCalledTimes(2);
        expect(
          currentPlayerMustPlayCardsIfPossibleSpecMock.isSatisfiedBy,
        ).toHaveBeenNthCalledWith(1, gameFixture, gameSpecFixture.options);
        expect(
          currentPlayerMustPlayCardsIfPossibleSpecMock.isSatisfiedBy,
        ).toHaveBeenNthCalledWith(2, gameFixture, gameSpecFixture.options);
      });

      it('should call playerCanDrawCardsSpec.isSatisfiedBy()', () => {
        expect(playerCanDrawCardsSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(
          1,
        );
        expect(playerCanDrawCardsSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
          gameFixture,
          gameSpecFixture.options,
          gameFixture.state.currentPlayingSlotIndex,
        );
      });

      it('should call gameIdPassTurnQueryV1Handler.handle()', () => {
        expect(gameIdPassTurnQueryV1HandlerMock.handle).toHaveBeenCalledTimes(
          1,
        );
        expect(gameIdPassTurnQueryV1HandlerMock.handle).toHaveBeenCalledWith(
          gameFixture.id,
          {
            kind: 'passTurn',
            slotIndex: gameFixture.state.currentPlayingSlotIndex,
          },
          userV1Fixture,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called, and currentPlayerMustPlayCardsIfPossibleSpec.isSatisfiedBy() returns true and playerCanDrawCardsSpec.isSatisfiedBy() returns true', () => {
      let gameFixture: ActiveGame;
      let gameSpecFixture: GameSpec;
      let userV1Fixture: apiModels.UserV1;

      let gameIdPlayCardsQueryV1Fixture: apiModels.GameIdPlayCardsQueryV1;

      let result: unknown;

      beforeAll(async () => {
        gameFixture = ActiveGameFixtures.withSlotsOne;
        gameSpecFixture = GameSpecFixtures.any;
        userV1Fixture = UserV1Fixtures.any;

        gameIdPlayCardsQueryV1Fixture = {
          cardIndexes: [0],
          kind: 'playCards',
          slotIndex: 0,
        };

        gamePersistenceOutputPortMock.findOne
          .mockResolvedValueOnce(gameFixture)
          .mockResolvedValueOnce(gameFixture)
          .mockResolvedValueOnce(gameFixture)
          .mockResolvedValueOnce(gameFixture);
        gameSpecPersistenceOutputPortMock.findOne
          .mockResolvedValueOnce(gameSpecFixture)
          .mockResolvedValueOnce(gameSpecFixture)
          .mockResolvedValueOnce(gameSpecFixture)
          .mockResolvedValueOnce(gameSpecFixture);

        userManagementInputPortMock.findOne.mockResolvedValueOnce(
          userV1Fixture,
        );

        currentPlayerMustPlayCardsIfPossibleSpecMock.isSatisfiedBy
          .mockReturnValueOnce(true)
          .mockReturnValueOnce(true);

        randomGameIdPlayCardsQueryV1FromActiveGameBuilderMock.build
          .mockReturnValueOnce(gameIdPlayCardsQueryV1Fixture)
          .mockReturnValueOnce(gameIdPlayCardsQueryV1Fixture);

        gameIdPlayCardsQueryV1HandlerMock.handle
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce(undefined);

        playerCanDrawCardsSpecMock.isSatisfiedBy.mockReturnValueOnce(true);

        gameIdDrawCardsQueryV1HandlerMock.handle.mockResolvedValueOnce(
          undefined,
        );

        gameIdPassTurnQueryV1HandlerMock.handle.mockResolvedValueOnce(
          undefined,
        );

        result = await gameIdAutoUpdateHandler.handle(gameIdFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gamePersistenceOutputPort.findOne()', () => {
        const expectedGameFindQuery: GameFindQuery = {
          id: gameIdFixture,
        };

        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(4);
        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          expectedGameFindQuery,
        );
      });

      it('should call gameSpecPersistenceOutputPort.findOne()', () => {
        const expectedGameSpecFindQuery: GameSpecFindQuery = {
          gameIds: [gameIdFixture],
        };

        expect(gameSpecPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(
          4,
        );
        expect(gameSpecPersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          expectedGameSpecFindQuery,
        );
      });

      it('should call userManagementInputPortMock.findOne()', () => {
        expect(userManagementInputPortMock.findOne).toHaveBeenCalledTimes(1);
        expect(userManagementInputPortMock.findOne).toHaveBeenCalledWith(
          (
            gameFixture.state.slots[
              gameFixture.state.currentPlayingSlotIndex
            ] as ActiveGameSlot
          ).userId,
        );
      });

      it('should call currentPlayerMustPlayCardsIfPossibleSpec.isSatisfiedBy())', () => {
        expect(
          currentPlayerMustPlayCardsIfPossibleSpecMock.isSatisfiedBy,
        ).toHaveBeenCalledTimes(2);
        expect(
          currentPlayerMustPlayCardsIfPossibleSpecMock.isSatisfiedBy,
        ).toHaveBeenNthCalledWith(1, gameFixture, gameSpecFixture.options);
        expect(
          currentPlayerMustPlayCardsIfPossibleSpecMock.isSatisfiedBy,
        ).toHaveBeenNthCalledWith(2, gameFixture, gameSpecFixture.options);
      });

      it('should call gameIdPlayCardsQueryV1Handler.handle()', () => {
        expect(gameIdPlayCardsQueryV1HandlerMock.handle).toHaveBeenCalledTimes(
          2,
        );
        expect(
          gameIdPlayCardsQueryV1HandlerMock.handle,
        ).toHaveBeenNthCalledWith(
          1,
          gameFixture.id,
          gameIdPlayCardsQueryV1Fixture,
          userV1Fixture,
        );
        expect(
          gameIdPlayCardsQueryV1HandlerMock.handle,
        ).toHaveBeenNthCalledWith(
          2,
          gameFixture.id,
          gameIdPlayCardsQueryV1Fixture,
          userV1Fixture,
        );
      });

      it('should call playerCanDrawCardsSpec.isSatisfiedBy()', () => {
        expect(playerCanDrawCardsSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(
          1,
        );
        expect(playerCanDrawCardsSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
          gameFixture,
          gameSpecFixture.options,
          gameFixture.state.currentPlayingSlotIndex,
        );
      });

      it('should call gameIdDrawCardsQueryV1Handler.handle()', () => {
        expect(gameIdDrawCardsQueryV1HandlerMock.handle).toHaveBeenCalledTimes(
          1,
        );
        expect(gameIdDrawCardsQueryV1HandlerMock.handle).toHaveBeenCalledWith(
          gameFixture.id,
          {
            kind: 'drawCards',
            slotIndex: gameFixture.state.currentPlayingSlotIndex,
          },
          userV1Fixture,
        );
      });

      it('should call gameIdPassTurnQueryV1Handler.handle()', () => {
        expect(gameIdPassTurnQueryV1HandlerMock.handle).toHaveBeenCalledTimes(
          1,
        );
        expect(gameIdPassTurnQueryV1HandlerMock.handle).toHaveBeenCalledWith(
          gameFixture.id,
          {
            kind: 'passTurn',
            slotIndex: gameFixture.state.currentPlayingSlotIndex,
          },
          userV1Fixture,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
