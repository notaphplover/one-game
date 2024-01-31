import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { TransactionContext } from '@cornie-js/backend-db/application';
import {
  GameSpec,
  GameSpecCreateQuery,
  GameSpecFindQuery,
} from '@cornie-js/backend-game-domain/games';
import {
  GameSpecCreateQueryFixtures,
  GameSpecFindQueryFixtures,
  GameSpecFixtures,
} from '@cornie-js/backend-game-domain/games/fixtures';

import { CreateGameSpecTypeOrmService } from '../services/CreateGameSpecTypeOrmService';
import { FindGameSpecTypeOrmService } from '../services/FindGameSpecTypeOrmService';
import { GameSpecPersistenceTypeOrmAdapter } from './GameSpecPersistenceTypeOrmAdapter';

describe(GameSpecPersistenceTypeOrmAdapter.name, () => {
  let createGameSpecTypeOrmServiceMock: jest.Mocked<CreateGameSpecTypeOrmService>;
  let findGameSpecTypeOrmServiceMock: jest.Mocked<FindGameSpecTypeOrmService>;

  let gameSpecPersistenceTypeOrmAdapter: GameSpecPersistenceTypeOrmAdapter;

  beforeAll(() => {
    createGameSpecTypeOrmServiceMock = {
      insertOne: jest.fn(),
    } as Partial<
      jest.Mocked<CreateGameSpecTypeOrmService>
    > as jest.Mocked<CreateGameSpecTypeOrmService>;

    findGameSpecTypeOrmServiceMock = {
      find: jest.fn(),
      findOne: jest.fn(),
    } as Partial<
      jest.Mocked<FindGameSpecTypeOrmService>
    > as jest.Mocked<FindGameSpecTypeOrmService>;

    gameSpecPersistenceTypeOrmAdapter = new GameSpecPersistenceTypeOrmAdapter(
      createGameSpecTypeOrmServiceMock,
      findGameSpecTypeOrmServiceMock,
    );
  });

  describe('.create', () => {
    let gameSpecCreateQueryFixture: GameSpecCreateQuery;
    let transactionContextFixture: TransactionContext;

    beforeAll(() => {
      gameSpecCreateQueryFixture = GameSpecCreateQueryFixtures.any;
      transactionContextFixture = Symbol() as unknown as TransactionContext;
    });

    describe('when called', () => {
      let gameSpecFixture: GameSpec;

      let result: unknown;

      beforeAll(async () => {
        gameSpecFixture = GameSpecFixtures.any;

        createGameSpecTypeOrmServiceMock.insertOne.mockResolvedValueOnce(
          gameSpecFixture,
        );

        result = await gameSpecPersistenceTypeOrmAdapter.create(
          gameSpecCreateQueryFixture,
          transactionContextFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call createGameSpecTypeOrmService.insertOne()', () => {
        expect(
          createGameSpecTypeOrmServiceMock.insertOne,
        ).toHaveBeenCalledTimes(1);
        expect(createGameSpecTypeOrmServiceMock.insertOne).toHaveBeenCalledWith(
          gameSpecCreateQueryFixture,
          transactionContextFixture,
        );
      });

      it('should return GameSpec', () => {
        expect(result).toBe(gameSpecFixture);
      });
    });
  });

  describe('.find', () => {
    let gameSpecFindQueryFixture: GameSpecFindQuery;

    beforeAll(() => {
      gameSpecFindQueryFixture = GameSpecFindQueryFixtures.any;
    });

    describe('when called', () => {
      let gameSpecFixtures: GameSpec[];

      let result: unknown;

      beforeAll(async () => {
        gameSpecFixtures = [GameSpecFixtures.any];

        findGameSpecTypeOrmServiceMock.find.mockResolvedValueOnce(
          gameSpecFixtures,
        );

        result = await gameSpecPersistenceTypeOrmAdapter.find(
          gameSpecFindQueryFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call findGameSpecTypeOrmService.find()', () => {
        expect(findGameSpecTypeOrmServiceMock.find).toHaveBeenCalledTimes(1);
        expect(findGameSpecTypeOrmServiceMock.find).toHaveBeenCalledWith(
          gameSpecFindQueryFixture,
        );
      });

      it('should return GameSpec', () => {
        expect(result).toBe(gameSpecFixtures);
      });
    });
  });

  describe('.findOne', () => {
    let gameSpecFindQueryFixture: GameSpecFindQuery;

    beforeAll(() => {
      gameSpecFindQueryFixture = GameSpecFindQueryFixtures.any;
    });

    describe('when called', () => {
      let gameSpecFixture: GameSpec;

      let result: unknown;

      beforeAll(async () => {
        gameSpecFixture = GameSpecFixtures.any;

        findGameSpecTypeOrmServiceMock.findOne.mockResolvedValueOnce(
          gameSpecFixture,
        );

        result = await gameSpecPersistenceTypeOrmAdapter.findOne(
          gameSpecFindQueryFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call findGameSpecTypeOrmService.findOne()', () => {
        expect(findGameSpecTypeOrmServiceMock.findOne).toHaveBeenCalledTimes(1);
        expect(findGameSpecTypeOrmServiceMock.findOne).toHaveBeenCalledWith(
          gameSpecFindQueryFixture,
        );
      });

      it('should return GameSpec', () => {
        expect(result).toBe(gameSpecFixture);
      });
    });
  });
});
