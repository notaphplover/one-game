import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../utils/typeorm/isQueryBuilder');

import { Builder, BuilderAsync } from '@cornie-js/backend-common';
import { FindManyOptions, InsertResult, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { isQueryBuilder } from '../../utils/typeorm/isQueryBuilder';
import { InsertTypeOrmServiceV2 } from './InsertTypeOrmServiceV2';

interface ModelTest {
  foo: unknown;
}

interface QueryTest {
  bar: unknown;
}

describe(InsertTypeOrmServiceV2.name, () => {
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

  let insertTypeOrmServiceV2: InsertTypeOrmServiceV2<
    ModelTest,
    ModelTest,
    QueryTest
  >;

  beforeAll(() => {
    repositoryMock = {
      find: jest.fn(),
      insert: jest.fn(),
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

    insertTypeOrmServiceV2 = new InsertTypeOrmServiceV2(
      repositoryMock,
      modelFromModelDbBuilderMock,
      setQueryTypeOrmFromSetQueryBuilderMock,
    );
  });

  describe('.insertOne()', () => {
    describe('when called', () => {
      let modelFixture: ModelTest;
      let queryFixture: QueryTest;
      let insertResultFixture: InsertResult;
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

        typeOrmQueryFixture = {};

        (isQueryBuilder as unknown as jest.Mock).mockReturnValueOnce(false);
        repositoryMock.find.mockResolvedValueOnce([modelFixture]);
        repositoryMock.insert.mockResolvedValueOnce(insertResultFixture);
        (
          modelFromModelDbBuilderMock as jest.Mocked<
            BuilderAsync<ModelTest, [ModelTest]>
          >
        ).build.mockResolvedValueOnce(modelFixture);
        (
          setQueryTypeOrmFromSetQueryBuilderMock as jest.Mocked<
            BuilderAsync<
              | QueryDeepPartialEntity<ModelTest>
              | QueryDeepPartialEntity<ModelTest>[],
              [QueryTest]
            >
          >
        ).build.mockResolvedValueOnce(typeOrmQueryFixture);

        result = await insertTypeOrmServiceV2.insertOne(queryFixture);
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
        ).toHaveBeenCalledWith(queryFixture);
      });

      it('should call repositoryMock.insert()', () => {
        expect(repositoryMock.insert).toHaveBeenCalledTimes(1);
        expect(repositoryMock.insert).toHaveBeenCalledWith(typeOrmQueryFixture);
      });

      it('should call repositoryMock.find()', () => {
        const expected: FindManyOptions<ModelTest> = {
          where: insertResultFixture.identifiers,
        };

        expect(repositoryMock.find).toHaveBeenCalledTimes(1);
        expect(repositoryMock.find).toHaveBeenCalledWith(expected);
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
      let typeOrmQueryFixture: QueryDeepPartialEntity<ModelTest>;

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

        typeOrmQueryFixture = {};

        (isQueryBuilder as unknown as jest.Mock).mockReturnValueOnce(false);
        repositoryMock.find.mockResolvedValueOnce([modelFixture]);
        repositoryMock.insert.mockResolvedValueOnce(insertResultFixture);
        (
          modelFromModelDbBuilderMock as jest.Mocked<
            BuilderAsync<ModelTest, [ModelTest]>
          >
        ).build.mockResolvedValueOnce(modelFixture);
        (
          setQueryTypeOrmFromSetQueryBuilderMock as jest.Mocked<
            BuilderAsync<
              | QueryDeepPartialEntity<ModelTest>
              | QueryDeepPartialEntity<ModelTest>[],
              [QueryTest]
            >
          >
        ).build.mockResolvedValueOnce([typeOrmQueryFixture]);

        await insertTypeOrmServiceV2.insertOne(queryFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call repositoryMock.insert()', () => {
        expect(repositoryMock.insert).toHaveBeenCalledTimes(1);
        expect(repositoryMock.insert).toHaveBeenCalledWith(typeOrmQueryFixture);
      });
    });

    describe('when called, and setQueryTypeOrmFromSetQueryBuilder.build() returns a QueryDeepPartialEntity[] with not one element', () => {
      let modelFixture: ModelTest;
      let queryFixture: QueryTest;
      let insertResultFixture: InsertResult;

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

        (isQueryBuilder as unknown as jest.Mock).mockReturnValueOnce(false);
        repositoryMock.find.mockResolvedValueOnce([modelFixture]);
        repositoryMock.insert.mockResolvedValueOnce(insertResultFixture);
        (
          modelFromModelDbBuilderMock as jest.Mocked<
            BuilderAsync<ModelTest, [ModelTest]>
          >
        ).build.mockResolvedValueOnce(modelFixture);
        (
          setQueryTypeOrmFromSetQueryBuilderMock as jest.Mocked<
            BuilderAsync<
              | QueryDeepPartialEntity<ModelTest>
              | QueryDeepPartialEntity<ModelTest>[],
              [QueryTest]
            >
          >
        ).build.mockResolvedValueOnce([]);

        try {
          await insertTypeOrmServiceV2.insertOne(queryFixture);
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should throw an error', () => {
        const expectedErrorProperties: Partial<Error> = {
          message:
            'Expected a single TypeORM insert query when called .insertOne()',
        };

        expect(result).toBeInstanceOf(Error);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });
  });

  describe('.insertMany()', () => {
    describe('when called, and setQueryTypeOrmFromSetQueryBuilder.build() returns a QueryDeepPartialEntity[]', () => {
      let modelFixture: ModelTest;
      let queryFixture: QueryTest;
      let insertResultFixture: InsertResult;
      let typeOrmQueryFixture: QueryDeepPartialEntity<ModelTest>[];

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

        typeOrmQueryFixture = [{}];

        (isQueryBuilder as unknown as jest.Mock).mockReturnValueOnce(false);
        repositoryMock.find.mockResolvedValueOnce([modelFixture]);
        repositoryMock.insert.mockResolvedValueOnce(insertResultFixture);
        (
          modelFromModelDbBuilderMock as jest.Mocked<
            BuilderAsync<ModelTest, [ModelTest]>
          >
        ).build.mockResolvedValueOnce(modelFixture);
        (
          setQueryTypeOrmFromSetQueryBuilderMock as jest.Mocked<
            BuilderAsync<
              | QueryDeepPartialEntity<ModelTest>
              | QueryDeepPartialEntity<ModelTest>[],
              [QueryTest]
            >
          >
        ).build.mockResolvedValueOnce(typeOrmQueryFixture);

        result = await insertTypeOrmServiceV2.insertMany(queryFixture);
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
        ).toHaveBeenCalledWith(queryFixture);
      });

      it('should call repositoryMock.insert()', () => {
        expect(repositoryMock.insert).toHaveBeenCalledTimes(1);
        expect(repositoryMock.insert).toHaveBeenCalledWith(typeOrmQueryFixture);
      });

      it('should call repositoryMock.find()', () => {
        const expected: FindManyOptions<ModelTest> = {
          where: insertResultFixture.identifiers,
        };

        expect(repositoryMock.find).toHaveBeenCalledTimes(1);
        expect(repositoryMock.find).toHaveBeenCalledWith(expected);
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

        typeOrmQueryFixture = {};

        (isQueryBuilder as unknown as jest.Mock).mockReturnValueOnce(false);
        repositoryMock.find.mockResolvedValueOnce([modelFixture]);
        repositoryMock.insert.mockResolvedValueOnce(insertResultFixture);
        (
          modelFromModelDbBuilderMock as jest.Mocked<
            BuilderAsync<ModelTest, [ModelTest]>
          >
        ).build.mockResolvedValueOnce(modelFixture);
        (
          setQueryTypeOrmFromSetQueryBuilderMock as jest.Mocked<
            BuilderAsync<
              | QueryDeepPartialEntity<ModelTest>
              | QueryDeepPartialEntity<ModelTest>[],
              [QueryTest]
            >
          >
        ).build.mockResolvedValueOnce(typeOrmQueryFixture);

        result = await insertTypeOrmServiceV2.insertMany(queryFixture);
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
        ).toHaveBeenCalledWith(queryFixture);
      });

      it('should call repositoryMock.insert()', () => {
        expect(repositoryMock.insert).toHaveBeenCalledTimes(1);
        expect(repositoryMock.insert).toHaveBeenCalledWith([
          typeOrmQueryFixture,
        ]);
      });

      it('should call repositoryMock.find()', () => {
        const expected: FindManyOptions<ModelTest> = {
          where: insertResultFixture.identifiers,
        };

        expect(repositoryMock.find).toHaveBeenCalledTimes(1);
        expect(repositoryMock.find).toHaveBeenCalledWith(expected);
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
