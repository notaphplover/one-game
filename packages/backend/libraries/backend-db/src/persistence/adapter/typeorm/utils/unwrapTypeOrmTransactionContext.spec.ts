import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../models/TypeOrmTransactionContext');

import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { QueryRunner } from 'typeorm';

import { TransactionContext } from '../../../application/models/TransactionContext';
import { TypeOrmTransactionContext } from '../models/TypeOrmTransactionContext';
import { unwrapTypeOrmTransactionContext } from './unwrapTypeOrmTransactionContext';

describe(unwrapTypeOrmTransactionContext.name, () => {
  describe('having an undefined TransactionContext', () => {
    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = unwrapTypeOrmTransactionContext(undefined);
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('having a non undefined TransactionContext', () => {
    let transactionContextMock: jest.Mocked<TransactionContext>;

    beforeAll(() => {
      transactionContextMock = {
        unwrap: jest.fn(),
      } as Partial<
        jest.Mocked<TransactionContext>
      > as jest.Mocked<TransactionContext>;
    });

    describe('when called, and TypeOrmTransactionContext.is() returns false', () => {
      let result: unknown;

      beforeAll(() => {
        (
          TypeOrmTransactionContext.is as unknown as jest.Mock<
            typeof TypeOrmTransactionContext.is
          >
        ).mockReturnValueOnce(false);

        try {
          unwrapTypeOrmTransactionContext(transactionContextMock);
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should throw an AppError', () => {
        const expectedProperties: Partial<AppError> = {
          kind: AppErrorKind.unknown,
          message: 'Unexpected transaction context',
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedProperties),
        );
      });
    });

    describe('when called, and TypeOrmTransactionContext.is() returns true', () => {
      let queryRunnerFixture: QueryRunner;
      let result: unknown;

      beforeAll(() => {
        queryRunnerFixture = Symbol() as unknown as QueryRunner;

        (
          TypeOrmTransactionContext.is as unknown as jest.Mock<
            typeof TypeOrmTransactionContext.is
          >
        ).mockReturnValueOnce(true);

        transactionContextMock.unwrap.mockReturnValueOnce(queryRunnerFixture);

        result = unwrapTypeOrmTransactionContext(transactionContextMock);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should return QueryRunner', () => {
        expect(result).toBe(queryRunnerFixture);
      });
    });
  });
});
