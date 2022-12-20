import { beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Converter, ConverterAsync } from '@one-game-js/backend-common';
import { ArrayOrObject, Client, QueryOptions, types } from 'cassandra-driver';

import { InsertOneEntityCassandraDriverAdapter } from './InsertOneEntityCassandraDriverAdapter';

interface ModelTest {
  bar: string;
}

interface QueryTest {
  foo: string;
}

describe(InsertOneEntityCassandraDriverAdapter.name, () => {
  let clientMock: jest.Mocked<Client>;
  let queryToQueryExecuteParametersConverterMock: jest.Mocked<
    Converter<
      QueryTest,
      [string, ArrayOrObject | undefined, QueryOptions | undefined]
    >
  >;
  let rowToEntityConverterMock: ConverterAsync<types.Row, ModelTest>;

  let insertOneEntityCassandraDriverAdapter: InsertOneEntityCassandraDriverAdapter<
    QueryTest,
    ModelTest
  >;

  beforeAll(() => {
    clientMock = {
      execute: jest.fn() as jest.Mock<Client['execute']> & Client['execute'],
    } as Partial<jest.Mocked<Client>> as jest.Mocked<Client>;

    queryToQueryExecuteParametersConverterMock = {
      convert: jest.fn(),
    };

    rowToEntityConverterMock = {
      convert: jest.fn<ConverterAsync<types.Row, ModelTest>['convert']>(),
    };

    insertOneEntityCassandraDriverAdapter =
      new InsertOneEntityCassandraDriverAdapter(
        clientMock,
        queryToQueryExecuteParametersConverterMock,
        rowToEntityConverterMock,
      );
  });

  describe('.call', () => {
    let queryTestFixture: QueryTest;

    beforeAll(() => {
      queryTestFixture = {
        foo: 'foo',
      };
    });

    describe('when called, and a null first result is obtained', () => {
      let queryExecutionParamsFixture: [
        string,
        ArrayOrObject | undefined,
        QueryOptions | undefined,
      ];

      let resultMock: jest.Mocked<types.ResultSet>;

      let result: unknown;

      beforeAll(async () => {
        queryExecutionParamsFixture = [
          'stringifiedQueryFixture',
          { [Symbol()]: Symbol() },
          {},
        ];

        queryToQueryExecuteParametersConverterMock.convert.mockReturnValueOnce(
          queryExecutionParamsFixture,
        );

        resultMock = {
          first: jest
            .fn<() => types.Row | null>()
            .mockReturnValueOnce(null) as jest.Mock<() => types.Row>,
        } as Partial<
          jest.Mocked<types.ResultSet>
        > as jest.Mocked<types.ResultSet>;

        (
          clientMock.execute as unknown as jest.Mock<
            (...params: unknown[]) => Promise<types.ResultSet>
          >
        ).mockResolvedValueOnce(resultMock);

        try {
          await insertOneEntityCassandraDriverAdapter.call(queryTestFixture);
        } catch (error: unknown) {
          result = error;
        }
      });

      it('should call queryToQueryExecuteParametersConverter.convert()', () => {
        expect(
          queryToQueryExecuteParametersConverterMock.convert,
        ).toHaveBeenCalledTimes(1);
        expect(
          queryToQueryExecuteParametersConverterMock.convert,
        ).toHaveBeenCalledWith(queryTestFixture);
      });

      it('should call client.execute()', () => {
        expect(clientMock.execute).toHaveBeenCalledTimes(1);
        expect(clientMock.execute).toHaveBeenCalledWith(
          ...queryExecutionParamsFixture,
        );
      });

      it('should call result.first()', () => {
        expect(resultMock.first).toHaveBeenCalledTimes(1);
        expect(resultMock.first).toHaveBeenCalledWith();
      });

      it('should throw an Error', () => {
        const expectedErrorProperties: Partial<Error> = {
          message: 'No entity was created!',
        };

        expect(result).toBeInstanceOf(Error);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });
  });
});
