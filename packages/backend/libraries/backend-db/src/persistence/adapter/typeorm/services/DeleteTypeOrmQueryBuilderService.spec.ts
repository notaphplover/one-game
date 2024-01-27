import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder, BuilderAsync } from '@cornie-js/backend-common';
import {
  ObjectLiteral,
  QueryBuilder,
  Repository,
  WhereExpressionBuilder,
} from 'typeorm';

import { DeleteTypeOrmQueryBuilderService } from './DeleteTypeOrmQueryBuilderService';

interface ModelTest {
  foo: unknown;
}

interface QueryTest {
  fooValue: unknown;
}

describe(DeleteTypeOrmQueryBuilderService.name, () => {
  let queryBuilderMock: jest.Mocked<
    QueryBuilder<ModelTest> & WhereExpressionBuilder
  >;
  let repositoryMock: jest.Mocked<Repository<ModelTest>>;
  let findQueryTypeOrmFromQueryBuilderMock: jest.Mocked<
    | Builder<
        QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
        [QueryTest, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
      >
    | BuilderAsync<
        QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
        [QueryTest, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
      >
  >;
  let deleteTypeOrmQueryBuilderService: DeleteTypeOrmQueryBuilderService<
    ModelTest,
    QueryTest
  >;

  beforeAll(() => {
    queryBuilderMock = Object.assign(
      Object.create(QueryBuilder.prototype) as QueryBuilder<ModelTest>,
      {
        delete: jest.fn().mockReturnThis(),
        execute: jest.fn(),
      } as Partial<
        jest.Mocked<QueryBuilder<ModelTest> & WhereExpressionBuilder>
      > as jest.Mocked<QueryBuilder<ModelTest> & WhereExpressionBuilder>,
    );

    repositoryMock = {
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
      delete: jest.fn(),
    } as Partial<jest.Mocked<Repository<ModelTest>>> as jest.Mocked<
      Repository<ModelTest>
    >;

    findQueryTypeOrmFromQueryBuilderMock = {
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

    deleteTypeOrmQueryBuilderService = new DeleteTypeOrmQueryBuilderService(
      repositoryMock,
      findQueryTypeOrmFromQueryBuilderMock,
    );
  });

  describe('.delete', () => {
    describe('when called and findQueryTypeOrmFromQueryBuilder returns QueryBuilder<ModelTest>', () => {
      let queryFixture: QueryTest;

      beforeAll(async () => {
        queryFixture = {
          fooValue: 'foo-value',
        };

        (
          findQueryTypeOrmFromQueryBuilderMock.build as jest.Mock<
            (
              query: QueryTest,
              context: QueryBuilder<ModelTest> & WhereExpressionBuilder,
            ) => Promise<QueryBuilder<ModelTest> & WhereExpressionBuilder>
          >
        ).mockResolvedValueOnce(queryBuilderMock);

        await deleteTypeOrmQueryBuilderService.delete(queryFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call repository.createQueryBuilder()', () => {
        expect(repositoryMock.createQueryBuilder).toHaveBeenCalledTimes(1);
        expect(repositoryMock.createQueryBuilder).toHaveBeenCalledWith();
      });

      it('should call queryBuilder.delete()', () => {
        expect(queryBuilderMock.delete).toHaveBeenCalledTimes(1);
        expect(queryBuilderMock.delete).toHaveBeenCalledWith();
      });

      it('should call findQueryTypeOrmFromQueryBuilder.build()', () => {
        expect(
          findQueryTypeOrmFromQueryBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(findQueryTypeOrmFromQueryBuilderMock.build).toHaveBeenCalledWith(
          queryFixture,
          queryBuilderMock,
        );
      });

      it('should call queryBuilder.execute()', () => {
        expect(queryBuilderMock.execute).toHaveBeenCalledTimes(1);
        expect(queryBuilderMock.execute).toHaveBeenCalledWith();
      });
    });
  });
});
