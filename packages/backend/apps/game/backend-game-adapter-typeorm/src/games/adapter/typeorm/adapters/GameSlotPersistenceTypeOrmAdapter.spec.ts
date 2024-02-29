import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { TransactionWrapper } from '@cornie-js/backend-db/application';
import {
  ActiveGameSlot,
  GameSlotCreateQuery,
  GameSlotUpdateQuery,
  NonStartedGameSlot,
} from '@cornie-js/backend-game-domain/games';
import {
  ActiveGameSlotFixtures,
  GameSlotCreateQueryFixtures,
  GameSlotUpdateQueryFixtures,
} from '@cornie-js/backend-game-domain/games/fixtures';

import { CreateGameSlotTypeOrmService } from '../services/CreateGameSlotTypeOrmService';
import { UpdateGameSlotTypeOrmService } from '../services/UpdateGameSlotTypeOrmService';
import { GameSlotPersistenceTypeOrmAdapter } from './GameSlotPersistenceTypeOrmAdapter';

describe(GameSlotPersistenceTypeOrmAdapter.name, () => {
  let createGameSlotTypeOrmServiceMock: jest.Mocked<CreateGameSlotTypeOrmService>;
  let updateGameSlotTypeOrmServiceMock: jest.Mocked<UpdateGameSlotTypeOrmService>;

  let gameSlotPersistenceTypeOrmAdapter: GameSlotPersistenceTypeOrmAdapter;

  beforeAll(() => {
    createGameSlotTypeOrmServiceMock = {
      insertOne: jest.fn(),
    } as Partial<
      jest.Mocked<CreateGameSlotTypeOrmService>
    > as jest.Mocked<CreateGameSlotTypeOrmService>;

    updateGameSlotTypeOrmServiceMock = {
      update: jest.fn(),
    } as Partial<
      jest.Mocked<UpdateGameSlotTypeOrmService>
    > as jest.Mocked<UpdateGameSlotTypeOrmService>;

    gameSlotPersistenceTypeOrmAdapter = new GameSlotPersistenceTypeOrmAdapter(
      createGameSlotTypeOrmServiceMock,
      updateGameSlotTypeOrmServiceMock,
    );
  });

  describe('.create', () => {
    let gameSlotCreateQueryFixture: GameSlotCreateQuery;
    let transactionWrapperFixture: TransactionWrapper;

    beforeAll(() => {
      gameSlotCreateQueryFixture = GameSlotCreateQueryFixtures.any;
      transactionWrapperFixture = Symbol() as unknown as TransactionWrapper;
    });

    describe('when called', () => {
      let gameSlotFixture: NonStartedGameSlot | ActiveGameSlot;

      let result: unknown;

      beforeAll(async () => {
        gameSlotFixture = ActiveGameSlotFixtures.any;

        createGameSlotTypeOrmServiceMock.insertOne.mockResolvedValueOnce(
          gameSlotFixture,
        );

        result = await gameSlotPersistenceTypeOrmAdapter.create(
          gameSlotCreateQueryFixture,
          transactionWrapperFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call createGameSlotTypeOrmService.insertOne()', () => {
        expect(
          createGameSlotTypeOrmServiceMock.insertOne,
        ).toHaveBeenCalledTimes(1);
        expect(createGameSlotTypeOrmServiceMock.insertOne).toHaveBeenCalledWith(
          gameSlotCreateQueryFixture,
          transactionWrapperFixture,
        );
      });

      it('should return GameSlot', () => {
        expect(result).toBe(gameSlotFixture);
      });
    });
  });

  describe('.update', () => {
    let gameSlotUpdateQueryFixture: GameSlotUpdateQuery;
    let transactionWrapperFixture: TransactionWrapper;

    beforeAll(() => {
      gameSlotUpdateQueryFixture = GameSlotUpdateQueryFixtures.any;
      transactionWrapperFixture = Symbol() as unknown as TransactionWrapper;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(async () => {
        updateGameSlotTypeOrmServiceMock.update.mockResolvedValueOnce();

        result = await gameSlotPersistenceTypeOrmAdapter.update(
          gameSlotUpdateQueryFixture,
          transactionWrapperFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call updateGameSlotTypeOrmService.update()', () => {
        expect(updateGameSlotTypeOrmServiceMock.update).toHaveBeenCalledTimes(
          1,
        );
        expect(updateGameSlotTypeOrmServiceMock.update).toHaveBeenCalledWith(
          gameSlotUpdateQueryFixture,
          transactionWrapperFixture,
        );
      });

      it('should return GameSlot', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
