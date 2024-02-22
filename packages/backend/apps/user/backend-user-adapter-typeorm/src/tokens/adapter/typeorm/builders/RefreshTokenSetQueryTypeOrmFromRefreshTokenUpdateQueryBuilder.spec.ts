import { beforeAll, describe, expect, it } from '@jest/globals';

import { RefreshTokenUpdateQuery } from '@cornie-js/backend-user-domain/tokens';
import { RefreshTokenUpdateQueryFixtures } from '@cornie-js/backend-user-domain/tokens/fixtures';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { RefreshTokenDb } from '../models/RefreshTokenDb';
import { RefreshTokenSetQueryTypeOrmFromRefreshTokenUpdateQueryBuilder } from './RefreshTokenSetQueryTypeOrmFromRefreshTokenUpdateQueryBuilder';

describe(
  RefreshTokenSetQueryTypeOrmFromRefreshTokenUpdateQueryBuilder.name,
  () => {
    let refreshTokenSetQueryTypeOrmFromRefreshTokenUpdateQueryBuilder: RefreshTokenSetQueryTypeOrmFromRefreshTokenUpdateQueryBuilder;

    beforeAll(() => {
      refreshTokenSetQueryTypeOrmFromRefreshTokenUpdateQueryBuilder =
        new RefreshTokenSetQueryTypeOrmFromRefreshTokenUpdateQueryBuilder();
    });

    describe('.build', () => {
      describe.each<
        [
          string,
          RefreshTokenUpdateQuery,
          (
            refreshTokenUpdateQuery: RefreshTokenUpdateQuery,
          ) => QueryDeepPartialEntity<RefreshTokenDb>,
        ]
      >([
        [
          'with active',
          RefreshTokenUpdateQueryFixtures.withActive,
          (
            refreshTokenUpdateQuery: RefreshTokenUpdateQuery,
          ): QueryDeepPartialEntity<RefreshTokenDb> => ({
            active: refreshTokenUpdateQuery.active as boolean,
          }),
        ],
      ])(
        'having a RefreshTokenUpdateQuery %s',
        (
          _: string,
          refreshTokenUpdateQueryFixture: RefreshTokenUpdateQuery,
          expectedrefreshTokenSetQueryTypeormBuilder: (
            refreshTokenUpdateQuery: RefreshTokenUpdateQuery,
          ) => QueryDeepPartialEntity<RefreshTokenDb>,
        ) => {
          let expectedRefreshTokenSetQueryTypeorm: QueryDeepPartialEntity<RefreshTokenDb>;

          beforeAll(() => {
            expectedRefreshTokenSetQueryTypeorm =
              expectedrefreshTokenSetQueryTypeormBuilder(
                refreshTokenUpdateQueryFixture,
              );
          });

          describe('when called', () => {
            let result: unknown;

            beforeAll(() => {
              result =
                refreshTokenSetQueryTypeOrmFromRefreshTokenUpdateQueryBuilder.build(
                  refreshTokenUpdateQueryFixture,
                );
            });

            it('should return QueryDeepPartialEntity<RefreshTokenDb>', () => {
              expect(result).toStrictEqual(expectedRefreshTokenSetQueryTypeorm);
            });
          });
        },
      );
    });
  },
);
