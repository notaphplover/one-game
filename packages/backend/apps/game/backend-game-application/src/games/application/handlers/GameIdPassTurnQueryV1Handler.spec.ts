/*
 * Ugly workaround until https://github.com/jestjs/jest/issues/14874 is provided in jest@30
 */

const disposeSymbol: unique symbol = Symbol('Symbol.dispose');
const asyncDisposeSymbol: unique symbol = Symbol('Symbol.asyncDispose');

(Symbol as Writable<Partial<SymbolConstructor>>).asyncDispose ??=
  asyncDisposeSymbol as unknown as SymbolConstructor['asyncDispose'];
(Symbol as Writable<Partial<SymbolConstructor>>).dispose ??=
  disposeSymbol as unknown as SymbolConstructor['dispose'];

import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import {
  AppError,
  AppErrorKind,
  Builder,
  Handler,
  Writable,
} from '@cornie-js/backend-common';
import { TransactionWrapper } from '@cornie-js/backend-db/application';
import {
  ActiveGame,
  GameFindQuery,
  GameSpec,
  GameSpecFindQuery,
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

import { TransactionProvisionOutputPort } from '../../../foundation/db/application/ports/output/TransactionProvisionOutputPort';
import { UserV1Fixtures } from '../../../users/application/fixtures/models/UserV1Fixtures';
import { GameIdPassTurnQueryV1Fixtures } from '../fixtures/GameIdPassTurnQueryV1Fixtures';
import { ActiveGameUpdatedEvent } from '../models/ActiveGameUpdatedEvent';
import { ActiveGameUpdatedEventKind } from '../models/ActiveGameUpdatedEventKind';
import { GamePersistenceOutputPort } from '../ports/output/GamePersistenceOutputPort';
import { GameSpecPersistenceOutputPort } from '../ports/output/GameSpecPersistenceOutputPort';
import { GameIdPassTurnQueryV1Handler } from './GameIdPassTurnQueryV1Handler';

describe(GameIdPassTurnQueryV1Handler.name, () => {
  let gamePassTurnUpdateQueryFromGameBuilderMock: jest.Mocked<
    Builder<GameUpdateQuery, [ActiveGame, GameSpec]>
  >;
  let gamePersistenceOutputPortMock: jest.Mocked<GamePersistenceOutputPort>;
  let gameSpecPersistenceOutputPortMock: jest.Mocked<GameSpecPersistenceOutputPort>;
  let gameUpdatedEventHandlerMock: jest.Mocked<
    Handler<[ActiveGameUpdatedEvent], void>
  >;
  let playerCanUpdateGameSpecMock: jest.Mocked<PlayerCanUpdateGameSpec>;
  let playerCanPassTurnSpecMock: jest.Mocked<PlayerCanPassTurnSpec>;
  let transactionProvisionOutputPortMock: jest.Mocked<TransactionProvisionOutputPort>;

  let gameIdPassTurnQueryV1Handler: GameIdPassTurnQueryV1Handler;

  beforeAll(() => {
    gamePassTurnUpdateQueryFromGameBuilderMock = {
      build: jest.fn(),
    };
    gamePersistenceOutputPortMock = {
      findOne: jest.fn(),
      update: jest.fn(),
    } as Partial<
      jest.Mocked<GamePersistenceOutputPort>
    > as jest.Mocked<GamePersistenceOutputPort>;
    gameSpecPersistenceOutputPortMock = {
      findOne: jest.fn(),
    } as Partial<
      jest.Mocked<GameSpecPersistenceOutputPort>
    > as jest.Mocked<GameSpecPersistenceOutputPort>;
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
    transactionProvisionOutputPortMock = {
      provide: jest.fn(),
    };

    gameIdPassTurnQueryV1Handler = new GameIdPassTurnQueryV1Handler(
      gamePassTurnUpdateQueryFromGameBuilderMock,
      gamePersistenceOutputPortMock,
      gameSpecPersistenceOutputPortMock,
      gameUpdatedEventHandlerMock,
      playerCanUpdateGameSpecMock,
      playerCanPassTurnSpecMock,
      transactionProvisionOutputPortMock,
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

    describe('when called, and gamePersistenceOutputPort.findOne() returns Game, gameSpecPersistenceOutputPort.findOne() returns GameSpec and playerCanUpdateGameSpec.isSatisfiedBy returns false', () => {
      let activeGameFixture: ActiveGame;
      let gameSpecFixture: GameSpec;

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

        gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          activeGameFixture,
        );
        gameSpecPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          gameSpecFixture,
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

    describe('when called, and gamePersistenceOutputPort.findOne() returns Game, gameSpecPersistenceOutputPort.findOne() returns GameSpec and playerCanUpdateGameSpec.isSatisfiedBy() returns true and playerCanPassTurnSpec.isSatisfiedBy() returns false', () => {
      let activeGameFixture: ActiveGame;
      let gameSpecFixture: GameSpec;

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

        gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          activeGameFixture,
        );
        gameSpecPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          gameSpecFixture,
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

    describe('when called, and gamePersistenceOutputPort.findOne() returns Game, gameSpecPersistenceOutputPort.findOne() returns GameSpec and playerCanUpdateGameSpec.isSatisfiedBy() returns true and playerCanPassTurnSpec.isSatisfiedBy() returns true', () => {
      let activeGameFixture: ActiveGame;
      let gameSpecFixture: GameSpec;
      let gameUpdateQueryFixture: GameUpdateQuery;
      let transactionWrapperMock: jest.Mocked<TransactionWrapper>;

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
        transactionWrapperMock = {
          [Symbol.asyncDispose]: jest.fn(),
          tryCommit: jest.fn(),
        } as Partial<
          jest.Mocked<TransactionWrapper>
        > as jest.Mocked<TransactionWrapper>;

        gamePersistenceOutputPortMock.findOne
          .mockResolvedValueOnce(activeGameFixture)
          .mockResolvedValueOnce(activeGameFixture);
        gameSpecPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          gameSpecFixture,
        );

        gamePassTurnUpdateQueryFromGameBuilderMock.build.mockReturnValueOnce(
          gameUpdateQueryFixture,
        );

        playerCanUpdateGameSpecMock.isSatisfiedBy.mockReturnValueOnce(true);

        playerCanPassTurnSpecMock.isSatisfiedBy.mockReturnValueOnce(true);

        transactionProvisionOutputPortMock.provide.mockResolvedValueOnce(
          transactionWrapperMock,
        );

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
        const expectedFirstGameFindQuery: GameFindQuery = {
          id: gameIdFixture,
        };
        const expectedSecondGameFindQuery: GameFindQuery = {
          id: activeGameFixture.id,
        };

        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(2);
        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenNthCalledWith(
          1,
          expectedFirstGameFindQuery,
        );
        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenNthCalledWith(
          2,
          expectedSecondGameFindQuery,
          transactionWrapperMock,
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

      it('should call gamePassTurnUpdateQueryFromGameBuilder.build()', () => {
        expect(
          gamePassTurnUpdateQueryFromGameBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          gamePassTurnUpdateQueryFromGameBuilderMock.build,
        ).toHaveBeenCalledWith(activeGameFixture, gameSpecFixture);
      });

      it('should call transactionProvisionOutputPort.provide()', () => {
        expect(
          transactionProvisionOutputPortMock.provide,
        ).toHaveBeenCalledTimes(1);
        expect(
          transactionProvisionOutputPortMock.provide,
        ).toHaveBeenCalledWith();
      });

      it('should call gamePersistenceOutputPort.update()', () => {
        expect(gamePersistenceOutputPortMock.update).toHaveBeenCalledTimes(1);
        expect(gamePersistenceOutputPortMock.update).toHaveBeenCalledWith(
          gameUpdateQueryFixture,
          transactionWrapperMock,
        );
      });

      it('should call gameUpdatedEventHandler.handle()', () => {
        const expectedGameUpdatedEvent: ActiveGameUpdatedEvent = {
          game: activeGameFixture,
          gameBeforeUpdate: activeGameFixture,
          kind: ActiveGameUpdatedEventKind.turnPass,
          transactionWrapper: transactionWrapperMock,
        };

        expect(gameUpdatedEventHandlerMock.handle).toHaveBeenCalledTimes(1);
        expect(gameUpdatedEventHandlerMock.handle).toHaveBeenCalledWith(
          expectedGameUpdatedEvent,
        );
      });

      it('should call transactionWrapper.tryCommit()', () => {
        expect(transactionWrapperMock.tryCommit).toHaveBeenCalledTimes(1);
        expect(transactionWrapperMock.tryCommit).toHaveBeenCalledWith();
      });

      it('should call transactionWrapper[Symbol.asyncDispose]()', () => {
        expect(
          transactionWrapperMock[Symbol.asyncDispose],
        ).toHaveBeenCalledTimes(1);
        expect(
          transactionWrapperMock[Symbol.asyncDispose],
        ).toHaveBeenCalledWith();
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
