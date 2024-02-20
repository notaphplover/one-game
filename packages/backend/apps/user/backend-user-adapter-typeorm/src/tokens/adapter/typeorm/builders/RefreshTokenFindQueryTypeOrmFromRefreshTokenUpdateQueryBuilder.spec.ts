import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder } from '@cornie-js/backend-common';
import { RefreshTokenUpdateQuery } from '@cornie-js/backend-user-domain/tokens';
import { RefreshTokenUpdateQueryFixtures } from '@cornie-js/backend-user-domain/tokens/fixtures';
import { ObjectLiteral, QueryBuilder, WhereExpressionBuilder } from 'typeorm';

import { RefreshTokenFindQueryTypeOrmFromRefreshTokenUpdateQueryBuilder } from './RefreshTokenFindQueryTypeOrmFromRefreshTokenUpdateQueryBuilder';

describe(
  RefreshTokenFindQueryTypeOrmFromRefreshTokenUpdateQueryBuilder.name,
  () => {
    let refreshTokenFindQueryTypeOrmFromRefreshTokenFindQueryBuilderMock: jest.Mocked<
      Builder<
        QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
        [
          RefreshTokenUpdateQuery,
          QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
        ]
      >
    >;

    let refreshTokenFindQueryTypeOrmFromRefreshTokenUpdateQueryBuilder: RefreshTokenFindQueryTypeOrmFromRefreshTokenUpdateQueryBuilder;

    beforeAll(() => {
      refreshTokenFindQueryTypeOrmFromRefreshTokenFindQueryBuilderMock = {
        build: jest.fn(),
      };

      refreshTokenFindQueryTypeOrmFromRefreshTokenUpdateQueryBuilder =
        new RefreshTokenFindQueryTypeOrmFromRefreshTokenUpdateQueryBuilder(
          refreshTokenFindQueryTypeOrmFromRefreshTokenFindQueryBuilderMock,
        );
    });

    describe('.build', () => {
      describe('when called', () => {
        let refreshTokenUpdateQueryFixture: RefreshTokenUpdateQuery;
        let queryBuilderFixture: QueryBuilder<ObjectLiteral> &
          WhereExpressionBuilder;

        let result: unknown;

        beforeAll(() => {
          refreshTokenUpdateQueryFixture = RefreshTokenUpdateQueryFixtures.any;

          queryBuilderFixture =
            Symbol() as unknown as QueryBuilder<ObjectLiteral> &
              WhereExpressionBuilder;

          refreshTokenFindQueryTypeOrmFromRefreshTokenFindQueryBuilderMock.build.mockReturnValueOnce(
            queryBuilderFixture,
          );

          result =
            refreshTokenFindQueryTypeOrmFromRefreshTokenUpdateQueryBuilder.build(
              refreshTokenUpdateQueryFixture,
              queryBuilderFixture,
            );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call refreshTokenFindQueryTypeOrmFromRefreshTokenFindQueryBuilder.build()', () => {
          expect(
            refreshTokenFindQueryTypeOrmFromRefreshTokenFindQueryBuilderMock.build,
          ).toHaveBeenCalledTimes(1);
          expect(
            refreshTokenFindQueryTypeOrmFromRefreshTokenFindQueryBuilderMock.build,
          ).toHaveBeenCalledWith(
            refreshTokenUpdateQueryFixture.findQuery,
            queryBuilderFixture,
          );
        });

        it('should return QueryBuilder', () => {
          expect(result).toBe(queryBuilderFixture);
        });
      });
    });
  },
);
