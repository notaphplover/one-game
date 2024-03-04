import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { TransactionWrapper } from '@cornie-js/backend-db/application';
import { GameInitialSnapshotCreateQuery } from '@cornie-js/backend-game-domain/gameSnapshots';
import {
  GameInitialSnapshotCreateQueryFixtures,
  GameInitialSnapshotFixtures,
  GameInitialSnapshotSlotFixtures,
} from '@cornie-js/backend-game-domain/gameSnapshots/fixtures';

import { GameInitialSnapshotPersistenceOutputPort } from '../ports/output/GameInitialSnapshotPersistenceOutputPort';
import { GameInitialSnapshotSlotPersistenceOutputPort } from '../ports/output/GameInitialSnapshotSlotPersistenceOutputPort';
import { CreateGameInitialSnapshotUseCaseHandler } from './CreateGameInitialSnapshotUseCaseHandler';

describe(CreateGameInitialSnapshotUseCaseHandler.name, () => {
  let gameInitialSnapshotPersistenceOutputPortMock: jest.Mocked<GameInitialSnapshotPersistenceOutputPort>;
  let gameInitialSnapshotSlotPersistenceOutputPortMock: jest.Mocked<GameInitialSnapshotSlotPersistenceOutputPort>;

  let createGameInitialSnapshotUseCaseHandler: CreateGameInitialSnapshotUseCaseHandler;

  beforeAll(() => {
    gameInitialSnapshotPersistenceOutputPortMock = {
      create: jest.fn(),
    };
    gameInitialSnapshotSlotPersistenceOutputPortMock = {
      create: jest.fn(),
    };

    createGameInitialSnapshotUseCaseHandler =
      new CreateGameInitialSnapshotUseCaseHandler(
        gameInitialSnapshotPersistenceOutputPortMock,
        gameInitialSnapshotSlotPersistenceOutputPortMock,
      );
  });

  describe('.handle', () => {
    let gameInitialSnapshotCreateQueryFixture: GameInitialSnapshotCreateQuery;

    let transactionWrapperFixture: TransactionWrapper;

    beforeAll(() => {
      gameInitialSnapshotCreateQueryFixture =
        GameInitialSnapshotCreateQueryFixtures.any;

      transactionWrapperFixture = Symbol() as unknown as TransactionWrapper;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(async () => {
        gameInitialSnapshotPersistenceOutputPortMock.create.mockResolvedValueOnce(
          GameInitialSnapshotFixtures.any,
        );
        gameInitialSnapshotSlotPersistenceOutputPortMock.create.mockResolvedValueOnce(
          GameInitialSnapshotSlotFixtures.any,
        );

        result = await createGameInitialSnapshotUseCaseHandler.handle(
          gameInitialSnapshotCreateQueryFixture,
          transactionWrapperFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameInitialSnapshotPersistenceOutputPortMock.create()', () => {
        expect(
          gameInitialSnapshotPersistenceOutputPortMock.create,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameInitialSnapshotPersistenceOutputPortMock.create,
        ).toHaveBeenCalledWith(
          gameInitialSnapshotCreateQueryFixture,
          transactionWrapperFixture,
        );
      });

      it('should call gameInitialSnapshotSlotPersistenceOutputPortMock.create()', () => {
        expect(
          gameInitialSnapshotSlotPersistenceOutputPortMock.create,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameInitialSnapshotSlotPersistenceOutputPortMock.create,
        ).toHaveBeenCalledWith(
          gameInitialSnapshotCreateQueryFixture.gameSlotCreateQueries[0],
          transactionWrapperFixture,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
