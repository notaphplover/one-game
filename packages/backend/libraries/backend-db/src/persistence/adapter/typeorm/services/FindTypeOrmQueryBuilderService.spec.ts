import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../utils/unwrapTypeOrmTransaction');

import { Builder, BuilderAsync } from '@cornie-js/backend-common';
import {
  ObjectLiteral,
  QueryBuilder,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';

import { TransactionWrapper } from '../../../application/models/TransactionWrapper';
import { unwrapTypeOrmTransaction } from '../utils/unwrapTypeOrmTransaction';
import { FindTypeOrmQueryBuilderService } from './FindTypeOrmQueryBuilderService';

interface ModelTest {
  foo: string;
}

interface QueryTest {
  fooValue: string;
}

describe(FindTypeOrmQueryBuilderService.name, () => {
  let queryBuilderMock: jest.Mocked<SelectQueryBuilder<ModelTest>>;
  let repositoryMock: jest.Mocked<Repository<ModelTest>>;
  let queryTypeOrmFromQueryBuilderMock: jest.Mocked<
    | Builder<
        QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
        [QueryTest, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
      >
    | BuilderAsync<
        QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
        [QueryTest, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
      >
  >;
  let modelFromModelDbBuilderMock: jest.Mocked<
    Builder<ModelTest, [ModelTest]> | BuilderAsync<ModelTest, [ModelTest]>
  >;

  let findTypeOrmQueryBuilderService: FindTypeOrmQueryBuilderService<
    ModelTest,
    ModelTest,
    QueryTest
  >;

  beforeAll(() => {
    queryBuilderMock = {
      getMany: jest.fn(),
      getOne: jest.fn(),
      select: jest.fn().mockReturnThis(),
    } as Partial<jest.Mocked<SelectQueryBuilder<ModelTest>>> as jest.Mocked<
      SelectQueryBuilder<ModelTest>
    >;

    repositoryMock = {
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
      find: jest.fn(),
      findOne: jest.fn(),
      metadata: {
        name: 'ModelTest',
      } as unknown,
    } as Partial<jest.Mocked<Repository<ModelTest>>> as jest.Mocked<
      Repository<ModelTest>
    >;

    queryTypeOrmFromQueryBuilderMock = {
      build: jest.fn(),
    } as Partial<
      jest.Mocked<
        | Builder<
            QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
            [QueryTest, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
          >
        | BuilderAsync<
            QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
            [QueryTest, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
          >
      >
    > as jest.Mocked<
      | Builder<
          QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
          [QueryTest, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
        >
      | BuilderAsync<
          QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
          [QueryTest, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
        >
    >;

    modelFromModelDbBuilderMock = {
      build: jest.fn(),
    } as jest.Mocked<
      Builder<ModelTest, [ModelTest]> | BuilderAsync<ModelTest, [ModelTest]>
    >;

    findTypeOrmQueryBuilderService = new FindTypeOrmQueryBuilderService(
      repositoryMock,
      modelFromModelDbBuilderMock,
      queryTypeOrmFromQueryBuilderMock,
    );
  });

  describe('.find()', () => {
    let queryTestFixture: QueryTest;
    let transactionWrapperFixture: TransactionWrapper | undefined;

    beforeAll(() => {
      queryTestFixture = {
        fooValue: 'bar',
      };

      transactionWrapperFixture = Symbol() as unknown as
        | TransactionWrapper
        | undefined;
    });

    describe('when called', () => {
      let modelTestFixture: ModelTest;
      let modelTestFixtures: ModelTest[];
      let queryRunnerFixture: QueryRunner;

      let result: unknown[];

      beforeAll(async () => {
        modelTestFixture = {
          foo: 'bar',
        };
        modelTestFixtures = [modelTestFixture];
        queryRunnerFixture = Symbol() as unknown as QueryRunner;

        (
          unwrapTypeOrmTransaction as jest.Mock<typeof unwrapTypeOrmTransaction>
        ).mockReturnValueOnce(queryRunnerFixture);
        (
          modelFromModelDbBuilderMock as jest.Mocked<
            BuilderAsync<ModelTest, [ModelTest]>
          >
        ).build.mockResolvedValueOnce(modelTestFixture);
        (
          queryTypeOrmFromQueryBuilderMock.build as jest.Mock<
            (
              query: QueryTest,
              context: QueryBuilder<ModelTest> & WhereExpressionBuilder,
            ) => Promise<QueryBuilder<ModelTest> & WhereExpressionBuilder>
          >
        ).mockResolvedValueOnce(queryBuilderMock);
        queryBuilderMock.getMany.mockResolvedValueOnce(modelTestFixtures);

        result = await findTypeOrmQueryBuilderService.find(
          queryTestFixture,
          transactionWrapperFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call unwrapTypeOrmTransaction()', () => {
        expect(unwrapTypeOrmTransaction).toHaveBeenCalledTimes(1);
        expect(unwrapTypeOrmTransaction).toHaveBeenCalledWith(
          transactionWrapperFixture,
        );
      });

      it('should call repository.createQueryBuilder()', () => {
        expect(repositoryMock.createQueryBuilder).toHaveBeenCalledTimes(1);
        expect(repositoryMock.createQueryBuilder).toHaveBeenCalledWith(
          repositoryMock.metadata.name,
          queryRunnerFixture,
        );
      });

      it('should call findQueryTypeOrmFromQueryBuilder.build()', () => {
        expect(queryTypeOrmFromQueryBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(queryTypeOrmFromQueryBuilderMock.build).toHaveBeenCalledWith(
          queryTestFixture,
          queryBuilderMock,
        );
      });

      it('should call queryBuilder.getMany()', () => {
        expect(queryBuilderMock.getMany).toHaveBeenCalledTimes(1);
        expect(queryBuilderMock.getMany).toHaveBeenCalledWith();
      });

      it('should call modelFromModelDbBuilder.build()', () => {
        expect(modelFromModelDbBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(modelFromModelDbBuilderMock.build).toHaveBeenCalledWith(
          modelTestFixture,
        );
      });

      it('should return ModelTest[]', () => {
        expect(result).toStrictEqual([modelTestFixture]);
      });
    });
  });

  describe('.findOne()', () => {
    let queryTestFixture: QueryTest;
    let transactionWrapperFixture: TransactionWrapper | undefined;

    beforeAll(() => {
      queryTestFixture = {
        fooValue: 'bar',
      };

      transactionWrapperFixture = Symbol() as unknown as
        | TransactionWrapper
        | undefined;
    });

    describe('when called and repository.findOne() returns null', () => {
      let modelTestFixture: null;
      let queryRunnerFixture: QueryRunner;
      let result: unknown;

      beforeAll(async () => {
        modelTestFixture = null;
        queryRunnerFixture = Symbol() as unknown as QueryRunner;

        (
          unwrapTypeOrmTransaction as jest.Mock<typeof unwrapTypeOrmTransaction>
        ).mockReturnValueOnce(queryRunnerFixture);
        (
          queryTypeOrmFromQueryBuilderMock.build as jest.Mock<
            (
              query: QueryTest,
              context: QueryBuilder<ModelTest> & WhereExpressionBuilder,
            ) => Promise<QueryBuilder<ModelTest> & WhereExpressionBuilder>
          >
        ).mockResolvedValueOnce(queryBuilderMock);
        queryBuilderMock.getOne.mockResolvedValueOnce(modelTestFixture);

        result = await findTypeOrmQueryBuilderService.findOne(
          queryTestFixture,
          transactionWrapperFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call unwrapTypeOrmTransaction()', () => {
        expect(unwrapTypeOrmTransaction).toHaveBeenCalledTimes(1);
        expect(unwrapTypeOrmTransaction).toHaveBeenCalledWith(
          transactionWrapperFixture,
        );
      });

      it('should call repository.createQueryBuilder()', () => {
        expect(repositoryMock.createQueryBuilder).toHaveBeenCalledTimes(1);
        expect(repositoryMock.createQueryBuilder).toHaveBeenCalledWith(
          repositoryMock.metadata.name,
          queryRunnerFixture,
        );
      });

      it('should call queryTypeOrmFromQueryBuilder.build()', () => {
        expect(queryTypeOrmFromQueryBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(queryTypeOrmFromQueryBuilderMock.build).toHaveBeenCalledWith(
          queryTestFixture,
          queryBuilderMock,
        );
      });

      it('should call queryBuilder.getOne()', () => {
        expect(queryBuilderMock.getOne).toHaveBeenCalledTimes(1);
        expect(queryBuilderMock.getOne).toHaveBeenCalledWith();
      });

      it('should not call modelFromModelDbBuilder.build()', () => {
        expect(modelFromModelDbBuilderMock.build).not.toHaveBeenCalled();
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called and repository.findOne() returns a TModelDb', () => {
      let modelTestFixture: ModelTest;
      let queryRunnerFixture: QueryRunner;
      let result: unknown;

      beforeAll(async () => {
        modelTestFixture = {
          foo: 'bar',
        };
        queryRunnerFixture = Symbol() as unknown as QueryRunner;

        (
          unwrapTypeOrmTransaction as jest.Mock<typeof unwrapTypeOrmTransaction>
        ).mockReturnValueOnce(queryRunnerFixture);
        (
          queryTypeOrmFromQueryBuilderMock.build as jest.Mock<
            (
              query: QueryTest,
              context: QueryBuilder<ModelTest> & WhereExpressionBuilder,
            ) => Promise<QueryBuilder<ModelTest> & WhereExpressionBuilder>
          >
        ).mockResolvedValueOnce(queryBuilderMock);
        queryBuilderMock.getOne.mockResolvedValueOnce(modelTestFixture);
        (
          modelFromModelDbBuilderMock as jest.Mocked<
            BuilderAsync<ModelTest, [ModelTest]>
          >
        ).build.mockResolvedValueOnce(modelTestFixture);

        result = await findTypeOrmQueryBuilderService.findOne(
          queryTestFixture,
          transactionWrapperFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call unwrapTypeOrmTransaction()', () => {
        expect(unwrapTypeOrmTransaction).toHaveBeenCalledTimes(1);
        expect(unwrapTypeOrmTransaction).toHaveBeenCalledWith(
          transactionWrapperFixture,
        );
      });

      it('should call repository.createQueryBuilder()', () => {
        expect(repositoryMock.createQueryBuilder).toHaveBeenCalledTimes(1);
        expect(repositoryMock.createQueryBuilder).toHaveBeenCalledWith(
          repositoryMock.metadata.name,
          queryRunnerFixture,
        );
      });

      it('should call queryTypeOrmFromQueryBuilder.build()', () => {
        expect(queryTypeOrmFromQueryBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(queryTypeOrmFromQueryBuilderMock.build).toHaveBeenCalledWith(
          queryTestFixture,
          queryBuilderMock,
        );
      });

      it('should call queryBuilder.getOne()', () => {
        expect(queryBuilderMock.getOne).toHaveBeenCalledTimes(1);
        expect(queryBuilderMock.getOne).toHaveBeenCalledWith();
      });

      it('should call modelFromModelDbBuilder.build()', () => {
        expect(modelFromModelDbBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(modelFromModelDbBuilderMock.build).toHaveBeenCalledWith(
          modelTestFixture,
        );
      });

      it('should return TModel or undefined', () => {
        expect(result).toBe(modelTestFixture);
      });
    });
  });
});
