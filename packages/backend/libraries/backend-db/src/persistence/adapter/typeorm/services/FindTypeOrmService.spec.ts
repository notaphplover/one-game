import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../utils/isQueryBuilder');

import { Builder, BuilderAsync } from '@cornie-js/backend-common';
import {
  FindManyOptions,
  QueryBuilder,
  Repository,
  SelectQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';

import { FindQueryTypeOrmFromQueryBuilder } from '../builders/FindQueryTypeOrmFromQueryBuilder';
import { isQueryBuilder } from '../utils/isQueryBuilder';
import { FindTypeOrmService } from './FindTypeOrmService';

interface ModelTest {
  foo: string;
}

interface QueryTest {
  fooValue: string;
}

describe(FindTypeOrmService.name, () => {
  let queryBuilderMock: jest.Mocked<SelectQueryBuilder<ModelTest>>;
  let repositoryMock: jest.Mocked<Repository<ModelTest>>;
  let queryTypeOrmFromQueryBuilderMock: jest.Mocked<
    FindQueryTypeOrmFromQueryBuilder<ModelTest, QueryTest>
  >;
  let modelFromModelDbBuilderMock: jest.Mocked<
    Builder<ModelTest, [ModelTest]> | BuilderAsync<ModelTest, [ModelTest]>
  >;

  let findTypeOrmService: FindTypeOrmService<ModelTest, ModelTest, QueryTest>;

  beforeAll(() => {
    queryBuilderMock = {
      getMany: jest.fn(),
      getOne: jest.fn(),
      select: jest.fn().mockReturnThis(),
      setFindOptions: jest.fn().mockReturnThis(),
    } as Partial<jest.Mocked<SelectQueryBuilder<ModelTest>>> as jest.Mocked<
      SelectQueryBuilder<ModelTest>
    >;

    repositoryMock = {
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
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

    findTypeOrmService = new FindTypeOrmService(
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
        queryBuilderMock.getMany.mockResolvedValueOnce(modelTestFixtures);

        result = await findTypeOrmService.find(queryTestFixture);
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
        queryBuilderMock.getMany.mockResolvedValueOnce(modelTestFixtures);

        await findTypeOrmService.find(queryTestFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call queryBuilder.setFindOptions()', () => {
        const expected: FindManyOptions<ModelTest> = {
          ...queryTypeOrmFixture,
          loadEagerRelations: true,
        };

        expect(queryBuilderMock.setFindOptions).toHaveBeenCalledTimes(1);
        expect(queryBuilderMock.setFindOptions).toHaveBeenCalledWith(expected);
      });

      it('should call queryBuilder.getMany()', () => {
        expect(queryBuilderMock.getMany).toHaveBeenCalledTimes(1);
        expect(queryBuilderMock.getMany).toHaveBeenCalledWith();
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

        await findTypeOrmService.find(queryTestFixture);
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
    describe('when called and findQueryTypeOrmFromQueryBuilder.build() returns FindManyOptions<TModelDb> and queryBuilder.getOne() returns null', () => {
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
        queryBuilderMock.getOne.mockResolvedValueOnce(modelTestFixture);

        result = await findTypeOrmService.findOne(queryTestFixture);
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

      it('should call queryBuilder.setFindOptions()', () => {
        const expected: FindManyOptions<ModelTest> = {
          ...queryTypeOrmFixture,
          loadEagerRelations: true,
        };

        expect(queryBuilderMock.setFindOptions).toHaveBeenCalledTimes(1);
        expect(queryBuilderMock.setFindOptions).toHaveBeenCalledWith(expected);
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
        queryBuilderMock.getOne.mockResolvedValueOnce(modelTestFixture);

        result = await findTypeOrmService.findOne(queryTestFixture);
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

      it('should call queryBuilder.setFindOptions()', () => {
        const expected: FindManyOptions<ModelTest> = {
          ...queryTypeOrmFixture,
          loadEagerRelations: true,
        };

        expect(queryBuilderMock.setFindOptions).toHaveBeenCalledTimes(1);
        expect(queryBuilderMock.setFindOptions).toHaveBeenCalledWith(expected);
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

    describe('when called and findQueryTypeOrmFromQueryBuilder.build() returns QueryBuilder<TModelDb> and queryBuilder.getOne() returns null', () => {
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

        result = await findTypeOrmService.findOne(queryTestFixture);
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

    describe('when called and findQueryTypeOrmFromQueryBuilder.build() returns QueryBuilder<TModelDb> and queryBuilder.getOne() returns a TModelDb', () => {
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

        result = await findTypeOrmService.findOne(queryTestFixture);
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
