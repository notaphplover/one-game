import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { TransactionWrapper } from '@cornie-js/backend-db/application';
import {
  GameAction,
  GameActionCreateQuery,
} from '@cornie-js/backend-game-domain/gameActions';
import {
  GameActionCreateQueryFixtures,
  GameActionFixtures,
} from '@cornie-js/backend-game-domain/gameActions/fixtures';

import { CreateGameActionTypeOrmService } from '../services/CreateGameActionTypeOrmService';
import { GameActionPersistenceTypeOrmAdapter } from './GameActionPersistenceTypeOrmAdapter';

describe(GameActionPersistenceTypeOrmAdapter.name, () => {
  let createGameActionTypeOrmServiceMock: jest.Mocked<CreateGameActionTypeOrmService>;
  let gameActionPersistenceTypeOrmAdapter: GameActionPersistenceTypeOrmAdapter;

  beforeAll(() => {
    createGameActionTypeOrmServiceMock = {
      insertOne: jest.fn(),
    } as Partial<
      jest.Mocked<CreateGameActionTypeOrmService>
    > as jest.Mocked<CreateGameActionTypeOrmService>;

    gameActionPersistenceTypeOrmAdapter =
      new GameActionPersistenceTypeOrmAdapter(
        createGameActionTypeOrmServiceMock,
      );
  });

  describe('.create', () => {
    let gameActionCreateQueryFixture: GameActionCreateQuery;
    let transactionWrapperFixture: TransactionWrapper;

    beforeAll(() => {
      gameActionCreateQueryFixture =
        GameActionCreateQueryFixtures.withKindPassTurn;

      transactionWrapperFixture = Symbol() as unknown as TransactionWrapper;
    });

    describe('when called', () => {
      let gameActionFixture: GameAction;

      let result: unknown;

      beforeAll(async () => {
        gameActionFixture = GameActionFixtures.any;

        createGameActionTypeOrmServiceMock.insertOne.mockResolvedValueOnce(
          gameActionFixture,
        );

        result = await gameActionPersistenceTypeOrmAdapter.create(
          gameActionCreateQueryFixture,
          transactionWrapperFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call createGameActionTypeOrmService.insertOne()', () => {
        expect(
          createGameActionTypeOrmServiceMock.insertOne,
        ).toHaveBeenCalledTimes(1);
        expect(
          createGameActionTypeOrmServiceMock.insertOne,
        ).toHaveBeenCalledWith(
          gameActionCreateQueryFixture,
          transactionWrapperFixture,
        );
      });

      it('should return GameAction', () => {
        expect(result).toBe(gameActionFixture);
      });
    });
  });
});
