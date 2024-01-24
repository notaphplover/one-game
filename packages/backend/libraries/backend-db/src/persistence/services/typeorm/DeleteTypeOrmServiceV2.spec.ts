import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../utils/typeorm/findManyOptionsToFindOptionsWhere');
jest.mock('../../utils/typeorm/isQueryBuilder');

import {
  FindManyOptions,
  FindOptionsWhere,
  QueryBuilder,
  Repository,
  WhereExpressionBuilder,
} from 'typeorm';

import { FindQueryTypeOrmFromQueryBuilder } from '../../builders/typeorm/FindQueryTypeOrmFromQueryBuilder';
import { findManyOptionsToFindOptionsWhere } from '../../utils/typeorm/findManyOptionsToFindOptionsWhere';
import { isQueryBuilder } from '../../utils/typeorm/isQueryBuilder';
import { DeleteTypeOrmServiceV2 } from './DeleteTypeOrmServiceV2';

interface ModelTest {
  foo: unknown;
}

interface QueryTest {
  fooValue: unknown;
}

describe(DeleteTypeOrmServiceV2.name, () => {
  let queryBuilderMock: jest.Mocked<
    QueryBuilder<ModelTest> & WhereExpressionBuilder
  >;
  let repositoryMock: jest.Mocked<Repository<ModelTest>>;
  let findQueryTypeOrmFromQueryBuilderMock: jest.Mocked<
    FindQueryTypeOrmFromQueryBuilder<ModelTest, QueryTest>
  >;
  let deleteTypeOrmServiceV2: DeleteTypeOrmServiceV2<ModelTest, QueryTest>;

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
      jest.Mocked<FindQueryTypeOrmFromQueryBuilder<ModelTest, QueryTest>>
    > as jest.Mocked<FindQueryTypeOrmFromQueryBuilder<ModelTest, QueryTest>>;

    deleteTypeOrmServiceV2 = new DeleteTypeOrmServiceV2(
      repositoryMock,
      findQueryTypeOrmFromQueryBuilderMock,
    );
  });

  describe('.delete', () => {
    describe('when called and findQueryTypeOrmFromQueryBuilder returns FindManyOptions<ModelTest>', () => {
      let queryFixture: QueryTest;
      let queryTypeOrmFixture: FindManyOptions<ModelTest>;
      let findOptionsWhereFixture: FindOptionsWhere<ModelTest>;

      beforeAll(async () => {
        queryFixture = {
          fooValue: 'foo-value',
        };

        findOptionsWhereFixture = {};

        queryTypeOrmFixture = {
          where: findOptionsWhereFixture,
        };

        (isQueryBuilder as unknown as jest.Mock).mockReturnValueOnce(false);
        (
          findQueryTypeOrmFromQueryBuilderMock.build as jest.Mock<
            (query: QueryTest) => Promise<FindManyOptions<ModelTest>>
          >
        ).mockResolvedValueOnce(queryTypeOrmFixture);

        (
          findManyOptionsToFindOptionsWhere as jest.Mock<
            typeof findManyOptionsToFindOptionsWhere
          >
        ).mockReturnValueOnce(findOptionsWhereFixture);

        await deleteTypeOrmServiceV2.delete(queryFixture);
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

      it('should call findManyOptionsToFindOptionsWhere()', () => {
        expect(findManyOptionsToFindOptionsWhere).toHaveBeenCalledTimes(1);
        expect(findManyOptionsToFindOptionsWhere).toHaveBeenCalledWith(
          queryTypeOrmFixture,
        );
      });

      it('should call repositoryMock.delete()', () => {
        expect(repositoryMock.delete).toHaveBeenCalledTimes(1);
        expect(repositoryMock.delete).toHaveBeenCalledWith(
          findOptionsWhereFixture,
        );
      });
    });

    describe('when called and findQueryTypeOrmFromQueryBuilder returns QueryBuilder<ModelTest>', () => {
      let queryFixture: QueryTest;

      beforeAll(async () => {
        queryFixture = {
          fooValue: 'foo-value',
        };

        (isQueryBuilder as unknown as jest.Mock).mockReturnValueOnce(true);
        (
          findQueryTypeOrmFromQueryBuilderMock.build as jest.Mock<
            (
              query: QueryTest,
              context: QueryBuilder<ModelTest> & WhereExpressionBuilder,
            ) => Promise<QueryBuilder<ModelTest> & WhereExpressionBuilder>
          >
        ).mockResolvedValueOnce(queryBuilderMock);

        await deleteTypeOrmServiceV2.delete(queryFixture);
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
