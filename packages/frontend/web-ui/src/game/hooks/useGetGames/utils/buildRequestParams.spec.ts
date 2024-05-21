import { beforeAll, describe, expect, it } from '@jest/globals';

import { HttpApiParams } from '../../../../common/http/models/HttpApiParams';
import { UseGetGamesContext } from '../models/UseGetGamesContext';
import { UseGetGamesParams } from '../models/UseGetGamesParams';
import { buildRequestParams } from './buildRequestParams';

describe(buildRequestParams.name, () => {
  let contextFixture: UseGetGamesContext;

  beforeAll(() => {
    contextFixture = {
      token: 'token-fixture',
    };
  });

  describe('having params with page', () => {
    let paramsFixture: UseGetGamesParams;

    beforeAll(() => {
      paramsFixture = {
        page: 2,
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = buildRequestParams(contextFixture, paramsFixture);
      });

      it('should return request params', () => {
        const expected: HttpApiParams<'getGamesMine'> = [
          {
            authorization: `Bearer ${contextFixture.token}`,
          },
          {
            page: (paramsFixture.page as number).toString(),
          },
        ];

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having params with pageSize', () => {
    let paramsFixture: UseGetGamesParams;

    beforeAll(() => {
      paramsFixture = {
        pageSize: 2,
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = buildRequestParams(contextFixture, paramsFixture);
      });

      it('should return request params', () => {
        const expected: HttpApiParams<'getGamesMine'> = [
          {
            authorization: `Bearer ${contextFixture.token}`,
          },
          {
            pageSize: (paramsFixture.pageSize as number).toString(),
          },
        ];

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having params with status', () => {
    let paramsFixture: UseGetGamesParams;

    beforeAll(() => {
      paramsFixture = {
        status: 'status-fixture',
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = buildRequestParams(contextFixture, paramsFixture);
      });

      it('should return request params', () => {
        const expected: HttpApiParams<'getGamesMine'> = [
          {
            authorization: `Bearer ${contextFixture.token}`,
          },
          {
            status: paramsFixture.status as string,
          },
        ];

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
