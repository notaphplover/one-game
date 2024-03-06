import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { TransactionWrapper } from '@cornie-js/backend-db/application';
import { Game, GameFindQuery } from '@cornie-js/backend-game-domain/games';
import { ActiveGameFixtures } from '@cornie-js/backend-game-domain/games/fixtures';

import { GameMessageEventKind } from '../models/GameMessageEventKind';
import { GameUpdatedEvent } from '../models/GameUpdatedEvent';
import { GameUpdatedMessageEvent } from '../models/GameUpdatedMessageEvent';
import { GameEventsSubscriptionOutputPort } from '../ports/output/GameEventsSubscriptionOutputPort';
import { GamePersistenceOutputPort } from '../ports/output/GamePersistenceOutputPort';
import { GameUpdatedEventHandler } from './GameUpdatedEventHandler';

describe(GameUpdatedEventHandler.name, () => {
  let gameEventsSubscriptionOutputPortMock: jest.Mocked<GameEventsSubscriptionOutputPort>;
  let gamePersistenceOutputPortMock: jest.Mocked<GamePersistenceOutputPort>;

  let gameUpdatedEventHandler: GameUpdatedEventHandler;

  beforeAll(() => {
    gameEventsSubscriptionOutputPortMock = {
      publish: jest.fn(),
    } as Partial<
      jest.Mocked<GameEventsSubscriptionOutputPort>
    > as jest.Mocked<GameEventsSubscriptionOutputPort>;
    gamePersistenceOutputPortMock = {
      findOne: jest.fn(),
    } as Partial<
      jest.Mocked<GamePersistenceOutputPort>
    > as jest.Mocked<GamePersistenceOutputPort>;

    gameUpdatedEventHandler = new GameUpdatedEventHandler(
      gameEventsSubscriptionOutputPortMock,
      gamePersistenceOutputPortMock,
    );
  });

  describe('.handle', () => {
    let gameUpdatedEventFixture: GameUpdatedEvent;

    beforeAll(() => {
      gameUpdatedEventFixture = {
        gameBeforeUpdate: ActiveGameFixtures.any,
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
      let gameFixture: Game;

      let result: unknown;

      beforeAll(async () => {
        gameFixture = ActiveGameFixtures.any;
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

      it('should call gameEventsSubscriptionOutputPort.publish()', () => {
        const expected: GameUpdatedMessageEvent = {
          game: gameFixture,
          kind: GameMessageEventKind.gameUpdated,
        };

        expect(
          gameEventsSubscriptionOutputPortMock.publish,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameEventsSubscriptionOutputPortMock.publish,
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
