import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { TransactionWrapper } from '@cornie-js/backend-db/application';
import {
  RefreshToken,
  RefreshTokenCreateQuery,
} from '@cornie-js/backend-user-domain/tokens';
import {
  RefreshTokenCreateQueryFixtures,
  RefreshTokenFixtures,
} from '@cornie-js/backend-user-domain/tokens/fixtures';

import { CreateRefreshTokenTypeOrmService } from '../services/CreateRefreshTokenTypeOrmService';
import { RefreshTokenPersistenceTypeormAdapter } from './RefreshTokenPersistenceTypeormAdapter';

describe(RefreshTokenPersistenceTypeormAdapter.name, () => {
  let createRefreshTokenTypeOrmServiceMock: jest.Mocked<CreateRefreshTokenTypeOrmService>;

  let refreshTokenPersistenceTypeormAdapter: RefreshTokenPersistenceTypeormAdapter;

  beforeAll(() => {
    createRefreshTokenTypeOrmServiceMock = {
      insertOne: jest.fn(),
    } as Partial<
      jest.Mocked<CreateRefreshTokenTypeOrmService>
    > as jest.Mocked<CreateRefreshTokenTypeOrmService>;

    refreshTokenPersistenceTypeormAdapter =
      new RefreshTokenPersistenceTypeormAdapter(
        createRefreshTokenTypeOrmServiceMock,
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
});
