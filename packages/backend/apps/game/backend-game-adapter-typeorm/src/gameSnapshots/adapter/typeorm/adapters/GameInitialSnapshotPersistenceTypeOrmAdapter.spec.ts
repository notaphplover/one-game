import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import {
  GameInitialSnapshotSlot,
  GameInitialSnapshotSlotCreateQuery,
} from '@cornie-js/backend-game-domain/gameSnapshots';
import {
  GameInitialSnapshotSlotCreateQueryFixtures,
  GameInitialSnapshotSlotFixtures,
} from '@cornie-js/backend-game-domain/gameSnapshots/fixtures';

import { CreateGameInitialSnapshotSlotTypeOrmService } from '../services/CreateGameInitialSnapshotSlotTypeOrmService';
import { GameInitialSnapshotPersistenceTypeOrmAdapter } from './GameInitialSnapshotPersistenceTypeOrmAdapter';

describe(GameInitialSnapshotPersistenceTypeOrmAdapter.name, () => {
  let createGameInitialSnapshotSlotTypeOrmServiceMock: jest.Mocked<CreateGameInitialSnapshotSlotTypeOrmService>;

  let gameInitialSnapshotPersistenceTypeOrmAdapter: GameInitialSnapshotPersistenceTypeOrmAdapter;

  beforeAll(() => {
    createGameInitialSnapshotSlotTypeOrmServiceMock = {
      insertOne: jest.fn(),
    } as Partial<
      jest.Mocked<CreateGameInitialSnapshotSlotTypeOrmService>
    > as jest.Mocked<CreateGameInitialSnapshotSlotTypeOrmService>;

    gameInitialSnapshotPersistenceTypeOrmAdapter =
      new GameInitialSnapshotPersistenceTypeOrmAdapter(
        createGameInitialSnapshotSlotTypeOrmServiceMock,
      );
  });

  describe('.build', () => {
    let gameInitialSnapshotSlotCreateQueryFixture: GameInitialSnapshotSlotCreateQuery;

    beforeAll(() => {
      gameInitialSnapshotSlotCreateQueryFixture =
        GameInitialSnapshotSlotCreateQueryFixtures.any;
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
        ).toHaveBeenCalledWith(gameInitialSnapshotSlotCreateQueryFixture);
      });

      it('should return GameInitialSnapshotSlot', () => {
        expect(result).toBe(gameInitialSnapshotSlotFixture);
      });
    });
  });
});
