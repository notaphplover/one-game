import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import {
  AppError,
  AppErrorKind,
  Builder,
  Handler,
} from '@cornie-js/backend-common';
import { TransactionWrapper } from '@cornie-js/backend-db/application';
import { CardColor, Card } from '@cornie-js/backend-game-domain/cards';
import {
  ActiveGame,
  CurrentPlayerCanPlayCardsSpec,
  GameFindQuery,
  GameSpec,
  GameSpecFindQuery,
  GameUpdateQuery,
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
import { GameIdPlayCardsQueryV1Fixtures } from '../fixtures/GameIdPlayCardsQueryV1Fixtures';
import { GameUpdatedEvent } from '../models/GameUpdatedEvent';
import { GamePersistenceOutputPort } from '../ports/output/GamePersistenceOutputPort';
import { GameSpecPersistenceOutputPort } from '../ports/output/GameSpecPersistenceOutputPort';
import { GameIdPlayCardsQueryV1Handler } from './GameIdPlayCardsQueryV1Handler';

describe(GameIdPlayCardsQueryV1Handler.name, () => {
  let gameCardsEffectUpdateQueryFromGameBuilderMock: jest.Mocked<
    Builder<GameUpdateQuery, [ActiveGame, Card, number, CardColor | undefined]>
  >;
  let gameSpecPersistenceOutputPortMock: jest.Mocked<GameSpecPersistenceOutputPort>;
  let gamePersistenceOutputPortMock: jest.Mocked<GamePersistenceOutputPort>;
  let gamePlayCardsUpdateQueryFromGameBuilderMock: jest.Mocked<
    Builder<GameUpdateQuery, [ActiveGame, number[], number]>
  >;
  let gameUpdatedEventHandlerMock: jest.Mocked<
    Handler<[GameUpdatedEvent], void>
  >;
  let playerCanUpdateGameSpecMock: jest.Mocked<PlayerCanUpdateGameSpec>;
  let cardColorFromCardColorV1BuilderMock: jest.Mocked<
    Builder<CardColor, [apiModels.CardColorV1]>
  >;
  let currentPlayerCanPlayCardsSpecMock: jest.Mocked<CurrentPlayerCanPlayCardsSpec>;
  let transactionProvisionOutputPortMock: jest.Mocked<TransactionProvisionOutputPort>;

  let gameIdPlayCardsQueryV1Handler: GameIdPlayCardsQueryV1Handler;

  beforeAll(() => {
    gameCardsEffectUpdateQueryFromGameBuilderMock = {
      build: jest.fn(),
    };
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
    gamePlayCardsUpdateQueryFromGameBuilderMock = {
      build: jest.fn(),
    };
    gameUpdatedEventHandlerMock = {
      handle: jest.fn(),
    };
    playerCanUpdateGameSpecMock = {
      isSatisfiedBy: jest.fn(),
    };
    cardColorFromCardColorV1BuilderMock = {
      build: jest.fn(),
    };
    currentPlayerCanPlayCardsSpecMock = {
      isSatisfiedBy: jest.fn(),
    } as Partial<
      jest.Mocked<CurrentPlayerCanPlayCardsSpec>
    > as jest.Mocked<CurrentPlayerCanPlayCardsSpec>;
    transactionProvisionOutputPortMock = {
      provide: jest.fn(),
    };

    gameIdPlayCardsQueryV1Handler = new GameIdPlayCardsQueryV1Handler(
      gameCardsEffectUpdateQueryFromGameBuilderMock,
      gameSpecPersistenceOutputPortMock,
      gamePersistenceOutputPortMock,
      gamePlayCardsUpdateQueryFromGameBuilderMock,
      gameUpdatedEventHandlerMock,
      playerCanUpdateGameSpecMock,
      cardColorFromCardColorV1BuilderMock,
      currentPlayerCanPlayCardsSpecMock,
      transactionProvisionOutputPortMock,
    );
  });

  describe('having a gameId and GameIdPlayCardsQueryV1 with no colorChoice', () => {
    let gameIdFixture: string;
    let gameIdPlayCardsQueryV1Fixture: apiModels.GameIdPlayCardsQueryV1;
    let userV1Fixture: apiModels.UserV1;

    beforeAll(() => {
      gameIdFixture = ActiveGameFixtures.any.id;
      gameIdPlayCardsQueryV1Fixture =
        GameIdPlayCardsQueryV1Fixtures.withColorChoice;
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
          await gameIdPlayCardsQueryV1Handler.handle(
            gameIdFixture,
            gameIdPlayCardsQueryV1Fixture,
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
          await gameIdPlayCardsQueryV1Handler.handle(
            gameIdFixture,
            gameIdPlayCardsQueryV1Fixture,
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

  describe('having a gameId, a gameIdPassTurnQueryV1 with an existing slot index and no color choice and a user', () => {
    let gameIdFixture: string;
    let gameIdPlayCardsQueryV1Fixture: apiModels.GameIdPlayCardsQueryV1;
    let userV1Fixture: apiModels.UserV1;

    beforeAll(() => {
      gameIdFixture = ActiveGameFixtures.any.id;
      gameIdPlayCardsQueryV1Fixture =
        GameIdPlayCardsQueryV1Fixtures.withNoColorChoiceAndSlotIndexZero;
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
          await gameIdPlayCardsQueryV1Handler.handle(
            gameIdFixture,
            gameIdPlayCardsQueryV1Fixture,
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
          gameIdPlayCardsQueryV1Fixture.slotIndex,
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

    describe('when called, and gamePersistenceOutputPort.findOne() returns Game, gameSpecPersistenceOutputPort.findOne() returns GameSpec and playerCanUpdateGameSpec.isSatisfiedBy returns true and playerCanPlayCardsSpec.isSatisfiedBy returns false', () => {
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

        currentPlayerCanPlayCardsSpecMock.isSatisfiedBy.mockReturnValueOnce(
          false,
        );

        try {
          await gameIdPlayCardsQueryV1Handler.handle(
            gameIdFixture,
            gameIdPlayCardsQueryV1Fixture,
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
          gameIdPlayCardsQueryV1Fixture.slotIndex,
        );
      });

      it('should call playerCanPlayCardsSpec.isSatisfiedBy()', () => {
        expect(
          currentPlayerCanPlayCardsSpecMock.isSatisfiedBy,
        ).toHaveBeenCalledTimes(1);
        expect(
          currentPlayerCanPlayCardsSpecMock.isSatisfiedBy,
        ).toHaveBeenCalledWith(
          activeGameFixture,
          gameSpecFixture.options,
          gameIdPlayCardsQueryV1Fixture.cardIndexes,
        );
      });

      it('should throw an Error', () => {
        const expectedErrorProperties: Partial<AppError> = {
          kind: AppErrorKind.unprocessableOperation,
          message:
            'Operation not allowed. Reason: selected cards cannot be played in the current context',
        };

        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });

    describe('when called, and gamePersistenceOutputPort.findOne() returns Game, gameSpecPersistenceOutputPort.findOne() returns GameSpec and playerCanUpdateGameSpec.isSatisfiedBy returns true and playerCanPlayCardsSpec.isSatisfiedBy returns true', () => {
      let activeGameFixture: ActiveGame;
      let gameSpecFixture: GameSpec;
      let gamePlayCardsUpdateQueryFixture: GameUpdateQuery;
      let gameCardsEffectUpdateQueryFixture: GameUpdateQuery;
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
        gamePlayCardsUpdateQueryFixture =
          GameUpdateQueryFixtures.withCurrentCard;
        transactionWrapperMock = {
          tryCommit: jest.fn(),
        } as Partial<
          jest.Mocked<TransactionWrapper>
        > as jest.Mocked<TransactionWrapper>;
        gameCardsEffectUpdateQueryFixture = GameUpdateQueryFixtures.any;

        gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          activeGameFixture,
        );
        gameSpecPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          gameSpecFixture,
        );

        gamePlayCardsUpdateQueryFromGameBuilderMock.build.mockReturnValueOnce(
          gamePlayCardsUpdateQueryFixture,
        );
        gameCardsEffectUpdateQueryFromGameBuilderMock.build.mockReturnValueOnce(
          gameCardsEffectUpdateQueryFixture,
        );

        playerCanUpdateGameSpecMock.isSatisfiedBy.mockReturnValueOnce(true);

        currentPlayerCanPlayCardsSpecMock.isSatisfiedBy.mockReturnValueOnce(
          true,
        );

        transactionProvisionOutputPortMock.provide.mockResolvedValueOnce(
          transactionWrapperMock,
        );

        gameUpdatedEventHandlerMock.handle.mockResolvedValueOnce(undefined);

        result = await gameIdPlayCardsQueryV1Handler.handle(
          gameIdFixture,
          gameIdPlayCardsQueryV1Fixture,
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
          gameIdPlayCardsQueryV1Fixture.slotIndex,
        );
      });

      it('should call playerCanPlayCardsSpec.isSatisfiedBy()', () => {
        expect(
          currentPlayerCanPlayCardsSpecMock.isSatisfiedBy,
        ).toHaveBeenCalledTimes(1);
        expect(
          currentPlayerCanPlayCardsSpecMock.isSatisfiedBy,
        ).toHaveBeenCalledWith(
          activeGameFixture,
          gameSpecFixture.options,
          gameIdPlayCardsQueryV1Fixture.cardIndexes,
        );
      });

      it('should call gamePlayCardsUpdateQueryFromGameBuilder.build()', () => {
        expect(
          gamePlayCardsUpdateQueryFromGameBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          gamePlayCardsUpdateQueryFromGameBuilderMock.build,
        ).toHaveBeenCalledWith(
          activeGameFixture,
          gameIdPlayCardsQueryV1Fixture.cardIndexes,
          gameIdPlayCardsQueryV1Fixture.slotIndex,
        );
      });

      it('should call gameCardsEffectUpdateQueryFromGameBuilder.build()', () => {
        expect(
          gameCardsEffectUpdateQueryFromGameBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameCardsEffectUpdateQueryFromGameBuilderMock.build,
        ).toHaveBeenCalledWith(
          activeGameFixture,
          gamePlayCardsUpdateQueryFixture.currentCard,
          gameSpecFixture.gameSlotsAmount,
          undefined,
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

      it('should call gamePersistenceOutputPort.update()', () => {
        expect(gamePersistenceOutputPortMock.update).toHaveBeenCalledTimes(2);
        expect(gamePersistenceOutputPortMock.update).toHaveBeenNthCalledWith(
          1,
          gamePlayCardsUpdateQueryFixture,
          transactionWrapperMock,
        );
        expect(gamePersistenceOutputPortMock.update).toHaveBeenNthCalledWith(
          2,
          gameCardsEffectUpdateQueryFixture,
          transactionWrapperMock,
        );
      });

      it('should call gameUpdatedEventHandler.handle()', () => {
        const expectedGameUpdatedEvent: GameUpdatedEvent = {
          gameBeforeUpdate: activeGameFixture,
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

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('having a gameId, a gameIdPassTurnQueryV1 with an existing slot index and color choice and a user', () => {
    let gameIdFixture: string;
    let gameIdPlayCardsQueryV1Fixture: apiModels.GameIdPlayCardsQueryV1;
    let userV1Fixture: apiModels.UserV1;

    beforeAll(() => {
      gameIdFixture = ActiveGameFixtures.any.id;
      gameIdPlayCardsQueryV1Fixture =
        GameIdPlayCardsQueryV1Fixtures.withColorChoiceAndSlotIndexZero;
      userV1Fixture = UserV1Fixtures.any;
    });

    describe('when called, and gamePersistenceOutputPort.findOne() returns Game, gameSpecPersistenceOutputPort.findOne() returns GameSpec and playerCanUpdateGameSpec.isSatisfiedBy returns true and playerCanPlayCardsSpec.isSatisfiedBy returns true', () => {
      let activeGameFixture: ActiveGame;
      let cardColorFixture: CardColor;
      let gameSpecFixture: GameSpec;
      let gamePlayCardsUpdateQueryFixture: GameUpdateQuery;
      let gameCardsEffectUpdateQueryFixture: GameUpdateQuery;
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
        cardColorFixture = CardColor.blue;
        gameSpecFixture = GameSpecFixtures.any;
        gamePlayCardsUpdateQueryFixture =
          GameUpdateQueryFixtures.withCurrentCard;
        transactionWrapperMock = {
          tryCommit: jest.fn(),
        } as Partial<
          jest.Mocked<TransactionWrapper>
        > as jest.Mocked<TransactionWrapper>;
        gameCardsEffectUpdateQueryFixture = GameUpdateQueryFixtures.any;

        gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          activeGameFixture,
        );
        gameSpecPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          gameSpecFixture,
        );
        cardColorFromCardColorV1BuilderMock.build.mockReturnValueOnce(
          cardColorFixture,
        );

        gamePlayCardsUpdateQueryFromGameBuilderMock.build.mockReturnValueOnce(
          gamePlayCardsUpdateQueryFixture,
        );
        gameCardsEffectUpdateQueryFromGameBuilderMock.build.mockReturnValueOnce(
          gameCardsEffectUpdateQueryFixture,
        );

        playerCanUpdateGameSpecMock.isSatisfiedBy.mockReturnValueOnce(true);

        currentPlayerCanPlayCardsSpecMock.isSatisfiedBy.mockReturnValueOnce(
          true,
        );

        transactionProvisionOutputPortMock.provide.mockResolvedValueOnce(
          transactionWrapperMock,
        );

        gameUpdatedEventHandlerMock.handle.mockResolvedValueOnce(undefined);

        result = await gameIdPlayCardsQueryV1Handler.handle(
          gameIdFixture,
          gameIdPlayCardsQueryV1Fixture,
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
          gameIdPlayCardsQueryV1Fixture.slotIndex,
        );
      });

      it('should call playerCanPlayCardsSpec.isSatisfiedBy()', () => {
        expect(
          currentPlayerCanPlayCardsSpecMock.isSatisfiedBy,
        ).toHaveBeenCalledTimes(1);
        expect(
          currentPlayerCanPlayCardsSpecMock.isSatisfiedBy,
        ).toHaveBeenCalledWith(
          activeGameFixture,
          gameSpecFixture.options,
          gameIdPlayCardsQueryV1Fixture.cardIndexes,
        );
      });

      it('should call cardColorFromCardColorV1Builder.build()', () => {
        expect(cardColorFromCardColorV1BuilderMock.build).toHaveBeenCalledTimes(
          1,
        );
        expect(cardColorFromCardColorV1BuilderMock.build).toHaveBeenCalledWith(
          gameIdPlayCardsQueryV1Fixture.colorChoice,
        );
      });

      it('should call gamePlayCardsUpdateQueryFromGameBuilder.build()', () => {
        expect(
          gamePlayCardsUpdateQueryFromGameBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          gamePlayCardsUpdateQueryFromGameBuilderMock.build,
        ).toHaveBeenCalledWith(
          activeGameFixture,
          gameIdPlayCardsQueryV1Fixture.cardIndexes,
          gameIdPlayCardsQueryV1Fixture.slotIndex,
        );
      });

      it('should call gameCardsEffectUpdateQueryFromGameBuilder.build()', () => {
        expect(
          gameCardsEffectUpdateQueryFromGameBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameCardsEffectUpdateQueryFromGameBuilderMock.build,
        ).toHaveBeenCalledWith(
          activeGameFixture,
          gamePlayCardsUpdateQueryFixture.currentCard,
          gameSpecFixture.gameSlotsAmount,
          cardColorFixture,
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

      it('should call gamePersistenceOutputPort.update()', () => {
        expect(gamePersistenceOutputPortMock.update).toHaveBeenCalledTimes(2);
        expect(gamePersistenceOutputPortMock.update).toHaveBeenNthCalledWith(
          1,
          gamePlayCardsUpdateQueryFixture,
          transactionWrapperMock,
        );
        expect(gamePersistenceOutputPortMock.update).toHaveBeenNthCalledWith(
          2,
          gameCardsEffectUpdateQueryFixture,
          transactionWrapperMock,
        );
      });

      it('should call gameUpdatedEventHandler.handle()', () => {
        const expectedGameUpdatedEvent: GameUpdatedEvent = {
          gameBeforeUpdate: activeGameFixture,
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

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
