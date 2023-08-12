import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../utils/typeorm/findManyOptionsToFindOptionsWhere');
jest.mock('../../utils/typeorm/isQueryBuilder');

import { ConverterAsync } from '@cornie-js/backend-common';
import {
  FindManyOptions,
  FindOptionsWhere,
  QueryBuilder,
  Repository,
  UpdateQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { QueryToFindQueryTypeOrmConverter } from '../../converters/typeorm/QueryToFindQueryTypeOrmConverter';
import { findManyOptionsToFindOptionsWhere } from '../../utils/typeorm/findManyOptionsToFindOptionsWhere';
import { isQueryBuilder } from '../../utils/typeorm/isQueryBuilder';
import { UpdateTypeOrmService } from './UpdateTypeOrmService';

interface ModelTest {
  foo: unknown;
}

interface QueryTest {
  bar: unknown;
}

describe(UpdateTypeOrmService.name, () => {
  let queryBuilderMock: jest.Mocked<UpdateQueryBuilder<ModelTest>>;
  let repositoryMock: jest.Mocked<Repository<ModelTest>>;
  let updateQueryToFindQueryTypeOrmConverterMock: jest.Mocked<
    QueryToFindQueryTypeOrmConverter<ModelTest, QueryTest>
  >;
  let updateQueryToSetQueryTypeOrmConverterMock: jest.Mocked<
    ConverterAsync<QueryTest, QueryDeepPartialEntity<ModelTest>>
  >;

  let updateTypeOrmService: UpdateTypeOrmService<ModelTest, QueryTest>;

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
    updateQueryToFindQueryTypeOrmConverterMock = {
      convert: jest.fn(),
    } as unknown as jest.Mocked<
      QueryToFindQueryTypeOrmConverter<ModelTest, QueryTest>
    >;
    updateQueryToSetQueryTypeOrmConverterMock = {
      convert: jest.fn(),
    };

    updateTypeOrmService = new UpdateTypeOrmService(
      repositoryMock,
      updateQueryToFindQueryTypeOrmConverterMock,
      updateQueryToSetQueryTypeOrmConverterMock,
    );
  });

  describe('.update()', () => {
    describe('when called and updateQueryToFindQueryTypeOrmConverter returns FindManyOptions<TModelDb>', () => {
      let queryFixture: QueryTest;
      let findQueryTypeOrmFixture: FindManyOptions<ModelTest>;
      let findOptionsWhereFixture: FindOptionsWhere<ModelTest>;
      let setQueryTypeOrmFixture: QueryDeepPartialEntity<ModelTest>;

      beforeAll(async () => {
        queryFixture = {
          bar: 'sample',
        };

        findOptionsWhereFixture = {
          foo: 'sample-string',
        };

        findQueryTypeOrmFixture = {
          where: findOptionsWhereFixture,
        };

        setQueryTypeOrmFixture = {
          foo: 'sample-string-modified',
        };

        (isQueryBuilder as unknown as jest.Mock).mockReturnValueOnce(false);
        (
          updateQueryToFindQueryTypeOrmConverterMock.convert as jest.Mock<
            (query: QueryTest) => Promise<FindManyOptions<ModelTest>>
          >
        ).mockResolvedValueOnce(findQueryTypeOrmFixture);
        updateQueryToSetQueryTypeOrmConverterMock.convert.mockResolvedValueOnce(
          setQueryTypeOrmFixture,
        );

        (
          findManyOptionsToFindOptionsWhere as jest.Mock<
            typeof findManyOptionsToFindOptionsWhere
          >
        ).mockReturnValueOnce(findOptionsWhereFixture);

        await updateTypeOrmService.update(queryFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('shoud call updateQueryToFindQueryTypeOrmConverter.convert()', () => {
        expect(
          updateQueryToFindQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledTimes(1);
        expect(
          updateQueryToFindQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledWith(queryFixture, queryBuilderMock);
      });

      it('should call findManyOptionsToFindOptionsWhere()', () => {
        expect(findManyOptionsToFindOptionsWhere).toHaveBeenCalledTimes(1);
        expect(findManyOptionsToFindOptionsWhere).toHaveBeenCalledWith(
          findQueryTypeOrmFixture,
        );
      });

      it('shoud call updateQueryToSetQueryTypeOrmConverter.convert()', () => {
        expect(
          updateQueryToSetQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledTimes(1);
        expect(
          updateQueryToSetQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledWith(queryFixture);
      });

      it('shoud call repository.update()', () => {
        expect(repositoryMock.update).toHaveBeenCalledTimes(1);
        expect(repositoryMock.update).toHaveBeenCalledWith(
          findOptionsWhereFixture,
          setQueryTypeOrmFixture,
        );
      });
    });

    describe('when called and updateQueryToFindQueryTypeOrmConverter returns QueryBuilder<TModelDb>', () => {
      let queryFixture: QueryTest;
      let setQueryTypeOrmFixture: QueryDeepPartialEntity<ModelTest>;

      beforeAll(async () => {
        queryFixture = {
          bar: 'sample',
        };

        setQueryTypeOrmFixture = {
          foo: 'sample-string-modified',
        };

        (isQueryBuilder as unknown as jest.Mock).mockReturnValueOnce(true);
        (
          updateQueryToFindQueryTypeOrmConverterMock.convert as jest.Mock<
            (
              query: QueryTest,
              context: QueryBuilder<ModelTest> & WhereExpressionBuilder,
            ) => Promise<QueryBuilder<ModelTest> & WhereExpressionBuilder>
          >
        ).mockResolvedValueOnce(queryBuilderMock);
        updateQueryToSetQueryTypeOrmConverterMock.convert.mockResolvedValueOnce(
          setQueryTypeOrmFixture,
        );

        await updateTypeOrmService.update(queryFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('shoud call updateQueryToFindQueryTypeOrmConverter.convert()', () => {
        expect(
          updateQueryToFindQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledTimes(1);
        expect(
          updateQueryToFindQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledWith(queryFixture, queryBuilderMock);
      });

      it('shoud call updateQueryToSetQueryTypeOrmConverter.convert()', () => {
        expect(
          updateQueryToSetQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledTimes(1);
        expect(
          updateQueryToSetQueryTypeOrmConverterMock.convert,
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
