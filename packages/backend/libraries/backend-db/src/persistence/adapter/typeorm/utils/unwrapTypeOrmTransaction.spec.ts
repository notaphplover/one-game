import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../models/TypeOrmTransactionWrapper');

import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { QueryRunner } from 'typeorm';

import { TransactionWrapper } from '../../../application/models/TransactionWrapper';
import { TypeOrmTransactionWrapper } from '../models/TypeOrmTransactionWrapper';
import { unwrapTypeOrmTransaction } from './unwrapTypeOrmTransaction';

describe(unwrapTypeOrmTransaction.name, () => {
  describe('having an undefined TransactionWrapper', () => {
    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = unwrapTypeOrmTransaction(undefined);
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('having a non undefined TransactionWrapper', () => {
    let transactionWrapperMock: jest.Mocked<TransactionWrapper>;

    beforeAll(() => {
      transactionWrapperMock = {
        unwrap: jest.fn(),
      } as Partial<
        jest.Mocked<TransactionWrapper>
      > as jest.Mocked<TransactionWrapper>;
    });

    describe('when called, and TypeOrmTransactionWrapper.is() returns false', () => {
      let result: unknown;

      beforeAll(() => {
        (
          TypeOrmTransactionWrapper.is as unknown as jest.Mock<
            typeof TypeOrmTransactionWrapper.is
          >
        ).mockReturnValueOnce(false);

        try {
          unwrapTypeOrmTransaction(transactionWrapperMock);
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

    describe('when called, and TypeOrmTransactionWrapper.is() returns true', () => {
      let queryRunnerFixture: QueryRunner;
      let result: unknown;

      beforeAll(() => {
        queryRunnerFixture = Symbol() as unknown as QueryRunner;

        (
          TypeOrmTransactionWrapper.is as unknown as jest.Mock<
            typeof TypeOrmTransactionWrapper.is
          >
        ).mockReturnValueOnce(true);

        transactionWrapperMock.unwrap.mockReturnValueOnce(queryRunnerFixture);

        result = unwrapTypeOrmTransaction(transactionWrapperMock);
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
