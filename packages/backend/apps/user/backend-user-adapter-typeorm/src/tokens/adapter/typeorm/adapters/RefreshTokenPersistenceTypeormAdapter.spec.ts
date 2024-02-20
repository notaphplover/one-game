import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { TransactionWrapper } from '@cornie-js/backend-db/application';
import {
  RefreshToken,
  RefreshTokenCreateQuery,
  RefreshTokenFindQuery,
} from '@cornie-js/backend-user-domain/tokens';
import {
  RefreshTokenCreateQueryFixtures,
  RefreshTokenFindQueryFixtures,
  RefreshTokenFixtures,
} from '@cornie-js/backend-user-domain/tokens/fixtures';

import { CreateRefreshTokenTypeOrmService } from '../services/CreateRefreshTokenTypeOrmService';
import { FindRefreshTokenTypeOrmService } from '../services/FindRefreshTokenTypeOrmService';
import { RefreshTokenPersistenceTypeormAdapter } from './RefreshTokenPersistenceTypeormAdapter';

describe(RefreshTokenPersistenceTypeormAdapter.name, () => {
  let createRefreshTokenTypeOrmServiceMock: jest.Mocked<CreateRefreshTokenTypeOrmService>;
  let findRefreshTokenTypeOrmServiceMock: jest.Mocked<FindRefreshTokenTypeOrmService>;

  let refreshTokenPersistenceTypeormAdapter: RefreshTokenPersistenceTypeormAdapter;

  beforeAll(() => {
    createRefreshTokenTypeOrmServiceMock = {
      insertOne: jest.fn(),
    } as Partial<
      jest.Mocked<CreateRefreshTokenTypeOrmService>
    > as jest.Mocked<CreateRefreshTokenTypeOrmService>;

    findRefreshTokenTypeOrmServiceMock = {
      find: jest.fn(),
      findOne: jest.fn(),
    } as Partial<
      jest.Mocked<FindRefreshTokenTypeOrmService>
    > as jest.Mocked<FindRefreshTokenTypeOrmService>;

    refreshTokenPersistenceTypeormAdapter =
      new RefreshTokenPersistenceTypeormAdapter(
        createRefreshTokenTypeOrmServiceMock,
        findRefreshTokenTypeOrmServiceMock,
      );
  });

  describe('.create', () => {
    let refreshTokenCreateQueryFixture: RefreshTokenCreateQuery;
    let transactionWrapperFixture: TransactionWrapper;

    beforeAll(() => {
      refreshTokenCreateQueryFixture = RefreshTokenCreateQueryFixtures.any;

      transactionWrapperFixture = Symbol() as unknown as TransactionWrapper;
    });

    describe('when called', () => {
      let refreshTokenFixture: RefreshToken;

      let result: unknown;

      beforeAll(async () => {
        refreshTokenFixture = RefreshTokenFixtures.any;

        createRefreshTokenTypeOrmServiceMock.insertOne.mockResolvedValueOnce(
          refreshTokenFixture,
        );

        result = await refreshTokenPersistenceTypeormAdapter.create(
          refreshTokenCreateQueryFixture,
          transactionWrapperFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call createRefreshTokenTypeOrmService.insertOne()', () => {
        expect(
          createRefreshTokenTypeOrmServiceMock.insertOne,
        ).toHaveBeenCalledTimes(1);
        expect(
          createRefreshTokenTypeOrmServiceMock.insertOne,
        ).toHaveBeenCalledWith(
          refreshTokenCreateQueryFixture,
          transactionWrapperFixture,
        );
      });

      it('should return RefreshToken', () => {
        expect(result).toBe(refreshTokenFixture);
      });
    });
  });

  describe('.find', () => {
    let refreshTokenFindQueryFixture: RefreshTokenFindQuery;
    let transactionWrapperFixture: TransactionWrapper;

    beforeAll(() => {
      refreshTokenFindQueryFixture = RefreshTokenFindQueryFixtures.any;

      transactionWrapperFixture = Symbol() as unknown as TransactionWrapper;
    });

    describe('when called', () => {
      let refreshTokenFixtures: RefreshToken[];

      let result: unknown;

      beforeAll(async () => {
        refreshTokenFixtures = [RefreshTokenFixtures.any];

        findRefreshTokenTypeOrmServiceMock.find.mockResolvedValueOnce(
          refreshTokenFixtures,
        );

        result = await refreshTokenPersistenceTypeormAdapter.find(
          refreshTokenFindQueryFixture,
          transactionWrapperFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call findRefreshTokenTypeOrmService.find()', () => {
        expect(findRefreshTokenTypeOrmServiceMock.find).toHaveBeenCalledTimes(
          1,
        );
        expect(findRefreshTokenTypeOrmServiceMock.find).toHaveBeenCalledWith(
          refreshTokenFindQueryFixture,
          transactionWrapperFixture,
        );
      });

      it('should return RefreshToken', () => {
        expect(result).toBe(refreshTokenFixtures);
      });
    });
  });

  describe('.findOne', () => {
    let refreshTokenFindQueryFixture: RefreshTokenFindQuery;
    let transactionWrapperFixture: TransactionWrapper;

    beforeAll(() => {
      refreshTokenFindQueryFixture = RefreshTokenFindQueryFixtures.any;

      transactionWrapperFixture = Symbol() as unknown as TransactionWrapper;
    });

    describe('when called', () => {
      let refreshTokenFixture: RefreshToken;

      let result: unknown;

      beforeAll(async () => {
        refreshTokenFixture = RefreshTokenFixtures.any;

        findRefreshTokenTypeOrmServiceMock.findOne.mockResolvedValueOnce(
          refreshTokenFixture,
        );

        result = await refreshTokenPersistenceTypeormAdapter.findOne(
          refreshTokenFindQueryFixture,
          transactionWrapperFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call findRefreshTokenTypeOrmService.findOne()', () => {
        expect(
          findRefreshTokenTypeOrmServiceMock.findOne,
        ).toHaveBeenCalledTimes(1);
        expect(findRefreshTokenTypeOrmServiceMock.findOne).toHaveBeenCalledWith(
          refreshTokenFindQueryFixture,
          transactionWrapperFixture,
        );
      });

      it('should return RefreshToken', () => {
        expect(result).toBe(refreshTokenFixture);
      });
    });
  });
});
