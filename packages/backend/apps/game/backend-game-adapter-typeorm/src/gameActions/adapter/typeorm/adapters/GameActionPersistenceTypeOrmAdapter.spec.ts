import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { TransactionWrapper } from '@cornie-js/backend-db/application';
import {
  GameAction,
  GameActionCreateQuery,
  GameActionFindQuery,
} from '@cornie-js/backend-game-domain/gameActions';
import {
  GameActionCreateQueryFixtures,
  GameActionFindQueryFixtures,
  GameActionFixtures,
} from '@cornie-js/backend-game-domain/gameActions/fixtures';

import { CreateGameActionTypeOrmService } from '../services/CreateGameActionTypeOrmService';
import { FindGameActionTypeOrmService } from '../services/FindGameActionTypeOrmService';
import { GameActionPersistenceTypeOrmAdapter } from './GameActionPersistenceTypeOrmAdapter';

describe(GameActionPersistenceTypeOrmAdapter.name, () => {
  let createGameActionTypeOrmServiceMock: jest.Mocked<CreateGameActionTypeOrmService>;
  let findGameActionTypeOrmServiceMock: jest.Mocked<FindGameActionTypeOrmService>;

  let gameActionPersistenceTypeOrmAdapter: GameActionPersistenceTypeOrmAdapter;

  beforeAll(() => {
    createGameActionTypeOrmServiceMock = {
      insertOne: jest.fn(),
    } as Partial<
      jest.Mocked<CreateGameActionTypeOrmService>
    > as jest.Mocked<CreateGameActionTypeOrmService>;

    findGameActionTypeOrmServiceMock = {
      find: jest.fn(),
      findOne: jest.fn(),
    } as Partial<
      jest.Mocked<FindGameActionTypeOrmService>
    > as jest.Mocked<FindGameActionTypeOrmService>;

    gameActionPersistenceTypeOrmAdapter =
      new GameActionPersistenceTypeOrmAdapter(
        createGameActionTypeOrmServiceMock,
        findGameActionTypeOrmServiceMock,
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

  describe('.find', () => {
    let gameActionFindQueryFixture: GameActionFindQuery;
    let transactionWrapperFixture: TransactionWrapper;

    beforeAll(() => {
      gameActionFindQueryFixture = GameActionFindQueryFixtures.any;

      transactionWrapperFixture = Symbol() as unknown as TransactionWrapper;
    });

    describe('when called', () => {
      let gameActionFixture: GameAction;

      let result: unknown;

      beforeAll(async () => {
        gameActionFixture = GameActionFixtures.any;

        findGameActionTypeOrmServiceMock.find.mockResolvedValueOnce([
          gameActionFixture,
        ]);

        result = await gameActionPersistenceTypeOrmAdapter.find(
          gameActionFindQueryFixture,
          transactionWrapperFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call findGameActionTypeOrmService.find()', () => {
        expect(findGameActionTypeOrmServiceMock.find).toHaveBeenCalledTimes(1);
        expect(findGameActionTypeOrmServiceMock.find).toHaveBeenCalledWith(
          gameActionFindQueryFixture,
          transactionWrapperFixture,
        );
      });

      it('should return GameAction[]', () => {
        expect(result).toStrictEqual([gameActionFixture]);
      });
    });
  });

  describe('.findOne', () => {
    let gameActionFindQueryFixture: GameActionFindQuery;
    let transactionWrapperFixture: TransactionWrapper;

    beforeAll(() => {
      gameActionFindQueryFixture = GameActionFindQueryFixtures.any;

      transactionWrapperFixture = Symbol() as unknown as TransactionWrapper;
    });

    describe('when called', () => {
      let gameActionFixture: GameAction;

      let result: unknown;

      beforeAll(async () => {
        gameActionFixture = GameActionFixtures.any;

        findGameActionTypeOrmServiceMock.findOne.mockResolvedValueOnce(
          gameActionFixture,
        );

        result = await gameActionPersistenceTypeOrmAdapter.findOne(
          gameActionFindQueryFixture,
          transactionWrapperFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call findGameActionTypeOrmService.findOne()', () => {
        expect(findGameActionTypeOrmServiceMock.findOne).toHaveBeenCalledTimes(
          1,
        );
        expect(findGameActionTypeOrmServiceMock.findOne).toHaveBeenCalledWith(
          gameActionFindQueryFixture,
          transactionWrapperFixture,
        );
      });

      it('should return GameAction', () => {
        expect(result).toBe(gameActionFixture);
      });
    });
  });
});
