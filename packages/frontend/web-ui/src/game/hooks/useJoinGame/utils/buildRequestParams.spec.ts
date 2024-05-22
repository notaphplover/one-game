import { beforeAll, describe, expect, it } from '@jest/globals';

import { HttpApiParams } from '../../../../common/http/models/HttpApiParams';
import { UseJoinGameContext } from '../models/UseJoinGameContext';
import { UseJoinGameParams } from '../models/UseJoinGameParams';
import { buildRequestParams } from './buildRequestParams';

describe(buildRequestParams.name, () => {
  let contextFixture: UseJoinGameContext;

  beforeAll(() => {
    contextFixture = {
      token: 'token-fixture',
      userId: 'userId-fixture',
    };
  });

  describe('having params with name', () => {
    let paramsFixture: UseJoinGameParams;

    beforeAll(() => {
      paramsFixture = {
        gameId: 'gameId-fixture',
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = buildRequestParams(contextFixture, paramsFixture);
      });

      it('should return request params', () => {
        if (contextFixture.token === null || contextFixture.userId === null) {
          throw new Error('Error-fixture');
        }

        const expected: HttpApiParams<'createGameSlot'> = [
          {
            authorization: `Bearer ${contextFixture.token}`,
          },
          {
            gameId: paramsFixture.gameId,
          },
          {
            userId: contextFixture.userId,
          },
        ];

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having params without name', () => {
    let paramsFixture: UseJoinGameParams;

    beforeAll(() => {
      paramsFixture = {
        gameId: 'gameId-fixture',
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = buildRequestParams(contextFixture, paramsFixture);
      });

      it('should return request params', () => {
        if (contextFixture.token === null || contextFixture.userId === null) {
          throw new Error('Error-fixture');
        }
        const expected: HttpApiParams<'createGameSlot'> = [
          {
            authorization: `Bearer ${contextFixture.token}`,
          },
          {
            gameId: paramsFixture.gameId,
          },
          {
            userId: contextFixture.userId,
          },
        ];

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
