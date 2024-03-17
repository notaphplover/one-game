import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../utils/unwrapTypeOrmTransaction');

import {
  AppError,
  AppErrorKind,
  Builder,
  BuilderAsync,
} from '@cornie-js/backend-common';
import {
  FindManyOptions,
  InsertQueryBuilder,
  InsertResult,
  QueryBuilder,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { TransactionWrapper } from '../../../application/models/TransactionWrapper';
import { unwrapTypeOrmTransaction } from '../utils/unwrapTypeOrmTransaction';
import { InsertTypeOrmQueryBuilderService } from './InsertTypeOrmQueryBuilderService';

interface ModelTest {
  foo: unknown;
}

interface QueryTest {
  bar: unknown;
}

describe(InsertTypeOrmQueryBuilderService.name, () => {
  let queryBuilderMock: jest.Mocked<
    InsertQueryBuilder<ModelTest> & SelectQueryBuilder<ModelTest>
  >;
  let repositoryMock: jest.Mocked<Repository<ModelTest>>;
  let modelFromModelDbBuilderMock: jest.Mocked<
    Builder<ModelTest, [ModelTest]> | BuilderAsync<ModelTest, [ModelTest]>
  >;
  let setQueryTypeOrmFromSetQueryBuilderMock: jest.Mocked<
    | Builder<
        InsertQueryBuilder<ModelTest>,
        [QueryTest, InsertQueryBuilder<ModelTest>]
      >
    | BuilderAsync<
        InsertQueryBuilder<ModelTest>,
        [QueryTest, InsertQueryBuilder<ModelTest>]
      >
  >;

  let insertTypeOrmQueryBuilderService: InsertTypeOrmQueryBuilderService<
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
          InsertQueryBuilder<ModelTest>,
          [QueryTest, InsertQueryBuilder<ModelTest>]
        >
      | BuilderAsync<
          InsertQueryBuilder<ModelTest>,
          [QueryTest, InsertQueryBuilder<ModelTest>]
        >
    >;

    insertTypeOrmQueryBuilderService = new InsertTypeOrmQueryBuilderService(
      repositoryMock,
      modelFromModelDbBuilderMock,
      setQueryTypeOrmFromSetQueryBuilderMock,
    );
  });

  describe('.insertOne()', () => {
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

    describe('when called', () => {
      let modelFixture: ModelTest;
      let insertResultFixture: InsertResult;
      let queryBuilderAfterValuesSetMock: jest.Mocked<
        InsertQueryBuilder<ModelTest> & SelectQueryBuilder<ModelTest>
      >;
      let queryRunnerFixture: QueryRunner;
      let typeOrmQueryFixture: QueryDeepPartialEntity<ModelTest>;

      let result: unknown;

      beforeAll(async () => {
        modelFixture = {
          foo: 'sample-string',
        };

        insertResultFixture = {
          identifiers: [{ id: 'sample-id' }],
        } as Partial<InsertResult> as InsertResult;

        queryRunnerFixture = Symbol() as unknown as QueryRunner;

        typeOrmQueryFixture = {
          foo: 'bar',
        };

        queryBuilderAfterValuesSetMock = {
          execute: jest.fn(),
          expressionMap: {
            valuesSet: typeOrmQueryFixture,
          } as unknown,
        } as Partial<
          jest.Mocked<
            InsertQueryBuilder<ModelTest> & SelectQueryBuilder<ModelTest>
          >
        > as jest.Mocked<
          InsertQueryBuilder<ModelTest> & SelectQueryBuilder<ModelTest>
        >;

        (
          unwrapTypeOrmTransaction as jest.Mock<typeof unwrapTypeOrmTransaction>
        ).mockReturnValueOnce(queryRunnerFixture);
        queryBuilderAfterValuesSetMock.execute.mockResolvedValueOnce(
          insertResultFixture,
        );
        queryBuilderMock.getMany.mockResolvedValueOnce([modelFixture]);
        (
          modelFromModelDbBuilderMock as jest.Mocked<
            BuilderAsync<ModelTest, [ModelTest]>
          >
        ).build.mockResolvedValueOnce(modelFixture);
        (
          setQueryTypeOrmFromSetQueryBuilderMock as jest.Mocked<
            BuilderAsync<
              InsertQueryBuilder<ModelTest>,
              [QueryTest, InsertQueryBuilder<ModelTest>]
            >
          >
        ).build.mockResolvedValueOnce(queryBuilderAfterValuesSetMock);

        result = await insertTypeOrmQueryBuilderService.insertOne(
          queryFixture,
          transactionWrapperFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call setQueryTypeOrmFromSetQueryBuilder.build()', () => {
        expect(
          setQueryTypeOrmFromSetQueryBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          setQueryTypeOrmFromSetQueryBuilderMock.build,
        ).toHaveBeenCalledWith(queryFixture, queryBuilderMock);
      });

      it('should call repositoryMock.createQueryBuilder()', () => {
        expect(repositoryMock.createQueryBuilder).toHaveBeenCalledTimes(2);
        expect(repositoryMock.createQueryBuilder).toHaveBeenNthCalledWith(
          1,
          undefined,
          queryRunnerFixture,
        );
        expect(repositoryMock.createQueryBuilder).toHaveBeenNthCalledWith(
          2,
          undefined,
          queryRunnerFixture,
        );
      });

      it('should call queryBuilderMock.insert()', () => {
        expect(queryBuilderMock.insert).toHaveBeenCalledTimes(1);
        expect(queryBuilderMock.insert).toHaveBeenCalledWith();
      });

      it('should call queryBuilderMock.execute()', () => {
        expect(queryBuilderAfterValuesSetMock.execute).toHaveBeenCalledTimes(1);
        expect(queryBuilderAfterValuesSetMock.execute).toHaveBeenCalledWith();
      });

      it('should call queryBuilder.setFindOptions()', () => {
        const expected: FindManyOptions<ModelTest> = {
          loadEagerRelations: true,
          where: insertResultFixture.identifiers,
        };

        expect(queryBuilderMock.setFindOptions).toHaveBeenCalledTimes(1);
        expect(queryBuilderMock.setFindOptions).toHaveBeenCalledWith(expected);
      });

      it('should call queryBuilder.getMany()', () => {
        expect(queryBuilderMock.getMany).toHaveBeenCalledTimes(1);
        expect(queryBuilderMock.getMany).toHaveBeenCalledWith();
      });

      it('should call modelFromModelDbBuilder.build()', () => {
        expect(modelFromModelDbBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(modelFromModelDbBuilderMock.build).toHaveBeenCalledWith(
          modelFixture,
        );
      });

      it('should return an ModelTest', () => {
        expect(result).toBe(modelFixture);
      });
    });

    describe('when called, and setQueryTypeOrmFromSetQueryBuilder.build() returns a QueryDeepPartialEntity[] with one element', () => {
      let modelFixture: ModelTest;
      let queryFixture: QueryTest;
      let insertResultFixture: InsertResult;
      let queryBuilderAfterValuesSetMock: jest.Mocked<
        InsertQueryBuilder<ModelTest> & SelectQueryBuilder<ModelTest>
      >;
      let queryRunnerFixture: QueryRunner;
      let typeOrmQueryFixture: QueryDeepPartialEntity<ModelTest>;

      let result: unknown;

      beforeAll(async () => {
        modelFixture = {
          foo: 'sample-string',
        };

        queryFixture = {
          bar: 'sample',
        };

        insertResultFixture = {
          identifiers: [{ id: 'sample-id' }],
        } as Partial<InsertResult> as InsertResult;

        queryRunnerFixture = Symbol() as unknown as QueryRunner;

        typeOrmQueryFixture = {};

        queryBuilderAfterValuesSetMock = {
          execute: jest.fn(),
          expressionMap: {
            valuesSet: [typeOrmQueryFixture],
          } as unknown,
        } as Partial<
          jest.Mocked<
            InsertQueryBuilder<ModelTest> & SelectQueryBuilder<ModelTest>
          >
        > as jest.Mocked<
          InsertQueryBuilder<ModelTest> & SelectQueryBuilder<ModelTest>
        >;

        (
          unwrapTypeOrmTransaction as jest.Mock<typeof unwrapTypeOrmTransaction>
        ).mockReturnValueOnce(queryRunnerFixture);
        queryBuilderMock.getMany.mockResolvedValueOnce([modelFixture]);
        queryBuilderAfterValuesSetMock.execute.mockResolvedValueOnce(
          insertResultFixture,
        );
        (
          modelFromModelDbBuilderMock as jest.Mocked<
            BuilderAsync<ModelTest, [ModelTest]>
          >
        ).build.mockResolvedValueOnce(modelFixture);
        (
          setQueryTypeOrmFromSetQueryBuilderMock as jest.Mocked<
            BuilderAsync<
              InsertQueryBuilder<ModelTest>,
              [QueryTest, InsertQueryBuilder<ModelTest>]
            >
          >
        ).build.mockResolvedValueOnce(queryBuilderAfterValuesSetMock);

        result = await insertTypeOrmQueryBuilderService.insertOne(queryFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should return an ModelTest', () => {
        expect(result).toBe(modelFixture);
      });
    });

    describe('when called, and setQueryTypeOrmFromSetQueryBuilder.build() returns a QueryDeepPartialEntity[] with not one element', () => {
      let queryFixture: QueryTest;
      let queryRunnerFixture: QueryRunner;

      let queryBuilderAfterValuesSetMock: jest.Mocked<
        InsertQueryBuilder<ModelTest> & SelectQueryBuilder<ModelTest>
      >;

      let result: unknown;

      beforeAll(async () => {
        queryFixture = {
          bar: 'sample',
        };

        queryRunnerFixture = Symbol() as unknown as QueryRunner;

        queryBuilderAfterValuesSetMock = {
          execute: jest.fn(),
          expressionMap: {
            valuesSet: [],
          } as unknown,
        } as Partial<
          jest.Mocked<
            InsertQueryBuilder<ModelTest> & SelectQueryBuilder<ModelTest>
          >
        > as jest.Mocked<
          InsertQueryBuilder<ModelTest> & SelectQueryBuilder<ModelTest>
        >;

        (
          unwrapTypeOrmTransaction as jest.Mock<typeof unwrapTypeOrmTransaction>
        ).mockReturnValueOnce(queryRunnerFixture);

        (
          setQueryTypeOrmFromSetQueryBuilderMock as jest.Mocked<
            BuilderAsync<
              InsertQueryBuilder<ModelTest>,
              [QueryTest, InsertQueryBuilder<ModelTest>]
            >
          >
        ).build.mockResolvedValueOnce(queryBuilderAfterValuesSetMock);

        try {
          await insertTypeOrmQueryBuilderService.insertOne(queryFixture);
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should throw an error', () => {
        const expectedErrorProperties: Partial<AppError> = {
          kind: AppErrorKind.unknown,
          message:
            'Unexpected malformed insert query. Wrong number of entities to persist found',
        };

        expect(result).toBeInstanceOf(Error);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });
  });

  describe('.insertMany()', () => {
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

    describe('when called, and setQueryTypeOrmFromSetQueryBuilder.build() returns a QueryDeepPartialEntity[]', () => {
      let modelFixture: ModelTest;
      let insertResultFixture: InsertResult;
      let queryBuilderAfterValuesSetMock: jest.Mocked<
        InsertQueryBuilder<ModelTest> & SelectQueryBuilder<ModelTest>
      >;
      let queryRunnerFixture: QueryRunner;
      let typeOrmQueryFixture: QueryDeepPartialEntity<ModelTest>[];

      let result: unknown;

      beforeAll(async () => {
        modelFixture = {
          foo: 'sample-string',
        };

        insertResultFixture = {
          identifiers: [{ id: 'sample-id' }],
        } as Partial<InsertResult> as InsertResult;

        queryRunnerFixture = Symbol() as unknown as QueryRunner;

        typeOrmQueryFixture = [{}];

        queryBuilderAfterValuesSetMock = {
          execute: jest.fn(),
          expressionMap: {
            valuesSet: typeOrmQueryFixture,
          } as unknown,
        } as Partial<
          jest.Mocked<
            InsertQueryBuilder<ModelTest> & SelectQueryBuilder<ModelTest>
          >
        > as jest.Mocked<
          InsertQueryBuilder<ModelTest> & SelectQueryBuilder<ModelTest>
        >;

        (
          unwrapTypeOrmTransaction as jest.Mock<typeof unwrapTypeOrmTransaction>
        ).mockReturnValueOnce(queryRunnerFixture);

        queryBuilderMock.getMany.mockResolvedValueOnce([modelFixture]);
        queryBuilderAfterValuesSetMock.execute.mockResolvedValueOnce(
          insertResultFixture,
        );
        (
          modelFromModelDbBuilderMock as jest.Mocked<
            BuilderAsync<ModelTest, [ModelTest]>
          >
        ).build.mockResolvedValueOnce(modelFixture);
        (
          setQueryTypeOrmFromSetQueryBuilderMock as jest.Mocked<
            BuilderAsync<
              InsertQueryBuilder<ModelTest>,
              [QueryTest, InsertQueryBuilder<ModelTest>]
            >
          >
        ).build.mockResolvedValueOnce(queryBuilderAfterValuesSetMock);

        result = await insertTypeOrmQueryBuilderService.insertMany(
          queryFixture,
          transactionWrapperFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call setQueryTypeOrmFromSetQueryBuilder.build()', () => {
        expect(
          setQueryTypeOrmFromSetQueryBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          setQueryTypeOrmFromSetQueryBuilderMock.build,
        ).toHaveBeenCalledWith(queryFixture, queryBuilderMock);
      });

      it('should call repositoryMock.createQueryBuilder()', () => {
        expect(repositoryMock.createQueryBuilder).toHaveBeenCalledTimes(2);
        expect(repositoryMock.createQueryBuilder).toHaveBeenNthCalledWith(
          1,
          undefined,
          queryRunnerFixture,
        );
        expect(repositoryMock.createQueryBuilder).toHaveBeenNthCalledWith(
          2,
          undefined,
          queryRunnerFixture,
        );
      });

      it('should call queryBuilderMock.insert()', () => {
        expect(queryBuilderMock.insert).toHaveBeenCalledTimes(1);
        expect(queryBuilderMock.insert).toHaveBeenCalledWith();
      });

      it('should call queryBuilderMock.execute()', () => {
        expect(queryBuilderAfterValuesSetMock.execute).toHaveBeenCalledTimes(1);
        expect(queryBuilderAfterValuesSetMock.execute).toHaveBeenCalledWith();
      });

      it('should call queryBuilder.setFindOptions()', () => {
        const expected: FindManyOptions<ModelTest> = {
          loadEagerRelations: true,
          where: insertResultFixture.identifiers,
        };

        expect(queryBuilderMock.setFindOptions).toHaveBeenCalledTimes(1);
        expect(queryBuilderMock.setFindOptions).toHaveBeenCalledWith(expected);
      });

      it('should call queryBuilder.getMany()', () => {
        expect(queryBuilderMock.getMany).toHaveBeenCalledTimes(1);
        expect(queryBuilderMock.getMany).toHaveBeenCalledWith();
      });

      it('should call modelFromModelDbBuilder.build()', () => {
        expect(modelFromModelDbBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(modelFromModelDbBuilderMock.build).toHaveBeenCalledWith(
          modelFixture,
        );
      });

      it('should return an ModelTest', () => {
        expect(result).toStrictEqual([modelFixture]);
      });
    });

    describe('when called, and setQueryTypeOrmFromSetQueryBuilder.build() returns a QueryDeepPartialEntity', () => {
      let modelFixture: ModelTest;
      let queryFixture: QueryTest;
      let insertResultFixture: InsertResult;
      let queryBuilderAfterValuesSetMock: jest.Mocked<
        InsertQueryBuilder<ModelTest> & SelectQueryBuilder<ModelTest>
      >;
      let queryRunnerFixture: QueryRunner;
      let typeOrmQueryFixture: QueryDeepPartialEntity<ModelTest>;

      let result: unknown;

      beforeAll(async () => {
        modelFixture = {
          foo: 'sample-string',
        };

        queryFixture = {
          bar: 'sample',
        };

        insertResultFixture = {
          identifiers: [{ id: 'sample-id' }],
        } as Partial<InsertResult> as InsertResult;

        queryRunnerFixture = Symbol() as unknown as QueryRunner;

        typeOrmQueryFixture = {};

        queryBuilderAfterValuesSetMock = {
          execute: jest.fn(),
          expressionMap: {
            valuesSet: typeOrmQueryFixture,
          } as unknown,
        } as Partial<
          jest.Mocked<
            InsertQueryBuilder<ModelTest> & SelectQueryBuilder<ModelTest>
          >
        > as jest.Mocked<
          InsertQueryBuilder<ModelTest> & SelectQueryBuilder<ModelTest>
        >;

        (
          unwrapTypeOrmTransaction as jest.Mock<typeof unwrapTypeOrmTransaction>
        ).mockReturnValueOnce(queryRunnerFixture);

        queryBuilderMock.getMany.mockResolvedValueOnce([modelFixture]);
        queryBuilderAfterValuesSetMock.execute.mockResolvedValueOnce(
          insertResultFixture,
        );
        (
          modelFromModelDbBuilderMock as jest.Mocked<
            BuilderAsync<ModelTest, [ModelTest]>
          >
        ).build.mockResolvedValueOnce(modelFixture);
        (
          setQueryTypeOrmFromSetQueryBuilderMock as jest.Mocked<
            BuilderAsync<
              InsertQueryBuilder<ModelTest>,
              [QueryTest, InsertQueryBuilder<ModelTest>]
            >
          >
        ).build.mockResolvedValueOnce(queryBuilderAfterValuesSetMock);

        result =
          await insertTypeOrmQueryBuilderService.insertMany(queryFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call setQueryTypeOrmFromSetQueryBuilder.build()', () => {
        expect(
          setQueryTypeOrmFromSetQueryBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          setQueryTypeOrmFromSetQueryBuilderMock.build,
        ).toHaveBeenCalledWith(queryFixture, queryBuilderMock);
      });

      it('should call queryBuilder.setFindOptions()', () => {
        const expected: FindManyOptions<ModelTest> = {
          loadEagerRelations: true,
          where: insertResultFixture.identifiers,
        };

        expect(queryBuilderMock.setFindOptions).toHaveBeenCalledTimes(1);
        expect(queryBuilderMock.setFindOptions).toHaveBeenCalledWith(expected);
      });

      it('should call queryBuilder.getMany()', () => {
        expect(queryBuilderMock.getMany).toHaveBeenCalledTimes(1);
        expect(queryBuilderMock.getMany).toHaveBeenCalledWith();
      });

      it('should call modelFromModelDbBuilder.build()', () => {
        expect(modelFromModelDbBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(modelFromModelDbBuilderMock.build).toHaveBeenCalledWith(
          modelFixture,
        );
      });

      it('should return an ModelTest', () => {
        expect(result).toStrictEqual([modelFixture]);
      });
    });
  });
});
