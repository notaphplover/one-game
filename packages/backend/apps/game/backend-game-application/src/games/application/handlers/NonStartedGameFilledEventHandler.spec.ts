import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { UuidProviderOutputPort } from '@cornie-js/backend-app-uuid';
import {
  MessageDeliveryScheduleKind,
  MessageSendOptions,
} from '@cornie-js/backend-application-messaging';
import {
  AppError,
  AppErrorKind,
  Builder,
  Handler,
} from '@cornie-js/backend-common';
import { TransactionWrapper } from '@cornie-js/backend-db/application';
import { Card, CardColor } from '@cornie-js/backend-game-domain/cards';
import {
  ActiveGame,
  ActiveGameSlot,
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
import { GameInitialSnapshotCreateQuery } from '@cornie-js/backend-game-domain/gameSnapshots';

import { NonStartedGameFilledEventFixtures } from '../fixtures/NonStartedGameFilledEventFixtures';
import { GameTurnEndSignalMessage } from '../models/GameTurnEndSignalMessage';
import { NonStartedGameFilledEvent } from '../models/NonStartedGameFilledEvent';
import { GamePersistenceOutputPort } from '../ports/output/GamePersistenceOutputPort';
import { GameSpecPersistenceOutputPort } from '../ports/output/GameSpecPersistenceOutputPort';
import { GameTurnEndSignalMessageSendOutputPort } from '../ports/output/GameTurnEndSignalMessageSendOutputPort';
import { NonStartedGameFilledEventHandler } from './NonStartedGameFilledEventHandler';

describe(NonStartedGameFilledEventHandler.name, () => {
  let createGameInitialSnapshotUseCaseHandlerMock: jest.Mocked<
    Handler<
      [GameInitialSnapshotCreateQuery, TransactionWrapper | undefined],
      void
    >
  >;
  let gameCardsEffectUpdateQueryFromGameBuilderMock: jest.Mocked<
    Builder<GameUpdateQuery, [ActiveGame, Card, number, CardColor | undefined]>
  >;
  let gamePassTurnUpdateQueryFromGameBuilderMock: jest.Mocked<
    Builder<GameUpdateQuery, [ActiveGame, GameSpec]>
  >;
  let gamePersistenceOutputPortMock: jest.Mocked<GamePersistenceOutputPort>;
  let gameServiceMock: jest.Mocked<GameService>;
  let gameSpecPersistenceOutputPortMock: jest.Mocked<GameSpecPersistenceOutputPort>;
  let gameTurnEndSignalMessageSendOutputPortMock: jest.Mocked<GameTurnEndSignalMessageSendOutputPort>;
  let startGameUpdateQueryFromGameBuilderMock: jest.Mocked<
    Builder<GameUpdateQuery, [NonStartedGame, GameSpec]>
  >;
  let uuidProviderOutputPortMock: jest.Mocked<UuidProviderOutputPort>;

  let nonStartedGameFilledEventHandler: NonStartedGameFilledEventHandler;

  beforeAll(() => {
    createGameInitialSnapshotUseCaseHandlerMock = {
      handle: jest.fn(),
    };

    gameCardsEffectUpdateQueryFromGameBuilderMock = {
      build: jest.fn(),
    };

    gamePassTurnUpdateQueryFromGameBuilderMock = {
      build: jest.fn(),
    };

    gamePersistenceOutputPortMock = {
      findOne: jest.fn(),
      update: jest.fn(),
    } as Partial<
      jest.Mocked<GamePersistenceOutputPort>
    > as jest.Mocked<GamePersistenceOutputPort>;

    gameTurnEndSignalMessageSendOutputPortMock = {
      send: jest.fn(),
    };

    gameServiceMock = {
      isColored: jest.fn() as unknown,
    } as Partial<jest.Mocked<GameService>> as jest.Mocked<GameService>;

    gameSpecPersistenceOutputPortMock = {
      findOne: jest.fn(),
    } as Partial<
      jest.Mocked<GameSpecPersistenceOutputPort>
    > as jest.Mocked<GameSpecPersistenceOutputPort>;

    startGameUpdateQueryFromGameBuilderMock = {
      build: jest.fn(),
    };

    uuidProviderOutputPortMock = {
      generateV4: jest.fn(),
    };

    nonStartedGameFilledEventHandler = new NonStartedGameFilledEventHandler(
      createGameInitialSnapshotUseCaseHandlerMock,
      gameCardsEffectUpdateQueryFromGameBuilderMock,
      gamePassTurnUpdateQueryFromGameBuilderMock,
      gameTurnEndSignalMessageSendOutputPortMock,
      gamePersistenceOutputPortMock,
      gameServiceMock,
      gameSpecPersistenceOutputPortMock,
      startGameUpdateQueryFromGameBuilderMock,
      uuidProviderOutputPortMock,
    );
  });

  describe('.handle', () => {
    let nonStartedGameFilledEventFixture: NonStartedGameFilledEvent;
    let transactionWrapperFixture: TransactionWrapper;

    beforeAll(() => {
      nonStartedGameFilledEventFixture = NonStartedGameFilledEventFixtures.any;
      transactionWrapperFixture = Symbol() as unknown as TransactionWrapper;
    });

    describe('when called, and gamePersistenceOutputPort.findOne() returns undefined', () => {
      let result: unknown;

      beforeAll(async () => {
        gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(undefined);

        try {
          await nonStartedGameFilledEventHandler.handle(
            nonStartedGameFilledEventFixture,
            transactionWrapperFixture,
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
            transactionWrapperFixture,
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

    describe('when called, and gamePersistenceOutputPort.findOne() returns a non started game and gameSpecPersistenceOutputPort.findOne() returns a game spec, and gamePersistenceOutputPort.findOne() returns an active game after game is updated and gameService.isColored() returns false', () => {
      let activeGameFixture: ActiveGame;
      let nonStartedGameFixture: NonStartedGame;
      let gameSpecFixture: GameSpec;
      let startGameUpdateQueryFixture: GameUpdateQuery;
      let cardEffectUpdateQueryFixture: GameUpdateQuery;
      let passTurnUpdateQueryFixture: GameUpdateQuery;
      let uuidFixture: string;

      let result: unknown;

      beforeAll(async () => {
        activeGameFixture = ActiveGameFixtures.withSlotsOne;
        nonStartedGameFixture = NonStartedGameFixtures.withGameSlotsOne;

        gameSpecFixture = GameSpecFixtures.any;
        startGameUpdateQueryFixture = GameUpdateQueryFixtures.any;
        cardEffectUpdateQueryFixture = GameUpdateQueryFixtures.any;
        passTurnUpdateQueryFixture = GameUpdateQueryFixtures.any;
        uuidFixture = 'uuid-fixture';

        startGameUpdateQueryFromGameBuilderMock.build.mockReturnValueOnce(
          startGameUpdateQueryFixture,
        );

        gameServiceMock.isColored.mockReturnValueOnce(false);

        gameCardsEffectUpdateQueryFromGameBuilderMock.build.mockReturnValueOnce(
          cardEffectUpdateQueryFixture,
        );

        gamePassTurnUpdateQueryFromGameBuilderMock.build.mockReturnValueOnce(
          passTurnUpdateQueryFixture,
        );

        gameSpecPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          gameSpecFixture,
        );

        gamePersistenceOutputPortMock.findOne
          .mockResolvedValueOnce(nonStartedGameFixture)
          .mockResolvedValueOnce(activeGameFixture)
          .mockResolvedValueOnce(activeGameFixture)
          .mockResolvedValueOnce(activeGameFixture);

        uuidProviderOutputPortMock.generateV4.mockReturnValue(uuidFixture);

        gameTurnEndSignalMessageSendOutputPortMock.send.mockResolvedValueOnce(
          undefined,
        );

        result = await nonStartedGameFilledEventHandler.handle(
          nonStartedGameFilledEventFixture,
          transactionWrapperFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();

        uuidProviderOutputPortMock.generateV4.mockReset();
      });

      it('should call gamePersistenceOutputPort.findOne()', () => {
        const expectedFirstQuery: GameFindQuery = {
          id: nonStartedGameFilledEventFixture.gameId,
        };

        const expectedSecondQuery: GameFindQuery = {
          id: nonStartedGameFixture.id,
        };

        const expectedThirdQuery: GameFindQuery = {
          id: activeGameFixture.id,
        };

        const expectedFourthQuery: GameFindQuery = {
          id: activeGameFixture.id,
        };

        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(4);
        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenNthCalledWith(
          1,
          expectedFirstQuery,
        );
        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenNthCalledWith(
          2,
          expectedSecondQuery,
          transactionWrapperFixture,
        );
        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenNthCalledWith(
          3,
          expectedThirdQuery,
          transactionWrapperFixture,
        );
        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenNthCalledWith(
          4,
          expectedFourthQuery,
          transactionWrapperFixture,
        );
      });

      it('should call gameSpecPersistenceOutputPort.findOne()', () => {
        const expected: GameSpecFindQuery = {
          gameIds: [nonStartedGameFilledEventFixture.gameId],
        };

        expect(gameSpecPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(
          1,
        );
        expect(
          gameSpecPersistenceOutputPortMock.findOne,
        ).toHaveBeenNthCalledWith(1, expected);
      });

      it('should call startGameUpdateQueryFromGameBuilder.build()', () => {
        expect(
          startGameUpdateQueryFromGameBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          startGameUpdateQueryFromGameBuilderMock.build,
        ).toHaveBeenCalledWith(nonStartedGameFixture, gameSpecFixture);
      });

      it('should call gameService.isColored()', () => {
        expect(gameServiceMock.isColored).toHaveBeenCalledTimes(1);
        expect(gameServiceMock.isColored).toHaveBeenCalledWith(
          activeGameFixture.state.currentCard,
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
          activeGameFixture.state.currentCard,
          1,
          activeGameFixture.state.currentColor,
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

      it('should call gamePersistenceOutputPort.update()', () => {
        expect(gamePersistenceOutputPortMock.update).toHaveBeenCalledTimes(3);
        expect(gamePersistenceOutputPortMock.update).toHaveBeenNthCalledWith(
          1,
          startGameUpdateQueryFixture,
          transactionWrapperFixture,
        );
        expect(gamePersistenceOutputPortMock.update).toHaveBeenNthCalledWith(
          2,
          cardEffectUpdateQueryFixture,
          transactionWrapperFixture,
        );
        expect(gamePersistenceOutputPortMock.update).toHaveBeenNthCalledWith(
          3,
          passTurnUpdateQueryFixture,
          transactionWrapperFixture,
        );
      });

      it('should call uuidProviderOutputPort.generateV4()', () => {
        expect(uuidProviderOutputPortMock.generateV4).toHaveBeenCalledTimes(2);
        expect(uuidProviderOutputPortMock.generateV4).toHaveBeenCalledWith();
      });

      it('should call createGameInitialSnapshotUseCaseHandler.handle()', () => {
        const expectedQuery: GameInitialSnapshotCreateQuery = {
          currentCard: activeGameFixture.state.currentCard,
          currentColor: activeGameFixture.state.currentColor,
          currentDirection: activeGameFixture.state.currentDirection,
          currentPlayingSlotIndex:
            activeGameFixture.state.currentPlayingSlotIndex,
          deck: activeGameFixture.state.deck,
          drawCount: activeGameFixture.state.drawCount,
          gameId: activeGameFixture.id,
          gameSlotCreateQueries: activeGameFixture.state.slots.map(
            (gameSlot: ActiveGameSlot) => ({
              cards: gameSlot.cards,
              gameInitialSnapshotId: uuidFixture,
              id: uuidFixture,
              position: gameSlot.position,
              userId: gameSlot.userId,
            }),
          ),
          id: uuidFixture,
        };

        expect(
          createGameInitialSnapshotUseCaseHandlerMock.handle,
        ).toHaveBeenCalledTimes(1);
        expect(
          createGameInitialSnapshotUseCaseHandlerMock.handle,
        ).toHaveBeenCalledWith(expectedQuery, transactionWrapperFixture);
      });

      it('should call gameTurnEndSignalMessageSendOutputPort.send()', () => {
        const messageSendOptions: MessageSendOptions<GameTurnEndSignalMessage> =
          {
            data: {
              gameId: activeGameFixture.id,
              turn: activeGameFixture.state.turn,
            },
            delivery: {
              schedule: {
                delayMs: 30000,
                kind: MessageDeliveryScheduleKind.delay,
              },
            },
          };

        expect(
          gameTurnEndSignalMessageSendOutputPortMock.send,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameTurnEndSignalMessageSendOutputPortMock.send,
        ).toHaveBeenCalledWith(messageSendOptions);
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
