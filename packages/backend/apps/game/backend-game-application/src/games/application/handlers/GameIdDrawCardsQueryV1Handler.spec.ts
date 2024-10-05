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
  GameDrawMutation,
  GameDrawService,
  GameFindQuery,
  GameSpec,
  GameSpecFindQuery,
  GameUpdateQuery,
  PlayerCanDrawCardsSpec,
  PlayerCanUpdateGameSpec,
} from '@cornie-js/backend-game-domain/games';
import {
  ActiveGameFixtures,
  ActiveGameSlotFixtures,
  GameDrawMutationFixtures,
  GameSpecFixtures,
  GameUpdateQueryFixtures,
} from '@cornie-js/backend-game-domain/games/fixtures';

import { TransactionProvisionOutputPort } from '../../../foundation/db/application/ports/output/TransactionProvisionOutputPort';
import { UserV1Fixtures } from '../../../users/application/fixtures/models/UserV1Fixtures';
import { GameIdDrawCardsQueryV1Fixtures } from '../fixtures/GameIdDrawCardsQueryV1Fixtures';
import { ActiveGameUpdatedEvent } from '../models/ActiveGameUpdatedEvent';
import { ActiveGameUpdatedEventKind } from '../models/ActiveGameUpdatedEventKind';
import { GamePersistenceOutputPort } from '../ports/output/GamePersistenceOutputPort';
import { GameSpecPersistenceOutputPort } from '../ports/output/GameSpecPersistenceOutputPort';
import { GameIdDrawCardsQueryV1Handler } from './GameIdDrawCardsQueryV1Handler';

describe(GameIdDrawCardsQueryV1Handler.name, () => {
  let gameDrawCardsUpdateQueryFromGameBuilderMock: jest.Mocked<
    Builder<GameUpdateQuery, [ActiveGame]>
  >;
  let gameDrawServiceMock: jest.Mocked<GameDrawService>;
  let gamePersistenceOutputPortMock: jest.Mocked<GamePersistenceOutputPort>;
  let gameSpecPersistenceOutputPortMock: jest.Mocked<GameSpecPersistenceOutputPort>;
  let gameUpdatedEventHandlerMock: jest.Mocked<
    Handler<[ActiveGameUpdatedEvent], void>
  >;
  let playerCanUpdateGameSpecMock: jest.Mocked<PlayerCanUpdateGameSpec>;
  let playerCanDrawCardsSpecMock: jest.Mocked<PlayerCanDrawCardsSpec>;
  let transactionProvisionOutputPortMock: jest.Mocked<TransactionProvisionOutputPort>;

  let gameIdDrawCardsQueryV1Handler: GameIdDrawCardsQueryV1Handler;

  beforeAll(() => {
    gameDrawCardsUpdateQueryFromGameBuilderMock = {
      build: jest.fn(),
    };
    gameDrawServiceMock = {
      calculateDrawMutation: jest.fn(),
    } as Partial<jest.Mocked<GameDrawService>> as jest.Mocked<GameDrawService>;
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
    playerCanDrawCardsSpecMock = {
      isSatisfiedBy: jest.fn(),
    } as Partial<
      jest.Mocked<PlayerCanDrawCardsSpec>
    > as jest.Mocked<PlayerCanDrawCardsSpec>;
    transactionProvisionOutputPortMock = {
      provide: jest.fn(),
    };

    gameIdDrawCardsQueryV1Handler = new GameIdDrawCardsQueryV1Handler(
      gameDrawCardsUpdateQueryFromGameBuilderMock,
      gameDrawServiceMock,
      gamePersistenceOutputPortMock,
      gameSpecPersistenceOutputPortMock,
      gameUpdatedEventHandlerMock,
      playerCanUpdateGameSpecMock,
      playerCanDrawCardsSpecMock,
      transactionProvisionOutputPortMock,
    );
  });

  describe('having a gameId', () => {
    let gameIdFixture: string;
    let gameIdDrawCardsQueryV1Fixture: apiModels.GameIdDrawCardsQueryV1;
    let userV1Fixture: apiModels.UserV1;

    beforeAll(() => {
      gameIdFixture = ActiveGameFixtures.any.id;
      gameIdDrawCardsQueryV1Fixture = GameIdDrawCardsQueryV1Fixtures.any;
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
          await gameIdDrawCardsQueryV1Handler.handle(
            gameIdFixture,
            gameIdDrawCardsQueryV1Fixture,
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
          await gameIdDrawCardsQueryV1Handler.handle(
            gameIdFixture,
            gameIdDrawCardsQueryV1Fixture,
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
    let gameIdDrawCardsQueryV1Fixture: apiModels.GameIdDrawCardsQueryV1;
    let userV1Fixture: apiModels.UserV1;

    beforeAll(() => {
      gameIdFixture = ActiveGameFixtures.any.id;
      gameIdDrawCardsQueryV1Fixture =
        GameIdDrawCardsQueryV1Fixtures.withSlotIndexZero;
      userV1Fixture = UserV1Fixtures.any;
    });

    describe('when called, and gamePersistenceOutputPort.findOne() returns Game, gameSpecPersistenceOutputPort.findOne() returns GameSpec and playerCanUpdateGameSpec.isSatisfiedBy() returns false', () => {
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

        gameDrawCardsUpdateQueryFromGameBuilderMock.build.mockReturnValueOnce(
          gameUpdateQueryFixture,
        );

        playerCanUpdateGameSpecMock.isSatisfiedBy.mockReturnValueOnce(false);

        try {
          await gameIdDrawCardsQueryV1Handler.handle(
            gameIdFixture,
            gameIdDrawCardsQueryV1Fixture,
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
          gameIdDrawCardsQueryV1Fixture.slotIndex,
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

    describe('when called, and gamePersistenceOutputPort.findOne() returns Game, gameSpecPersistenceOutputPort.findOne() returns GameSpec and playerCanUpdateGameSpec.isSatisfiedBy() returns true and playerCanDrawCardsSpec.isSatisfiedBy() returns false', () => {
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

        playerCanDrawCardsSpecMock.isSatisfiedBy.mockReturnValueOnce(false);

        try {
          await gameIdDrawCardsQueryV1Handler.handle(
            gameIdFixture,
            gameIdDrawCardsQueryV1Fixture,
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
          gameIdDrawCardsQueryV1Fixture.slotIndex,
        );
      });

      it('playerCanPassTurnSpec.isSatisfiedBy()', () => {
        expect(playerCanDrawCardsSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(
          1,
        );
        expect(playerCanDrawCardsSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
          activeGameFixture,
          gameSpecFixture.options,
          gameIdDrawCardsQueryV1Fixture.slotIndex,
        );
      });

      it('should throw an Error', () => {
        const expectedErrorProperties: Partial<AppError> = {
          kind: AppErrorKind.unprocessableOperation,
          message: 'Player cannot draw cards',
        };

        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });

    describe('when called, and gamePersistenceOutputPort.findOne() returns Game, gameSpecPersistenceOutputPort.findOne() returns GameSpec and playerCanUpdateGameSpec.isSatisfiedBy() returns true and playerCanDrawCardsSpec.isSatisfiedBy() returns true', () => {
      let activeGameFixture: ActiveGame;
      let gameSpecFixture: GameSpec;
      let gameDrawMutationFixture: GameDrawMutation;
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
        gameDrawMutationFixture = GameDrawMutationFixtures.any;
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

        playerCanUpdateGameSpecMock.isSatisfiedBy.mockReturnValueOnce(true);

        playerCanDrawCardsSpecMock.isSatisfiedBy.mockReturnValueOnce(true);

        gameDrawServiceMock.calculateDrawMutation.mockReturnValueOnce(
          gameDrawMutationFixture,
        );

        gameDrawCardsUpdateQueryFromGameBuilderMock.build.mockReturnValueOnce(
          gameUpdateQueryFixture,
        );

        transactionProvisionOutputPortMock.provide.mockResolvedValueOnce(
          transactionWrapperMock,
        );

        gameUpdatedEventHandlerMock.handle.mockResolvedValueOnce(undefined);

        result = await gameIdDrawCardsQueryV1Handler.handle(
          gameIdFixture,
          gameIdDrawCardsQueryV1Fixture,
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
          gameIdDrawCardsQueryV1Fixture.slotIndex,
        );
      });

      it('should call playerCanPassTurnSpec.isSatisfiedBy()', () => {
        expect(playerCanDrawCardsSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(
          1,
        );
        expect(playerCanDrawCardsSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
          activeGameFixture,
          gameSpecFixture.options,
          gameIdDrawCardsQueryV1Fixture.slotIndex,
        );
      });

      it('should call transactionProvisionOutputPort.provide()', () => {
        expect(
          transactionProvisionOutputPortMock.provide,
        ).toHaveBeenCalledTimes(1);
        expect(
          transactionProvisionOutputPortMock.provide,
        ).toHaveBeenCalledWith();
      });

      it('should call gameDrawCardsUpdateQueryFromGameBuilder.build()', () => {
        expect(
          gameDrawCardsUpdateQueryFromGameBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameDrawCardsUpdateQueryFromGameBuilderMock.build,
        ).toHaveBeenCalledWith(activeGameFixture, gameDrawMutationFixture);
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
          draw: gameDrawMutationFixture.cards,
          game: activeGameFixture,
          gameBeforeUpdate: activeGameFixture,
          kind: ActiveGameUpdatedEventKind.cardsDraw,
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
