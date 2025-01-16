import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('typeorm', () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  const originalTypeOrmModule: any = jest.requireActual('typeorm');

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const originalInstanceChecker: typeof InstanceChecker =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    originalTypeOrmModule.InstanceChecker;

  const instanceCheckerMock: typeof InstanceChecker = {
    // eslint-disable-next-line @typescript-eslint/no-misused-spread
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
import {
  DataSource,
  EntityMetadata,
  InstanceChecker,
  ObjectLiteral,
  SelectQueryBuilder,
  ValueTransformer,
} from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata.js';

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
      let queryBuilderMock: jest.Mocked<SelectQueryBuilder<RefreshTokenDb>>;
      let metadataMock: jest.Mocked<EntityMetadata>;
      let columnMetadataFixture: jest.Mocked<ColumnMetadata>;
      let transformedValue: unknown;

      beforeAll(() => {
        transformedValue = Symbol();

        const valueTransformerMock: jest.Mocked<ValueTransformer> = {
          to: jest.fn().mockReturnValue(transformedValue),
        } as Partial<
          jest.Mocked<ValueTransformer>
        > as jest.Mocked<ValueTransformer>;

        columnMetadataFixture = {
          transformer: valueTransformerMock,
        } as Partial<
          jest.Mocked<ColumnMetadata>
        > as jest.Mocked<ColumnMetadata>;

        metadataMock = {
          findColumnWithPropertyName: jest
            .fn()
            .mockReturnValue(columnMetadataFixture),
        } as Partial<
          jest.Mocked<EntityMetadata>
        > as jest.Mocked<EntityMetadata>;

        queryBuilderMock = {
          andWhere: jest.fn().mockReturnThis(),
          connection: {
            getMetadata: jest.fn().mockReturnValueOnce(metadataMock),
          } as Partial<jest.Mocked<DataSource>> as jest.Mocked<DataSource>,
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
          (_refreshTokenFindQuery: RefreshTokenFindQuery) => [
            [
              `${RefreshTokenDb.name}.active = :${RefreshTokenDb.name}active`,
              {
                [`${RefreshTokenDb.name}active`]: transformedValue,
              },
            ],
          ],
        ],
        [
          'with date from',
          RefreshTokenFindQueryFixtures.withDateFrom,
          (refreshTokenFindQuery: RefreshTokenFindQuery) => [
            [
              `${RefreshTokenDb.name}.createdAt >= :${RefreshTokenDb.name}dateFrom`,
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
              `${RefreshTokenDb.name}.createdAt < :${RefreshTokenDb.name}dateTo`,
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
              `${RefreshTokenDb.name}.family = :${RefreshTokenDb.name}familyId`,
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
                  queryBuilderMock,
                );
            });

            afterAll(() => {
              jest.clearAllMocks();

              (
                InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
              ).mockReset();
            });

            it('should call queryBuilder.andWhere()', () => {
              expect(queryBuilderMock.andWhere).toHaveBeenCalled();
              andWhereExpectations.map(
                ([query, parameters]: [string, ObjectLiteral]) => {
                  expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
                    query,
                    parameters,
                  );
                },
              );
            });

            it('should return a QueryBuilder', () => {
              expect(result).toBe(queryBuilderMock);
            });
          });
        },
      );
    });
  },
);
