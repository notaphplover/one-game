import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('typeorm', () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  const originalTypeOrmModule: any = jest.requireActual('typeorm');

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const originalInstanceChecker: typeof InstanceChecker =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    originalTypeOrmModule.InstanceChecker;

  const instanceCheckerMock: typeof InstanceChecker = {
    ...originalInstanceChecker,
    isSelectQueryBuilder: jest.fn() as unknown as (
      obj: unknown,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) => obj is SelectQueryBuilder<any>,
  } as typeof InstanceChecker;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    ...originalTypeOrmModule,
    InstanceChecker: instanceCheckerMock,
  };
});

import { RefreshTokenFindQuery } from '@cornie-js/backend-user-domain/tokens';
import { RefreshTokenFindQueryFixtures } from '@cornie-js/backend-user-domain/tokens/fixtures';
import { InstanceChecker, ObjectLiteral, SelectQueryBuilder } from 'typeorm';

import { RefreshTokenDb } from '../models/RefreshTokenDb';
import { RefreshTokenFindQueryTypeOrmFromRefreshTokenFindQueryBuilder } from './RefreshTokenFindQueryTypeOrmFromRefreshTokenFindQueryBuilder';

describe(
  RefreshTokenFindQueryTypeOrmFromRefreshTokenFindQueryBuilder.name,
  () => {
    let refreshTokenFindQueryTypeOrmFromRefreshTokenFindQueryBuilder: RefreshTokenFindQueryTypeOrmFromRefreshTokenFindQueryBuilder;

    beforeAll(() => {
      refreshTokenFindQueryTypeOrmFromRefreshTokenFindQueryBuilder =
        new RefreshTokenFindQueryTypeOrmFromRefreshTokenFindQueryBuilder();
    });

    describe('.build', () => {
      let queryBuilderFixture: jest.Mocked<SelectQueryBuilder<ObjectLiteral>>;

      beforeAll(() => {
        queryBuilderFixture = {
          andWhere: jest.fn().mockReturnThis(),
        } as Partial<
          jest.Mocked<SelectQueryBuilder<ObjectLiteral>>
        > as jest.Mocked<SelectQueryBuilder<ObjectLiteral>>;
      });

      describe('having a RefreshTokenFindQuery with id', () => {
        let refreshTokenFindQueryFixture: RefreshTokenFindQuery;

        beforeAll(() => {
          refreshTokenFindQueryFixture = RefreshTokenFindQueryFixtures.withId;
        });

        describe('when called', () => {
          let result: unknown;

          beforeAll(() => {
            (
              InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
            ).mockReturnValue(true);

            result =
              refreshTokenFindQueryTypeOrmFromRefreshTokenFindQueryBuilder.build(
                refreshTokenFindQueryFixture,
                queryBuilderFixture,
              );
          });

          afterAll(() => {
            jest.clearAllMocks();

            (
              InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
            ).mockReset();
          });

          it('should call queryBuilder.andWhere()', () => {
            expect(queryBuilderFixture.andWhere).toHaveBeenCalled();
            expect(queryBuilderFixture.andWhere).toHaveBeenCalledWith(
              `${RefreshTokenDb.name}.id = :${RefreshTokenDb.name}id`,
              {
                [`${RefreshTokenDb.name}id`]: refreshTokenFindQueryFixture.id,
              },
            );
          });

          it('should return a QueryBuilder', () => {
            expect(result).toBe(queryBuilderFixture);
          });
        });
      });
    });
  },
);
