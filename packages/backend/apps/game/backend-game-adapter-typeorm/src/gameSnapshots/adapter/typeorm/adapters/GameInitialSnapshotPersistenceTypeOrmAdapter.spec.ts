import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { TransactionWrapper } from '@cornie-js/backend-db/application';
import {
  GameInitialSnapshot,
  GameInitialSnapshotCreateQuery,
} from '@cornie-js/backend-game-domain/gameSnapshots';
import {
  GameInitialSnapshotCreateQueryFixtures,
  GameInitialSnapshotFixtures,
} from '@cornie-js/backend-game-domain/gameSnapshots/fixtures';

import { CreateGameInitialSnapshotTypeOrmService } from '../services/CreateGameInitialSnapshotTypeOrmService';
import { GameInitialSnapshotPersistenceTypeOrmAdapter } from './GameInitialSnapshotPersistenceTypeOrmAdapter';

describe(GameInitialSnapshotPersistenceTypeOrmAdapter.name, () => {
  let createGameInitialSnapshotTypeOrmServiceMock: jest.Mocked<CreateGameInitialSnapshotTypeOrmService>;

  let gameInitialSnapshotPersistenceTypeOrmAdapter: GameInitialSnapshotPersistenceTypeOrmAdapter;

  beforeAll(() => {
    createGameInitialSnapshotTypeOrmServiceMock = {
      insertOne: jest.fn(),
    } as Partial<
      jest.Mocked<CreateGameInitialSnapshotTypeOrmService>
    > as jest.Mocked<CreateGameInitialSnapshotTypeOrmService>;

    gameInitialSnapshotPersistenceTypeOrmAdapter =
      new GameInitialSnapshotPersistenceTypeOrmAdapter(
        createGameInitialSnapshotTypeOrmServiceMock,
      );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('.create', () => {
    let gameInitialSnapshotCreateQueryFixture: GameInitialSnapshotCreateQuery;
    let transactionWrapperFixture: TransactionWrapper;

    beforeAll(() => {
      gameInitialSnapshotCreateQueryFixture =
        GameInitialSnapshotCreateQueryFixtures.any;
      transactionWrapperFixture = Symbol() as unknown as TransactionWrapper;
    });

    describe('when called', () => {
      let gameInitialSnapshotFixture: GameInitialSnapshot;

      let result: unknown;

      beforeAll(async () => {
        gameInitialSnapshotFixture = GameInitialSnapshotFixtures.any;

        createGameInitialSnapshotTypeOrmServiceMock.insertOne.mockResolvedValueOnce(
          gameInitialSnapshotFixture,
        );

        result = await gameInitialSnapshotPersistenceTypeOrmAdapter.create(
          gameInitialSnapshotCreateQueryFixture,
          transactionWrapperFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameInitialSnapshotPersistenceTypeOrmAdapter.create()', () => {
        expect(
          createGameInitialSnapshotTypeOrmServiceMock.insertOne,
        ).toHaveBeenCalledTimes(1);
        expect(
          createGameInitialSnapshotTypeOrmServiceMock.insertOne,
        ).toHaveBeenCalledWith(
          gameInitialSnapshotCreateQueryFixture,
          transactionWrapperFixture,
        );
      });

      it('should return GameInitialSnapshot', () => {
        expect(result).toBe(gameInitialSnapshotFixture);
      });
    });
  });
});
