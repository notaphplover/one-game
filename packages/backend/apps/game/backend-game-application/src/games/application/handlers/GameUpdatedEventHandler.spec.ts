import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { UuidProviderOutputPort } from '@cornie-js/backend-app-uuid';
import {
  MessageDeliveryScheduleKind,
  MessageSendOptions,
} from '@cornie-js/backend-application-messaging';
import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import {
  GameAction,
  GameActionCreateQuery,
} from '@cornie-js/backend-game-domain/gameActions';
import {
  GameActionCreateQueryFixtures,
  GameActionFixtures,
} from '@cornie-js/backend-game-domain/gameActions/fixtures';
import {
  ActiveGame,
  GameFindQuery,
  GameUpdateQuery,
} from '@cornie-js/backend-game-domain/games';
import { ActiveGameFixtures } from '@cornie-js/backend-game-domain/games/fixtures';

import { UuidContext } from '../../../foundation/common/application/models/UuidContext';
import { GameActionPersistenceOutputPort } from '../../../gameActions/application/ports/output/GameActionPersistenceOutputPort';
import { ActiveGameUpdatedEventFixtures } from '../fixtures/ActiveGameUpdatedEventFixtures';
import { ActiveGameUpdatedEvent } from '../models/ActiveGameUpdatedEvent';
import { GameMessageEventKind } from '../models/GameMessageEventKind';
import { GameTurnEndSignalMessage } from '../models/GameTurnEndSignalMessage';
import { GameUpdatedMessageEvent } from '../models/GameUpdatedMessageEvent';
import { GameEventsSubscriptionOutputPort } from '../ports/output/GameEventsSubscriptionOutputPort';
import { GamePersistenceOutputPort } from '../ports/output/GamePersistenceOutputPort';
import { GameTurnEndSignalMessageSendOutputPort } from '../ports/output/GameTurnEndSignalMessageSendOutputPort';
import { GameUpdatedEventHandler } from './GameUpdatedEventHandler';

describe(GameUpdatedEventHandler.name, () => {
  let gameActionCreateQueryFromGameUpdateEventBuilderMock: jest.Mocked<
    Builder<GameActionCreateQuery, [ActiveGameUpdatedEvent, UuidContext]>
  >;
  let gameActionPersistenceOutputPortMock: jest.Mocked<GameActionPersistenceOutputPort>;
  let gameEventsSubscriptionOutputPortMock: jest.Mocked<GameEventsSubscriptionOutputPort>;
  let gamePersistenceOutputPortMock: jest.Mocked<GamePersistenceOutputPort>;
  let gameTurnEndSignalMessageSendOutputPortMock: jest.Mocked<GameTurnEndSignalMessageSendOutputPort>;
  let uuidProviderOutputPortMock: jest.Mocked<UuidProviderOutputPort>;

  let gameUpdatedEventHandler: GameUpdatedEventHandler;

  beforeAll(() => {
    gameActionCreateQueryFromGameUpdateEventBuilderMock = {
      build: jest.fn(),
    };
    gameActionPersistenceOutputPortMock = {
      create: jest.fn(),
    } as Partial<
      jest.Mocked<GameActionPersistenceOutputPort>
    > as jest.Mocked<GameActionPersistenceOutputPort>;
    gameEventsSubscriptionOutputPortMock = {
      publishV2: jest.fn(),
    } as Partial<
      jest.Mocked<GameEventsSubscriptionOutputPort>
    > as jest.Mocked<GameEventsSubscriptionOutputPort>;
    gamePersistenceOutputPortMock = {
      findOne: jest.fn(),
      update: jest.fn(),
    } as Partial<
      jest.Mocked<GamePersistenceOutputPort>
    > as jest.Mocked<GamePersistenceOutputPort>;
    gameTurnEndSignalMessageSendOutputPortMock = {
      send: jest.fn(),
    };
    uuidProviderOutputPortMock = {
      generateV4: jest.fn(),
    };

    gameUpdatedEventHandler = new GameUpdatedEventHandler(
      gameActionCreateQueryFromGameUpdateEventBuilderMock,
      gameActionPersistenceOutputPortMock,
      gameEventsSubscriptionOutputPortMock,
      gamePersistenceOutputPortMock,
      gameTurnEndSignalMessageSendOutputPortMock,
      uuidProviderOutputPortMock,
    );
  });

  describe('.handle', () => {
    describe('having a GameUpdatedEvent with kind turnPass', () => {
      let gameUpdatedEventFixture: ActiveGameUpdatedEvent;

      beforeAll(() => {
        gameUpdatedEventFixture =
          ActiveGameUpdatedEventFixtures.anyTurnPassEvent;
      });

      describe('when called, and gamePersistenceOutputPort.findOne() returns undefined', () => {
        let result: unknown;

        beforeAll(async () => {
          gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(
            undefined,
          );

          try {
            await gameUpdatedEventHandler.handle(gameUpdatedEventFixture);
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call gamePersistenceOutputPort.findOne()', () => {
          const expected: GameFindQuery = {
            id: gameUpdatedEventFixture.gameBeforeUpdate.id,
          };

          expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(
            1,
          );
          expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
            expected,
            gameUpdatedEventFixture.transactionWrapper,
          );
        });

        it('should throw an AppError', () => {
          const expectedErrorProperties: Partial<AppError> = {
            kind: AppErrorKind.unknown,
            message: `Game "${gameUpdatedEventFixture.gameBeforeUpdate.id}" not found`,
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedErrorProperties),
          );
        });
      });

      describe('when called, and gamePersistenceOutputPort.findOne() returns an ActiveGame', () => {
        let uuidFixture: string;
        let gameActionCreateQueryFixture: GameActionCreateQuery;
        let gameActionFixture: GameAction;
        let gameFixture: ActiveGame;

        let result: unknown;

        beforeAll(async () => {
          uuidFixture = 'uuid-fixture';
          gameActionCreateQueryFixture =
            GameActionCreateQueryFixtures.withKindPassTurn;
          gameActionFixture = GameActionFixtures.any;
          gameFixture = ActiveGameFixtures.any;

          uuidProviderOutputPortMock.generateV4.mockReturnValueOnce(
            uuidFixture,
          );
          gameActionCreateQueryFromGameUpdateEventBuilderMock.build.mockReturnValueOnce(
            gameActionCreateQueryFixture,
          );
          gameActionPersistenceOutputPortMock.create.mockResolvedValueOnce(
            gameActionFixture,
          );

          gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(
            gameFixture,
          );

          gameTurnEndSignalMessageSendOutputPortMock.send.mockResolvedValueOnce(
            undefined,
          );

          result = await gameUpdatedEventHandler.handle(
            gameUpdatedEventFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call gamePersistenceOutputPort.findOne()', () => {
          const expectedGameFindQuery: GameFindQuery = {
            id: gameUpdatedEventFixture.gameBeforeUpdate.id,
          };

          expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(
            1,
          );
          expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
            expectedGameFindQuery,
            gameUpdatedEventFixture.transactionWrapper,
          );
        });

        it('should call uuidProviderOutputPort.generateV4()', () => {
          expect(uuidProviderOutputPortMock.generateV4).toHaveBeenCalledTimes(
            1,
          );
          expect(uuidProviderOutputPortMock.generateV4).toHaveBeenCalledWith();
        });

        it('should call gameActionCreateQueryFromGameUpdateEventBuilder.build()', () => {
          const uuidContext: UuidContext = {
            uuid: uuidFixture,
          };

          expect(
            gameActionCreateQueryFromGameUpdateEventBuilderMock.build,
          ).toHaveBeenCalledTimes(1);
          expect(
            gameActionCreateQueryFromGameUpdateEventBuilderMock.build,
          ).toHaveBeenCalledWith(gameUpdatedEventFixture, uuidContext);
        });

        it('should call gameActionPersistenceOutputPort.create()', () => {
          expect(
            gameActionPersistenceOutputPortMock.create,
          ).toHaveBeenCalledTimes(1);
          expect(
            gameActionPersistenceOutputPortMock.create,
          ).toHaveBeenCalledWith(
            gameActionCreateQueryFixture,
            gameUpdatedEventFixture.transactionWrapper,
          );
        });

        it('should call gamePersistenceOutputPort.update()', () => {
          const expected: GameUpdateQuery = {
            gameFindQuery: {
              id: gameActionFixture.gameId,
            },
            lastGameActionId: gameActionFixture.id,
          };

          expect(gamePersistenceOutputPortMock.update).toHaveBeenCalledTimes(1);
          expect(gamePersistenceOutputPortMock.update).toHaveBeenCalledWith(
            expected,
            gameUpdatedEventFixture.transactionWrapper,
          );
        });

        it('should call gameEventsSubscriptionOutputPort.publishV2()', () => {
          const expected: GameUpdatedMessageEvent = {
            game: gameFixture,
            gameAction: gameActionFixture,
            kind: GameMessageEventKind.gameUpdated,
          };

          expect(
            gameEventsSubscriptionOutputPortMock.publishV2,
          ).toHaveBeenCalledTimes(1);
          expect(
            gameEventsSubscriptionOutputPortMock.publishV2,
          ).toHaveBeenCalledWith(
            gameUpdatedEventFixture.gameBeforeUpdate.id,
            expected,
          );
        });

        it('should call gameTurnEndSignalMessageSendOutputPort.send()', () => {
          const expected: MessageSendOptions<GameTurnEndSignalMessage> = {
            data: {
              gameId: gameFixture.id,
              turn: gameFixture.state.turn,
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
          ).toHaveBeenCalledWith(expected);
        });

        it('should resolve to undefined', () => {
          expect(result).toBeUndefined();
        });
      });
    });
  });
});
