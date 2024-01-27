import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder, BuilderAsync } from '@cornie-js/backend-common';
import {
  ObjectLiteral,
  QueryBuilder,
  Repository,
  SelectQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';

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
    describe('when called and findQueryTypeOrmFromQueryBuilder.build() returns QueryBuilder<TModelDb>', () => {
      let queryTestFixture: QueryTest;
      let modelTestFixture: ModelTest;
      let modelTestFixtures: ModelTest[];

      beforeAll(async () => {
        modelTestFixture = {
          foo: 'bar',
        };
        modelTestFixtures = [modelTestFixture];
        queryTestFixture = {
          fooValue: 'bar',
        };

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

        await findTypeOrmQueryBuilderService.find(queryTestFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call queryBuilder.getMany()', () => {
        expect(queryBuilderMock.getMany).toHaveBeenCalledTimes(1);
        expect(queryBuilderMock.getMany).toHaveBeenCalledWith();
      });
    });
  });

  describe('.findOne()', () => {
    describe('when called and findQueryTypeOrmFromQueryBuilder.build() returns QueryBuilder<TModelDb> and repository.findOne() returns null', () => {
      let queryTestFixture: QueryTest;
      let modelTestFixture: null;
      let result: unknown;

      beforeAll(async () => {
        modelTestFixture = null;
        queryTestFixture = {
          fooValue: 'bar',
        };

        (
          queryTypeOrmFromQueryBuilderMock.build as jest.Mock<
            (
              query: QueryTest,
              context: QueryBuilder<ModelTest> & WhereExpressionBuilder,
            ) => Promise<QueryBuilder<ModelTest> & WhereExpressionBuilder>
          >
        ).mockResolvedValueOnce(queryBuilderMock);
        queryBuilderMock.getOne.mockResolvedValueOnce(modelTestFixture);

        result = await findTypeOrmQueryBuilderService.findOne(queryTestFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
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

    describe('when called and findQueryTypeOrmFromQueryBuilder.build() returns QueryBuilder<TModelDb> and repository.findOne() returns a TModelDb', () => {
      let queryTestFixture: QueryTest;
      let modelTestFixture: ModelTest;
      let result: unknown;

      beforeAll(async () => {
        modelTestFixture = {
          foo: 'bar',
        };
        queryTestFixture = {
          fooValue: 'bar',
        };

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

        result = await findTypeOrmQueryBuilderService.findOne(queryTestFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
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
