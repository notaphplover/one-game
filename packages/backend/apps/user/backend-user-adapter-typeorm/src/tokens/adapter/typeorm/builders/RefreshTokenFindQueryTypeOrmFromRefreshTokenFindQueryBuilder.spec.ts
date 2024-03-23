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
      let queryBuilderFixture: jest.Mocked<SelectQueryBuilder<RefreshTokenDb>>;

      beforeAll(() => {
        queryBuilderFixture = {
          andWhere: jest.fn().mockReturnThis(),
        } as Partial<
          jest.Mocked<SelectQueryBuilder<RefreshTokenDb>>
        > as jest.Mocked<SelectQueryBuilder<RefreshTokenDb>>;
      });

      describe.each<
        [
          string,
          RefreshTokenFindQuery,
          (
            refreshTokenFindQuery: RefreshTokenFindQuery,
          ) => [string, ObjectLiteral][],
        ]
      >([
        [
          'with active',
          RefreshTokenFindQueryFixtures.withActive,
          (refreshTokenFindQuery: RefreshTokenFindQuery) => [
            [
              `${RefreshTokenDb.name}.active = :${RefreshTokenDb.name}active`,
              {
                [`${RefreshTokenDb.name}active`]: refreshTokenFindQuery.active,
              },
            ],
          ],
        ],
        [
          'with date from',
          RefreshTokenFindQueryFixtures.withDateFrom,
          (refreshTokenFindQuery: RefreshTokenFindQuery) => [
            [
              `${RefreshTokenDb.name}.dateFrom >= :${RefreshTokenDb.name}dateFrom`,
              {
                [`${RefreshTokenDb.name}dateFrom`]:
                  refreshTokenFindQuery.date?.from,
              },
            ],
          ],
        ],
        [
          'with date to',
          RefreshTokenFindQueryFixtures.withDateTo,
          (refreshTokenFindQuery: RefreshTokenFindQuery) => [
            [
              `${RefreshTokenDb.name}.dateTo < :${RefreshTokenDb.name}dateTo`,
              {
                [`${RefreshTokenDb.name}dateTo`]:
                  refreshTokenFindQuery.date?.to,
              },
            ],
          ],
        ],
        [
          'with family id',
          RefreshTokenFindQueryFixtures.withFamilyId,
          (refreshTokenFindQuery: RefreshTokenFindQuery) => [
            [
              `${RefreshTokenDb.name}.familyId = :${RefreshTokenDb.name}familyId`,
              {
                [`${RefreshTokenDb.name}familyId`]:
                  refreshTokenFindQuery.familyId,
              },
            ],
          ],
        ],
        [
          'with id',
          RefreshTokenFindQueryFixtures.withId,
          (refreshTokenFindQuery: RefreshTokenFindQuery) => [
            [
              `${RefreshTokenDb.name}.id = :${RefreshTokenDb.name}id`,
              {
                [`${RefreshTokenDb.name}id`]: refreshTokenFindQuery.id,
              },
            ],
          ],
        ],
      ])(
        'having a RefreshTokenFindQuery %s',
        (
          _: string,
          refreshTokenFindQueryFixture: RefreshTokenFindQuery,
          andWhereExpectationsBuilder: (
            refreshTokenFindQuery: RefreshTokenFindQuery,
          ) => [string, ObjectLiteral][],
        ) => {
          let andWhereExpectations: [string, ObjectLiteral][];

          beforeAll(() => {
            andWhereExpectations = andWhereExpectationsBuilder(
              refreshTokenFindQueryFixture,
            );
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
              andWhereExpectations.map(
                ([query, parameters]: [string, ObjectLiteral]) => {
                  expect(queryBuilderFixture.andWhere).toHaveBeenCalledWith(
                    query,
                    parameters,
                  );
                },
              );
            });

            it('should return a QueryBuilder', () => {
              expect(result).toBe(queryBuilderFixture);
            });
          });
        },
      );
    });
  },
);
