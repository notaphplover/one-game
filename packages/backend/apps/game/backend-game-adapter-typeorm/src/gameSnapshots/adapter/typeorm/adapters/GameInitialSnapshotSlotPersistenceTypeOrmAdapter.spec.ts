import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { TransactionWrapper } from '@cornie-js/backend-db/application';
import {
  GameInitialSnapshotSlot,
  GameInitialSnapshotSlotCreateQuery,
} from '@cornie-js/backend-game-domain/gameSnapshots';
import {
  GameInitialSnapshotSlotCreateQueryFixtures,
  GameInitialSnapshotSlotFixtures,
} from '@cornie-js/backend-game-domain/gameSnapshots/fixtures';

import { CreateGameInitialSnapshotSlotTypeOrmService } from '../services/CreateGameInitialSnapshotSlotTypeOrmService';
import { GameInitialSnapshotSlotPersistenceTypeOrmAdapter } from './GameInitialSnapshotSlotPersistenceTypeOrmAdapter';

describe(GameInitialSnapshotSlotPersistenceTypeOrmAdapter.name, () => {
  let createGameInitialSnapshotSlotTypeOrmServiceMock: jest.Mocked<CreateGameInitialSnapshotSlotTypeOrmService>;

  let gameInitialSnapshotPersistenceTypeOrmAdapter: GameInitialSnapshotSlotPersistenceTypeOrmAdapter;

  beforeAll(() => {
    createGameInitialSnapshotSlotTypeOrmServiceMock = {
      insertOne: jest.fn(),
    } as Partial<
      jest.Mocked<CreateGameInitialSnapshotSlotTypeOrmService>
    > as jest.Mocked<CreateGameInitialSnapshotSlotTypeOrmService>;

    gameInitialSnapshotPersistenceTypeOrmAdapter =
      new GameInitialSnapshotSlotPersistenceTypeOrmAdapter(
        createGameInitialSnapshotSlotTypeOrmServiceMock,
      );
  });

  describe('.build', () => {
    let gameInitialSnapshotSlotCreateQueryFixture: GameInitialSnapshotSlotCreateQuery;
    let transactionWrapperFixture: TransactionWrapper;

    beforeAll(() => {
      gameInitialSnapshotSlotCreateQueryFixture =
        GameInitialSnapshotSlotCreateQueryFixtures.any;
      transactionWrapperFixture = Symbol() as unknown as TransactionWrapper;
    });

    describe('when called', () => {
      let gameInitialSnapshotSlotFixture: GameInitialSnapshotSlot;

      let result: unknown;

      beforeAll(async () => {
        gameInitialSnapshotSlotFixture = GameInitialSnapshotSlotFixtures.any;

        createGameInitialSnapshotSlotTypeOrmServiceMock.insertOne.mockResolvedValueOnce(
          gameInitialSnapshotSlotFixture,
        );

        result = await gameInitialSnapshotPersistenceTypeOrmAdapter.create(
          gameInitialSnapshotSlotCreateQueryFixture,
          transactionWrapperFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call createGameInitialSnapshotSlotTypeOrmService.insertOne()', () => {
        expect(
          createGameInitialSnapshotSlotTypeOrmServiceMock.insertOne,
        ).toHaveBeenCalledTimes(1);
        expect(
          createGameInitialSnapshotSlotTypeOrmServiceMock.insertOne,
        ).toHaveBeenCalledWith(
          gameInitialSnapshotSlotCreateQueryFixture,
          transactionWrapperFixture,
        );
      });

      it('should return GameInitialSnapshotSlot', () => {
        expect(result).toBe(gameInitialSnapshotSlotFixture);
      });
    });
  });
});
