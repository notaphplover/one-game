import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { DataSource, QueryRunner } from 'typeorm';

import { TypeOrmTransactionWrapper } from './TypeOrmTransactionWrapper';

describe(TypeOrmTransactionWrapper.name, () => {
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
        result = await TypeOrmTransactionWrapper.build(datasourceMock);
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

      it('should return TypeOrmTransactionWrapper', () => {
        expect(result).toBeInstanceOf(TypeOrmTransactionWrapper);
      });
    });
  });

  describe('.is', () => {
    describe.each<[string, () => Promise<unknown>, boolean]>([
      ['null', async () => null, false],
      ['string', async () => 'string', false],
      ['non TypeOrmTransactionWrapper', async () => ({}), false],
      [
        'TypeOrmTransactionWrapper',
        async () => TypeOrmTransactionWrapper.build(datasourceMock),
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
            result = TypeOrmTransactionWrapper.is(await getValue());
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
    let typeOrmTransactionWrapper: TypeOrmTransactionWrapper;

    beforeAll(async () => {
      typeOrmTransactionWrapper =
        await TypeOrmTransactionWrapper.build(datasourceMock);
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = typeOrmTransactionWrapper.unwrap();
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should return QueryRunner', () => {
        expect(result).toBe(queryRunnerMock);
      });
    });
  });

  describe('.rollback', () => {
    let typeOrmTransactionWrapper: TypeOrmTransactionWrapper;

    beforeAll(async () => {
      typeOrmTransactionWrapper =
        await TypeOrmTransactionWrapper.build(datasourceMock);
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(async () => {
        queryRunnerMock.rollbackTransaction.mockImplementationOnce(
          async (): Promise<void> => undefined,
        );

        result = await typeOrmTransactionWrapper.rollback();
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call queryRunner.rollbackTransaction()', () => {
        expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalledTimes(1);
        expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalledWith();
      });

      it('should call queryRunner.release()', () => {
        expect(queryRunnerMock.release).toHaveBeenCalledTimes(1);
        expect(queryRunnerMock.release).toHaveBeenCalledWith();
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called, and queryRunner.rollbackTransaction() throws an error', () => {
      let errorFixture: unknown;
      let result: unknown;

      beforeAll(async () => {
        errorFixture = new Error();
        queryRunnerMock.rollbackTransaction.mockImplementationOnce(
          async (): Promise<void> => {
            throw errorFixture;
          },
        );

        try {
          await typeOrmTransactionWrapper.rollback();
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
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

  describe('.tryCommit', () => {
    let typeOrmTransactionWrapper: TypeOrmTransactionWrapper;

    beforeAll(async () => {
      typeOrmTransactionWrapper =
        await TypeOrmTransactionWrapper.build(datasourceMock);
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(async () => {
        queryRunnerMock.commitTransaction.mockImplementationOnce(
          async (): Promise<void> => undefined,
        );

        result = await typeOrmTransactionWrapper.tryCommit();
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
          await typeOrmTransactionWrapper.tryCommit();
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
