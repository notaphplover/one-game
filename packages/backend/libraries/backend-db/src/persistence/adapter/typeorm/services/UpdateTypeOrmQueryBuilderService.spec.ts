import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../utils/unwrapTypeOrmTransactionContext');

import { Builder, BuilderAsync } from '@cornie-js/backend-common';
import {
  ObjectLiteral,
  QueryBuilder,
  QueryRunner,
  Repository,
  UpdateQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { TransactionContext } from '../../../application/models/TransactionContext';
import { unwrapTypeOrmTransactionContext } from '../utils/unwrapTypeOrmTransactionContext';
import { UpdateTypeOrmQueryBuilderService } from './UpdateTypeOrmQueryBuilderService';

interface ModelTest {
  foo: unknown;
}

interface QueryTest {
  bar: unknown;
}

describe(UpdateTypeOrmQueryBuilderService.name, () => {
  let queryBuilderMock: jest.Mocked<UpdateQueryBuilder<ModelTest>>;
  let repositoryMock: jest.Mocked<Repository<ModelTest>>;
  let findQueryTypeOrmFromUpdateQueryBuilderMock: jest.Mocked<
    | Builder<
        QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
        [QueryTest, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
      >
    | BuilderAsync<
        QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
        [QueryTest, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
      >
  >;
  let setQueryTypeOrmFromUpdateQueryBuilderMock: jest.Mocked<
    BuilderAsync<QueryDeepPartialEntity<ModelTest>, [QueryTest]>
  >;

  let updateTypeOrmService: UpdateTypeOrmQueryBuilderService<
    ModelTest,
    QueryTest
  >;

  beforeAll(() => {
    queryBuilderMock = Object.assign(
      Object.create(UpdateQueryBuilder.prototype) as QueryBuilder<ModelTest>,
      {
        execute: jest.fn(),
        set: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
      } as Partial<jest.Mocked<UpdateQueryBuilder<ModelTest>>> as jest.Mocked<
        UpdateQueryBuilder<ModelTest>
      >,
    );
    repositoryMock = {
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
      update: jest.fn(),
    } as Partial<jest.Mocked<Repository<ModelTest>>> as jest.Mocked<
      Repository<ModelTest>
    >;
    findQueryTypeOrmFromUpdateQueryBuilderMock = {
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
    setQueryTypeOrmFromUpdateQueryBuilderMock = {
      build: jest.fn(),
    };

    updateTypeOrmService = new UpdateTypeOrmQueryBuilderService(
      repositoryMock,
      findQueryTypeOrmFromUpdateQueryBuilderMock,
      setQueryTypeOrmFromUpdateQueryBuilderMock,
    );
  });

  describe('.update()', () => {
    let queryFixture: QueryTest;
    let transactionContextFixture: TransactionContext | undefined;

    beforeAll(() => {
      queryFixture = {
        bar: 'sample',
      };

      transactionContextFixture = Symbol() as unknown as
        | TransactionContext
        | undefined;
    });

    describe('when called and findQueryTypeOrmFromUpdateQueryBuilder returns QueryBuilder<TModelDb>', () => {
      let queryRunnerFixture: QueryRunner;
      let setQueryTypeOrmFixture: QueryDeepPartialEntity<ModelTest>;

      beforeAll(async () => {
        queryRunnerFixture = Symbol() as unknown as QueryRunner;

        setQueryTypeOrmFixture = {
          foo: 'sample-string-modified',
        };

        (
          unwrapTypeOrmTransactionContext as jest.Mock<
            typeof unwrapTypeOrmTransactionContext
          >
        ).mockReturnValueOnce(queryRunnerFixture);
        (
          findQueryTypeOrmFromUpdateQueryBuilderMock.build as jest.Mock<
            (
              query: QueryTest,
              context: QueryBuilder<ModelTest> & WhereExpressionBuilder,
            ) => Promise<QueryBuilder<ModelTest> & WhereExpressionBuilder>
          >
        ).mockResolvedValueOnce(queryBuilderMock);
        setQueryTypeOrmFromUpdateQueryBuilderMock.build.mockResolvedValueOnce(
          setQueryTypeOrmFixture,
        );

        await updateTypeOrmService.update(
          queryFixture,
          transactionContextFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('shoud call findQueryTypeOrmFromUpdateQueryBuilder.build()', () => {
        expect(
          findQueryTypeOrmFromUpdateQueryBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          findQueryTypeOrmFromUpdateQueryBuilderMock.build,
        ).toHaveBeenCalledWith(queryFixture, queryBuilderMock);
      });

      it('shoud call setQueryTypeOrmFromUpdateQueryBuilder.build()', () => {
        expect(
          setQueryTypeOrmFromUpdateQueryBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          setQueryTypeOrmFromUpdateQueryBuilderMock.build,
        ).toHaveBeenCalledWith(queryFixture);
      });

      it('shoud call queryBuilder.set()', () => {
        expect(queryBuilderMock.set).toHaveBeenCalledTimes(1);
        expect(queryBuilderMock.set).toHaveBeenCalledWith(
          setQueryTypeOrmFixture,
        );
      });

      it('shoud call queryBuilder.execute()', () => {
        expect(queryBuilderMock.execute).toHaveBeenCalledTimes(1);
        expect(queryBuilderMock.execute).toHaveBeenCalledWith();
      });
    });
  });
});
