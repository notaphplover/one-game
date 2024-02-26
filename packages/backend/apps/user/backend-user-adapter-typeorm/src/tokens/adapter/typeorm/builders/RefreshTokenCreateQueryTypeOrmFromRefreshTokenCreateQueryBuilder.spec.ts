import { beforeAll, describe, expect, it } from '@jest/globals';

import { RefreshTokenCreateQuery } from '@cornie-js/backend-user-domain/tokens';
import { RefreshTokenCreateQueryFixtures } from '@cornie-js/backend-user-domain/tokens/fixtures';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { RefreshTokenDb } from '../models/RefreshTokenDb';
import { RefreshTokenCreateQueryTypeOrmFromRefreshTokenCreateQueryBuilder } from './RefreshTokenCreateQueryTypeOrmFromRefreshTokenCreateQueryBuilder';

describe(
  RefreshTokenCreateQueryTypeOrmFromRefreshTokenCreateQueryBuilder.name,
  () => {
    let refreshTokenCreateQueryTypeOrmFromRefreshTokenCreateQueryBuilder: RefreshTokenCreateQueryTypeOrmFromRefreshTokenCreateQueryBuilder;

    beforeAll(() => {
      refreshTokenCreateQueryTypeOrmFromRefreshTokenCreateQueryBuilder =
        new RefreshTokenCreateQueryTypeOrmFromRefreshTokenCreateQueryBuilder();
    });

    describe('.build', () => {
      let refreshTokenCreateQueryFixture: RefreshTokenCreateQuery;

      beforeAll(() => {
        refreshTokenCreateQueryFixture = RefreshTokenCreateQueryFixtures.any;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result =
            refreshTokenCreateQueryTypeOrmFromRefreshTokenCreateQueryBuilder.build(
              refreshTokenCreateQueryFixture,
            );
        });

        it('should return QueryDeepPartialEntity<RefreshTokenDb>', () => {
          const expected: QueryDeepPartialEntity<RefreshTokenDb> = {
            active: refreshTokenCreateQueryFixture.active,
            family: refreshTokenCreateQueryFixture.family,
            id: refreshTokenCreateQueryFixture.id,
            token: refreshTokenCreateQueryFixture.token,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  },
);
