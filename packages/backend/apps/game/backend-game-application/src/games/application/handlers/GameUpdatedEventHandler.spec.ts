import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { UuidProviderOutputPort } from '@cornie-js/backend-app-uuid';
import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { TransactionWrapper } from '@cornie-js/backend-db/application';
import {
  GameAction,
  GameActionCreateQuery,
} from '@cornie-js/backend-game-domain/gameActions';
import {
  GameActionCreateQueryFixtures,
  GameActionFixtures,
} from '@cornie-js/backend-game-domain/gameActions/fixtures';
import { Game, GameFindQuery } from '@cornie-js/backend-game-domain/games';
import { ActiveGameFixtures } from '@cornie-js/backend-game-domain/games/fixtures';

import { UuidContext } from '../../../foundation/common/application/models/UuidContext';
import { GameActionPersistenceOutputPort } from '../../../gameActions/application/ports/output/GameActionPersistenceOutputPort';
import { ActiveGameUpdatedEvent } from '../models/ActiveGameUpdatedEvent';
import { ActiveGameUpdatedEventKind } from '../models/ActiveGameUpdatedEventKind';
import { GameMessageEventKind } from '../models/GameMessageEventKind';
import { GameUpdatedMessageEvent } from '../models/GameUpdatedMessageEvent';
import { GameEventsSubscriptionOutputPort } from '../ports/output/GameEventsSubscriptionOutputPort';
import { GamePersistenceOutputPort } from '../ports/output/GamePersistenceOutputPort';
import { GameUpdatedEventHandler } from './GameUpdatedEventHandler';

describe(GameUpdatedEventHandler.name, () => {
  let gameActionCreateQueryFromGameUpdateEventBuilderMock: jest.Mocked<
    Builder<GameActionCreateQuery, [ActiveGameUpdatedEvent, UuidContext]>
  >;
  let gameActionPersistenceOutputPortMock: jest.Mocked<GameActionPersistenceOutputPort>;
  let gameEventsSubscriptionOutputPortMock: jest.Mocked<GameEventsSubscriptionOutputPort>;
  let gamePersistenceOutputPortMock: jest.Mocked<GamePersistenceOutputPort>;
  let uuidProviderOutputPortMock: jest.Mocked<UuidProviderOutputPort>;

  let gameUpdatedEventHandler: GameUpdatedEventHandler;

  beforeAll(() => {
    gameActionCreateQueryFromGameUpdateEventBuilderMock = {
      build: jest.fn(),
    };
    gameActionPersistenceOutputPortMock = {
      create: jest.fn(),
    };
    gameEventsSubscriptionOutputPortMock = {
      publishV1: jest.fn(),
    } as Partial<
      jest.Mocked<GameEventsSubscriptionOutputPort>
    > as jest.Mocked<GameEventsSubscriptionOutputPort>;
    gamePersistenceOutputPortMock = {
      findOne: jest.fn(),
    } as Partial<
      jest.Mocked<GamePersistenceOutputPort>
    > as jest.Mocked<GamePersistenceOutputPort>;
    uuidProviderOutputPortMock = {
      generateV4: jest.fn(),
    };

    gameUpdatedEventHandler = new GameUpdatedEventHandler(
      gameActionCreateQueryFromGameUpdateEventBuilderMock,
      gameActionPersistenceOutputPortMock,
      gameEventsSubscriptionOutputPortMock,
      gamePersistenceOutputPortMock,
      uuidProviderOutputPortMock,
    );
  });

  describe('.handle', () => {
    let gameUpdatedEventFixture: ActiveGameUpdatedEvent;

    beforeAll(() => {
      gameUpdatedEventFixture = {
        gameBeforeUpdate: ActiveGameFixtures.any,
        kind: ActiveGameUpdatedEventKind.turnPass,
        transactionWrapper: Symbol() as unknown as TransactionWrapper,
      };
    });

    describe('when called, and gamePersistenceOutputPort.findOne() returns undefined', () => {
      let result: unknown;

      beforeAll(async () => {
        gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(undefined);

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

        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(1);
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

    describe('when called, and gamePersistenceOutputPort.findOne() returns a Game', () => {
      let uuidFixture: string;
      let gameActionCreateQueryFixture: GameActionCreateQuery;
      let gameActionFixture: GameAction;
      let gameFixture: Game;

      let result: unknown;

      beforeAll(async () => {
        uuidFixture = 'uuid-fixture';
        gameActionCreateQueryFixture =
          GameActionCreateQueryFixtures.withKindPassTurn;
        gameActionFixture = GameActionFixtures.any;
        gameFixture = ActiveGameFixtures.any;

        uuidProviderOutputPortMock.generateV4.mockReturnValueOnce(uuidFixture);
        gameActionCreateQueryFromGameUpdateEventBuilderMock.build.mockReturnValueOnce(
          gameActionCreateQueryFixture,
        );
        gameActionPersistenceOutputPortMock.create.mockResolvedValueOnce(
          gameActionFixture,
        );

        gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          gameFixture,
        );

        result = await gameUpdatedEventHandler.handle(gameUpdatedEventFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gamePersistenceOutputPort.findOne()', () => {
        const expectedGameFindQuery: GameFindQuery = {
          id: gameUpdatedEventFixture.gameBeforeUpdate.id,
        };

        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(1);
        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          expectedGameFindQuery,
          gameUpdatedEventFixture.transactionWrapper,
        );
      });

      it('should call uuidProviderOutputPort.generateV4()', () => {
        expect(uuidProviderOutputPortMock.generateV4).toHaveBeenCalledTimes(1);
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
        expect(gameActionPersistenceOutputPortMock.create).toHaveBeenCalledWith(
          gameActionCreateQueryFixture,
          gameUpdatedEventFixture.transactionWrapper,
        );
      });

      it('should call gameEventsSubscriptionOutputPort.publish()', () => {
        const expected: GameUpdatedMessageEvent = {
          game: gameFixture,
          gameAction: gameActionFixture,
          kind: GameMessageEventKind.gameUpdated,
        };

        expect(
          gameEventsSubscriptionOutputPortMock.publishV1,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameEventsSubscriptionOutputPortMock.publishV1,
        ).toHaveBeenCalledWith(
          gameUpdatedEventFixture.gameBeforeUpdate.id,
          expected,
        );
      });

      it('should resolve to undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
