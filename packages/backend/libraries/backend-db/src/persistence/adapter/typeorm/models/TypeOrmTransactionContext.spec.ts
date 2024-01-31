import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Writable } from '@cornie-js/backend-common';
import { DataSource, QueryRunner } from 'typeorm';

/*
 * Ugly workaround until https://github.com/jestjs/jest/issues/14874 is fixed
 */

const asyncDisposeSymbol: unique symbol = Symbol('Symbol.asyncDispose');

(Symbol as Writable<SymbolConstructor>).asyncDispose ??=
  asyncDisposeSymbol as unknown as SymbolConstructor['asyncDispose'];

import { TypeOrmTransactionContext } from './TypeOrmTransactionContext';

describe(TypeOrmTransactionContext.name, () => {
  let queryRunnerMock: jest.Mocked<QueryRunner>;
  let datasourceMock: jest.Mocked<DataSource>;

  beforeAll(() => {
    queryRunnerMock = {
      commitTransaction: jest.fn(),
      release: jest
        .fn()
        .mockImplementation(async (): Promise<void> => undefined),
      rollbackTransaction: jest
        .fn()
        .mockImplementation(async (): Promise<void> => undefined),
      startTransaction: jest
        .fn()
        .mockImplementation(async (): Promise<void> => undefined),
    } as Partial<jest.Mocked<QueryRunner>> as jest.Mocked<QueryRunner>;
    datasourceMock = {
      createQueryRunner: jest.fn().mockReturnValue(queryRunnerMock),
    } as Partial<jest.Mocked<DataSource>> as jest.Mocked<DataSource>;
  });

  describe('.build', () => {
    describe('when called', () => {
      let result: unknown;

      beforeAll(async () => {
        result = await TypeOrmTransactionContext.build(datasourceMock);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call dataSource.createQueryRunner()', () => {
        expect(datasourceMock.createQueryRunner).toHaveBeenCalledTimes(1);
        expect(datasourceMock.createQueryRunner).toHaveBeenCalledWith();
      });

      it('should call queryRunner.startTransaction()', () => {
        expect(queryRunnerMock.startTransaction).toHaveBeenCalledTimes(1);
        expect(queryRunnerMock.startTransaction).toHaveBeenCalledWith();
      });

      it('should return TypeOrmTransactionContext', () => {
        expect(result).toBeInstanceOf(TypeOrmTransactionContext);
      });
    });
  });

  describe('.is', () => {
    describe.each<[string, () => Promise<unknown>, boolean]>([
      ['null', async () => null, false],
      ['string', async () => 'string', false],
      ['non TypeOrmTransactionContext', async () => ({}), false],
      [
        'TypeOrmTransactionContext',
        async () => TypeOrmTransactionContext.build(datasourceMock),
        true,
      ],
    ])(
      'having a %s value',
      (
        _: string,
        getValue: () => Promise<unknown>,
        expectedResult: boolean,
      ) => {
        describe('when called', () => {
          let result: unknown;

          beforeAll(async () => {
            result = TypeOrmTransactionContext.is(await getValue());
          });

          afterAll(() => {
            jest.clearAllMocks();
          });

          it(`should return "${expectedResult.toString()}"`, () => {
            expect(result).toBe(expectedResult);
          });
        });
      },
    );
  });

  describe('.unwrap', () => {
    let typeOrmTransactionContext: TypeOrmTransactionContext;

    beforeAll(async () => {
      typeOrmTransactionContext =
        await TypeOrmTransactionContext.build(datasourceMock);
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = typeOrmTransactionContext.unwrap();
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should return QueryRunner', () => {
        expect(result).toBe(queryRunnerMock);
      });
    });
  });

  describe('.[Symbol.asyncDispose]', () => {
    let typeOrmTransactionContext: TypeOrmTransactionContext;

    beforeAll(async () => {
      typeOrmTransactionContext =
        await TypeOrmTransactionContext.build(datasourceMock);
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(async () => {
        queryRunnerMock.commitTransaction.mockImplementationOnce(
          async (): Promise<void> => undefined,
        );

        result = await typeOrmTransactionContext[Symbol.asyncDispose]();
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call queryRunner.commitTransaction()', () => {
        expect(queryRunnerMock.commitTransaction).toHaveBeenCalledTimes(1);
        expect(queryRunnerMock.commitTransaction).toHaveBeenCalledWith();
      });

      it('should not call queryRunner.rollbackTransaction()', () => {
        expect(queryRunnerMock.rollbackTransaction).not.toHaveBeenCalled();
      });

      it('should call queryRunner.release()', () => {
        expect(queryRunnerMock.release).toHaveBeenCalledTimes(1);
        expect(queryRunnerMock.release).toHaveBeenCalledWith();
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called, and queryRunner.commitTransaction() throws an error', () => {
      let errorFixture: unknown;
      let result: unknown;

      beforeAll(async () => {
        errorFixture = new Error();
        queryRunnerMock.commitTransaction.mockImplementationOnce(
          async (): Promise<void> => {
            throw errorFixture;
          },
        );

        try {
          await typeOrmTransactionContext[Symbol.asyncDispose]();
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call queryRunner.commitTransaction()', () => {
        expect(queryRunnerMock.commitTransaction).toHaveBeenCalledTimes(1);
        expect(queryRunnerMock.commitTransaction).toHaveBeenCalledWith();
      });

      it('should call queryRunner.rollbackTransaction()', () => {
        expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalledTimes(1);
        expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalledWith();
      });

      it('should call queryRunner.release()', () => {
        expect(queryRunnerMock.release).toHaveBeenCalledTimes(1);
        expect(queryRunnerMock.release).toHaveBeenCalledWith();
      });

      it('should throw an Error', () => {
        expect(result).toBe(errorFixture);
      });
    });
  });
});
