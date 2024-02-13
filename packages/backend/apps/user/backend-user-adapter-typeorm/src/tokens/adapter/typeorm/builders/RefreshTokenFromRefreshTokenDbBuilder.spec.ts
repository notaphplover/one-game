import { beforeAll, describe, expect, it } from '@jest/globals';

import { RefreshToken } from '@cornie-js/backend-user-domain/tokens';

import { RefreshTokenDbFixtures } from '../fixtures/RefreshTokenDbFixtures';
import { RefreshTokenDb } from '../models/RefreshTokenDb';
import { RefreshTokenFromRefreshTokenDbBuilder } from './RefreshTokenFromRefreshTokenDbBuilder';

describe(RefreshTokenFromRefreshTokenDbBuilder.name, () => {
  let refreshTokenFromRefreshTokenDbBuilder: RefreshTokenFromRefreshTokenDbBuilder;

  beforeAll(() => {
    refreshTokenFromRefreshTokenDbBuilder =
      new RefreshTokenFromRefreshTokenDbBuilder();
  });

  describe('.build', () => {
    let refreshTokenDbFixture: RefreshTokenDb;

    beforeAll(() => {
      refreshTokenDbFixture = RefreshTokenDbFixtures.any;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = refreshTokenFromRefreshTokenDbBuilder.build(
          refreshTokenDbFixture,
        );
      });

      it('should return RefreshToken', () => {
        const expected: RefreshToken = {
          token: refreshTokenDbFixture.token,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
