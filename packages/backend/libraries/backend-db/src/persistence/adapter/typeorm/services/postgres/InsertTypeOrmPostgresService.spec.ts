import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../utils/unwrapTypeOrmTransaction');

import {
  AppError,
  AppErrorKind,
  Builder,
  BuilderAsync,
} from '@cornie-js/backend-common';
import {
  InsertQueryBuilder,
  QueryBuilder,
  QueryFailedError,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { TransactionWrapper } from '../../../../application/models/TransactionWrapper';
import { unwrapTypeOrmTransaction } from '../../utils/unwrapTypeOrmTransaction';
import { InsertTypeOrmPostgresService } from './InsertTypeOrmPostgresService';

interface PgDatabaseError extends Error, Record<string, unknown> {
  code: string;
  detail: string | undefined;
}

interface ModelTest {
  foo: unknown;
}

interface QueryTest {
  bar: unknown;
}

describe(InsertTypeOrmPostgresService.name, () => {
  let queryBuilderMock: jest.Mocked<
    InsertQueryBuilder<ModelTest> & SelectQueryBuilder<ModelTest>
  >;
  let repositoryMock: jest.Mocked<Repository<ModelTest>>;
  let modelFromModelDbBuilderMock: jest.Mocked<
    Builder<ModelTest, [ModelTest]> | BuilderAsync<ModelTest, [ModelTest]>
  >;
  let setQueryTypeOrmFromSetQueryBuilderMock: jest.Mocked<
    | Builder<
        QueryDeepPartialEntity<ModelTest> | QueryDeepPartialEntity<ModelTest>[],
        [QueryTest]
      >
    | BuilderAsync<
        QueryDeepPartialEntity<ModelTest> | QueryDeepPartialEntity<ModelTest>[],
        [QueryTest]
      >
  >;

  let insertTypeOrmPostgresService: InsertTypeOrmPostgresService<
    ModelTest,
    ModelTest,
    QueryTest
  >;

  beforeAll(() => {
    queryBuilderMock = Object.assign(
      Object.create(QueryBuilder.prototype) as QueryBuilder<ModelTest>,
      {
        execute: jest.fn(),
        getMany: jest.fn(),
        insert: jest.fn().mockReturnThis(),
        setFindOptions: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
      } as Partial<
        jest.Mocked<
          InsertQueryBuilder<ModelTest> & SelectQueryBuilder<ModelTest>
        >
      > as jest.Mocked<
        InsertQueryBuilder<ModelTest> & SelectQueryBuilder<ModelTest>
      >,
    );

    repositoryMock = {
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
    } as Partial<jest.Mocked<Repository<ModelTest>>> as jest.Mocked<
      Repository<ModelTest>
    >;

    modelFromModelDbBuilderMock = {
      build: jest.fn(),
    } as jest.Mocked<
      Builder<ModelTest, [ModelTest]> | BuilderAsync<ModelTest, [ModelTest]>
    >;
    setQueryTypeOrmFromSetQueryBuilderMock = {
      build: jest.fn(),
    } as jest.Mocked<
      | Builder<
          | QueryDeepPartialEntity<ModelTest>
          | QueryDeepPartialEntity<ModelTest>[],
          [QueryTest]
        >
      | BuilderAsync<
          | QueryDeepPartialEntity<ModelTest>
          | QueryDeepPartialEntity<ModelTest>[],
          [QueryTest]
        >
    >;

    insertTypeOrmPostgresService = new InsertTypeOrmPostgresService(
      repositoryMock,
      modelFromModelDbBuilderMock,
      setQueryTypeOrmFromSetQueryBuilderMock,
    );
  });

  describe('.insertOne', () => {
    let queryFixture: QueryTest;
    let transactionWrapperFixture: TransactionWrapper | undefined;

    beforeAll(() => {
      queryFixture = {
        bar: 'sample',
      };

      transactionWrapperFixture = Symbol() as unknown as
        | TransactionWrapper
        | undefined;
    });

    describe.each<[unknown]>([
      [undefined],
      [null],
      [3],
      [{}],
      [{ driverError: null }],
      [{ driverError: 3 }],
    ])('when called, and a non Error is thrown', (errorFixture: unknown) => {
      let result: unknown;

      beforeAll(async () => {
        (
          unwrapTypeOrmTransaction as jest.Mock<typeof unwrapTypeOrmTransaction>
        ).mockImplementationOnce((): never => {
          throw errorFixture;
        });

        try {
          await insertTypeOrmPostgresService.insertOne(
            queryFixture,
            transactionWrapperFixture,
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should throw an error', () => {
        expect(result).toBe(errorFixture);
      });
    });

    describe.each<[Partial<QueryFailedError<Error>>]>([
      [{ driverError: {} as Error }],
      [{ driverError: { code: 0 } as unknown as Error }],
      [{ driverError: { code: '1', detail: null } as unknown as Error }],
    ])(
      'when called, and a non PgDatabaseError QueryFailedError is thrown',
      (errorFixture: unknown) => {
        let result: unknown;

        beforeAll(async () => {
          (
            unwrapTypeOrmTransaction as jest.Mock<
              typeof unwrapTypeOrmTransaction
            >
          ).mockImplementationOnce((): never => {
            throw errorFixture;
          });

          try {
            await insertTypeOrmPostgresService.insertOne(
              queryFixture,
              transactionWrapperFixture,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should throw an error', () => {
          expect(result).toBe(errorFixture);
        });
      },
    );

    describe('when called, and a QueryFailedError is thrown', () => {
      let errorFixture: QueryFailedError<PgDatabaseError>;

      let result: unknown;

      beforeAll(async () => {
        errorFixture = {
          driverError: {
            code: '1',
            detail: 'detail',
          } as PgDatabaseError,
        } as Partial<
          QueryFailedError<PgDatabaseError>
        > as QueryFailedError<PgDatabaseError>;

        (
          unwrapTypeOrmTransaction as jest.Mock<typeof unwrapTypeOrmTransaction>
        ).mockImplementationOnce((): never => {
          throw errorFixture;
        });

        try {
          await insertTypeOrmPostgresService.insertOne(
            queryFixture,
            transactionWrapperFixture,
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should throw an error', () => {
        expect(result).toBe(errorFixture);
      });
    });

    describe('when called, and a PgDatabaseError with PG_DUPLICATE_KEY_ERROR_CODE code is thrown', () => {
      let errorFixture: QueryFailedError<PgDatabaseError>;

      let result: unknown;

      beforeAll(async () => {
        errorFixture = {
          driverError: {
            code: '23505',
          } as PgDatabaseError,
        } as Partial<
          QueryFailedError<PgDatabaseError>
        > as QueryFailedError<PgDatabaseError>;

        (
          unwrapTypeOrmTransaction as jest.Mock<typeof unwrapTypeOrmTransaction>
        ).mockImplementationOnce((): never => {
          throw errorFixture;
        });

        try {
          await insertTypeOrmPostgresService.insertOne(
            queryFixture,
            transactionWrapperFixture,
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should throw an AppError', () => {
        const expectedErrorProperties: Partial<AppError> = {
          kind: AppErrorKind.entityConflict,
          message: 'The entity cannot be created',
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });

    describe('when called, and a PgDatabaseError with PG_DUPLICATE_KEY_ERROR_CODE code and detail is thrown', () => {
      let errorFixture: QueryFailedError<PgDatabaseError>;

      let result: unknown;

      beforeAll(async () => {
        errorFixture = {
          driverError: {
            code: '23505',
            detail: 'detail',
          } as PgDatabaseError,
        } as Partial<
          QueryFailedError<PgDatabaseError>
        > as QueryFailedError<PgDatabaseError>;

        (
          unwrapTypeOrmTransaction as jest.Mock<typeof unwrapTypeOrmTransaction>
        ).mockImplementationOnce((): never => {
          throw errorFixture;
        });

        try {
          await insertTypeOrmPostgresService.insertOne(
            queryFixture,
            transactionWrapperFixture,
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should throw an AppError', () => {
        const expectedErrorProperties: Partial<AppError> = {
          kind: AppErrorKind.entityConflict,
          message: `The entity cannot be created. ${errorFixture.driverError.detail as string}`,
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });
  });
});
