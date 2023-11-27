import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../utils/typeorm/isQueryBuilder');

import { Builder, BuilderAsync } from '@cornie-js/backend-common';
import {
  FindManyOptions,
  QueryBuilder,
  Repository,
  SelectQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';

import { FindQueryTypeOrmFromQueryBuilder } from '../../builders/typeorm/FindQueryTypeOrmFromQueryBuilder';
import { isQueryBuilder } from '../../utils/typeorm/isQueryBuilder';
import { FindTypeOrmServiceV2 } from './FindTypeOrmServiceV2';

interface ModelTest {
  foo: string;
}

interface QueryTest {
  fooValue: string;
}

describe(FindTypeOrmServiceV2.name, () => {
  let queryBuilderMock: jest.Mocked<SelectQueryBuilder<ModelTest>>;
  let repositoryMock: jest.Mocked<Repository<ModelTest>>;
  let queryTypeOrmFromQueryBuilderMock: jest.Mocked<
    FindQueryTypeOrmFromQueryBuilder<ModelTest, QueryTest>
  >;
  let modelFromModelDbBuilderMock: jest.Mocked<
    Builder<ModelTest, [ModelTest]> | BuilderAsync<ModelTest, [ModelTest]>
  >;

  let findTypeOrmServiceV2: FindTypeOrmServiceV2<
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
      jest.Mocked<FindQueryTypeOrmFromQueryBuilder<ModelTest, QueryTest>>
    > as jest.Mocked<FindQueryTypeOrmFromQueryBuilder<ModelTest, QueryTest>>;

    modelFromModelDbBuilderMock = {
      build: jest.fn(),
    } as jest.Mocked<
      Builder<ModelTest, [ModelTest]> | BuilderAsync<ModelTest, [ModelTest]>
    >;

    findTypeOrmServiceV2 = new FindTypeOrmServiceV2(
      repositoryMock,
      modelFromModelDbBuilderMock,
      queryTypeOrmFromQueryBuilderMock,
    );
  });

  describe('.find()', () => {
    describe('when called', () => {
      let queryTestFixture: QueryTest;
      let queryTypeOrmFixture: FindManyOptions<ModelTest>;
      let modelTestFixture: ModelTest;
      let modelTestFixtures: ModelTest[];
      let result: unknown;

      beforeAll(async () => {
        modelTestFixture = {
          foo: 'bar',
        };
        modelTestFixtures = [modelTestFixture];
        queryTestFixture = {
          fooValue: 'bar',
        };
        queryTypeOrmFixture = {};

        (isQueryBuilder as unknown as jest.Mock).mockReturnValueOnce(false);
        (
          modelFromModelDbBuilderMock as jest.Mocked<
            BuilderAsync<ModelTest, [ModelTest]>
          >
        ).build.mockResolvedValueOnce(modelTestFixture);
        (
          queryTypeOrmFromQueryBuilderMock.build as jest.Mock<
            (query: QueryTest) => Promise<FindManyOptions<ModelTest>>
          >
        ).mockResolvedValueOnce(queryTypeOrmFixture);
        repositoryMock.find.mockResolvedValueOnce(modelTestFixtures);

        result = await findTypeOrmServiceV2.find(queryTestFixture);
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

      it('should call modelFromModelDbBuilder.build()', () => {
        expect(modelFromModelDbBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(modelFromModelDbBuilderMock.build).toHaveBeenCalledWith(
          modelTestFixture,
        );
      });

      it('should return TModel[]', () => {
        expect(result).toStrictEqual(modelTestFixtures);
      });
    });

    describe('when called and findQueryTypeOrmFromQueryBuilder.build() returns FindManyOptions<TModelDb>', () => {
      let queryTestFixture: QueryTest;
      let queryTypeOrmFixture: FindManyOptions<ModelTest>;
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
        queryTypeOrmFixture = {};

        (isQueryBuilder as unknown as jest.Mock).mockReturnValueOnce(false);
        (
          modelFromModelDbBuilderMock as jest.Mocked<
            BuilderAsync<ModelTest, [ModelTest]>
          >
        ).build.mockResolvedValueOnce(modelTestFixture);
        (
          queryTypeOrmFromQueryBuilderMock.build as jest.Mock<
            (query: QueryTest) => Promise<FindManyOptions<ModelTest>>
          >
        ).mockResolvedValueOnce(queryTypeOrmFixture);
        repositoryMock.find.mockResolvedValueOnce(modelTestFixtures);

        await findTypeOrmServiceV2.find(queryTestFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call repository.find()', () => {
        expect(repositoryMock.find).toHaveBeenCalledTimes(1);
        expect(repositoryMock.find).toHaveBeenCalledWith(queryTypeOrmFixture);
      });
    });

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

        (isQueryBuilder as unknown as jest.Mock).mockReturnValueOnce(true);
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

        await findTypeOrmServiceV2.find(queryTestFixture);
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
    describe('when called and findQueryTypeOrmFromQueryBuilder.build() returns FindManyOptions<TModelDb> and repository.findOne() returns null', () => {
      let queryTestFixture: QueryTest;
      let queryTypeOrmFixture: FindManyOptions<ModelTest>;
      let modelTestFixture: null;
      let result: unknown;

      beforeAll(async () => {
        modelTestFixture = null;
        queryTestFixture = {
          fooValue: 'bar',
        };
        queryTypeOrmFixture = {};

        (isQueryBuilder as unknown as jest.Mock).mockReturnValueOnce(false);
        (
          queryTypeOrmFromQueryBuilderMock.build as jest.Mock<
            (query: QueryTest) => Promise<FindManyOptions<ModelTest>>
          >
        ).mockResolvedValueOnce(queryTypeOrmFixture);
        repositoryMock.findOne.mockResolvedValueOnce(modelTestFixture);

        result = await findTypeOrmServiceV2.findOne(queryTestFixture);
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

      it('should call repository.findOne()', () => {
        expect(repositoryMock.findOne).toHaveBeenCalledTimes(1);
        expect(repositoryMock.findOne).toHaveBeenCalledWith(
          queryTypeOrmFixture,
        );
      });

      it('should not call modelFromModelDbBuilder.build()', () => {
        expect(modelFromModelDbBuilderMock.build).not.toHaveBeenCalled();
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called and findQueryTypeOrmFromQueryBuilder.build() returns FindManyOptions<TModelDb> and repository.findOne() returns a TModelDb', () => {
      let queryTestFixture: QueryTest;
      let queryTypeOrmFixture: FindManyOptions<ModelTest>;
      let modelTestFixture: ModelTest;
      let result: unknown;

      beforeAll(async () => {
        modelTestFixture = {
          foo: 'bar',
        };
        queryTestFixture = {
          fooValue: 'bar',
        };
        queryTypeOrmFixture = {};

        (isQueryBuilder as unknown as jest.Mock).mockReturnValueOnce(false);
        (
          modelFromModelDbBuilderMock as jest.Mocked<
            BuilderAsync<ModelTest, [ModelTest]>
          >
        ).build.mockResolvedValueOnce(modelTestFixture);
        (
          queryTypeOrmFromQueryBuilderMock.build as jest.Mock<
            (query: QueryTest) => Promise<FindManyOptions<ModelTest>>
          >
        ).mockResolvedValueOnce(queryTypeOrmFixture);
        repositoryMock.findOne.mockResolvedValueOnce(modelTestFixture);

        result = await findTypeOrmServiceV2.findOne(queryTestFixture);
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

      it('should call repository.findOne()', () => {
        expect(repositoryMock.findOne).toHaveBeenCalledTimes(1);
        expect(repositoryMock.findOne).toHaveBeenCalledWith(
          queryTypeOrmFixture,
        );
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

    describe('when called and findQueryTypeOrmFromQueryBuilder.build() returns QueryBuilder<TModelDb> and repository.findOne() returns null', () => {
      let queryTestFixture: QueryTest;
      let modelTestFixture: null;
      let result: unknown;

      beforeAll(async () => {
        modelTestFixture = null;
        queryTestFixture = {
          fooValue: 'bar',
        };

        (isQueryBuilder as unknown as jest.Mock).mockReturnValueOnce(true);
        (
          queryTypeOrmFromQueryBuilderMock.build as jest.Mock<
            (
              query: QueryTest,
              context: QueryBuilder<ModelTest> & WhereExpressionBuilder,
            ) => Promise<QueryBuilder<ModelTest> & WhereExpressionBuilder>
          >
        ).mockResolvedValueOnce(queryBuilderMock);
        queryBuilderMock.getOne.mockResolvedValueOnce(modelTestFixture);

        result = await findTypeOrmServiceV2.findOne(queryTestFixture);
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

        (isQueryBuilder as unknown as jest.Mock).mockReturnValueOnce(true);
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

        result = await findTypeOrmServiceV2.findOne(queryTestFixture);
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
