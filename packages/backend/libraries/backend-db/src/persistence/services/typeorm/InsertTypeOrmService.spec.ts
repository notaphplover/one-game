import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../utils/typeorm/isQueryBuilder');

import { Converter, ConverterAsync } from '@cornie-js/backend-common';
import { FindManyOptions, InsertResult, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { isQueryBuilder } from '../../utils/typeorm/isQueryBuilder';
import { InsertTypeOrmService } from './InsertTypeOrmService';

interface ModelTest {
  foo: unknown;
}

interface QueryTest {
  bar: unknown;
}

describe(InsertTypeOrmService.name, () => {
  let repositoryMock: jest.Mocked<Repository<ModelTest>>;
  let modelDbToModelConverterMock: jest.Mocked<
    Converter<ModelTest, ModelTest> | ConverterAsync<ModelTest, ModelTest>
  >;
  let setQueryToSetQueryTypeOrmConverterMock: jest.Mocked<
    | Converter<
        QueryTest,
        QueryDeepPartialEntity<ModelTest> | QueryDeepPartialEntity<ModelTest>[]
      >
    | ConverterAsync<
        QueryTest,
        QueryDeepPartialEntity<ModelTest> | QueryDeepPartialEntity<ModelTest>[]
      >
  >;

  let insertTypeOrmService: InsertTypeOrmService<
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

    modelDbToModelConverterMock = {
      convert: jest.fn(),
    } as jest.Mocked<
      Converter<ModelTest, ModelTest> | ConverterAsync<ModelTest, ModelTest>
    >;
    setQueryToSetQueryTypeOrmConverterMock = {
      convert: jest.fn(),
    } as jest.Mocked<
      | Converter<
          QueryTest,
          | QueryDeepPartialEntity<ModelTest>
          | QueryDeepPartialEntity<ModelTest>[]
        >
      | ConverterAsync<
          QueryTest,
          | QueryDeepPartialEntity<ModelTest>
          | QueryDeepPartialEntity<ModelTest>[]
        >
    >;

    insertTypeOrmService = new InsertTypeOrmService(
      repositoryMock,
      modelDbToModelConverterMock,
      setQueryToSetQueryTypeOrmConverterMock,
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
          modelDbToModelConverterMock as jest.Mocked<
            ConverterAsync<ModelTest, ModelTest>
          >
        ).convert.mockResolvedValueOnce(modelFixture);
        (
          setQueryToSetQueryTypeOrmConverterMock as jest.Mocked<
            ConverterAsync<
              QueryTest,
              | QueryDeepPartialEntity<ModelTest>
              | QueryDeepPartialEntity<ModelTest>[]
            >
          >
        ).convert.mockResolvedValueOnce(typeOrmQueryFixture);

        result = await insertTypeOrmService.insertOne(queryFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call queryToTypeOrmQueryConverterMock.convert()', () => {
        expect(
          setQueryToSetQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledTimes(1);
        expect(
          setQueryToSetQueryTypeOrmConverterMock.convert,
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

      it('should call modelDbToModelConverter.convert()', () => {
        expect(modelDbToModelConverterMock.convert).toHaveBeenCalledTimes(1);
        expect(modelDbToModelConverterMock.convert).toHaveBeenCalledWith(
          modelFixture,
        );
      });

      it('should return an ModelTest', () => {
        expect(result).toBe(modelFixture);
      });
    });

    describe('when called, and insertQueryToInsertQueryTypeOrmConverter.convert() returns a QueryDeepPartialEntity[] with one element', () => {
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
          modelDbToModelConverterMock as jest.Mocked<
            ConverterAsync<ModelTest, ModelTest>
          >
        ).convert.mockResolvedValueOnce(modelFixture);
        (
          setQueryToSetQueryTypeOrmConverterMock as jest.Mocked<
            ConverterAsync<
              QueryTest,
              | QueryDeepPartialEntity<ModelTest>
              | QueryDeepPartialEntity<ModelTest>[]
            >
          >
        ).convert.mockResolvedValueOnce([typeOrmQueryFixture]);

        await insertTypeOrmService.insertOne(queryFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call repositoryMock.insert()', () => {
        expect(repositoryMock.insert).toHaveBeenCalledTimes(1);
        expect(repositoryMock.insert).toHaveBeenCalledWith(typeOrmQueryFixture);
      });
    });

    describe('when called, and insertQueryToInsertQueryTypeOrmConverter.convert() returns a QueryDeepPartialEntity[] with not one element', () => {
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
          modelDbToModelConverterMock as jest.Mocked<
            ConverterAsync<ModelTest, ModelTest>
          >
        ).convert.mockResolvedValueOnce(modelFixture);
        (
          setQueryToSetQueryTypeOrmConverterMock as jest.Mocked<
            ConverterAsync<
              QueryTest,
              | QueryDeepPartialEntity<ModelTest>
              | QueryDeepPartialEntity<ModelTest>[]
            >
          >
        ).convert.mockResolvedValueOnce([]);

        try {
          await insertTypeOrmService.insertOne(queryFixture);
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
    describe('when called, and insertQueryToInsertQueryTypeOrmConverter.convert() returns a QueryDeepPartialEntity[]', () => {
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
          modelDbToModelConverterMock as jest.Mocked<
            ConverterAsync<ModelTest, ModelTest>
          >
        ).convert.mockResolvedValueOnce(modelFixture);
        (
          setQueryToSetQueryTypeOrmConverterMock as jest.Mocked<
            ConverterAsync<
              QueryTest,
              | QueryDeepPartialEntity<ModelTest>
              | QueryDeepPartialEntity<ModelTest>[]
            >
          >
        ).convert.mockResolvedValueOnce(typeOrmQueryFixture);

        result = await insertTypeOrmService.insertMany(queryFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call queryToTypeOrmQueryConverterMock.convert()', () => {
        expect(
          setQueryToSetQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledTimes(1);
        expect(
          setQueryToSetQueryTypeOrmConverterMock.convert,
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

      it('should call modelDbToModelConverter.convert()', () => {
        expect(modelDbToModelConverterMock.convert).toHaveBeenCalledTimes(1);
        expect(modelDbToModelConverterMock.convert).toHaveBeenCalledWith(
          modelFixture,
        );
      });

      it('should return an ModelTest', () => {
        expect(result).toStrictEqual([modelFixture]);
      });
    });

    describe('when called, and insertQueryToInsertQueryTypeOrmConverter.convert() returns a QueryDeepPartialEntity', () => {
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
          modelDbToModelConverterMock as jest.Mocked<
            ConverterAsync<ModelTest, ModelTest>
          >
        ).convert.mockResolvedValueOnce(modelFixture);
        (
          setQueryToSetQueryTypeOrmConverterMock as jest.Mocked<
            ConverterAsync<
              QueryTest,
              | QueryDeepPartialEntity<ModelTest>
              | QueryDeepPartialEntity<ModelTest>[]
            >
          >
        ).convert.mockResolvedValueOnce(typeOrmQueryFixture);

        result = await insertTypeOrmService.insertMany(queryFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call queryToTypeOrmQueryConverterMock.convert()', () => {
        expect(
          setQueryToSetQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledTimes(1);
        expect(
          setQueryToSetQueryTypeOrmConverterMock.convert,
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

      it('should call modelDbToModelConverter.convert()', () => {
        expect(modelDbToModelConverterMock.convert).toHaveBeenCalledTimes(1);
        expect(modelDbToModelConverterMock.convert).toHaveBeenCalledWith(
          modelFixture,
        );
      });

      it('should return an ModelTest', () => {
        expect(result).toStrictEqual([modelFixture]);
      });
    });
  });
});
