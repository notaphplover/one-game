import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../common/helpers/mapUseQueryHookResult');
jest.mock('../../common/http/services/cornieApi');

import { models as apiModels } from '@cornie-js/api-models';
import { renderHook, RenderHookResult } from '@testing-library/react';

import {
  mapUseQueryHookResult,
  UseQueryStateResult,
} from '../../common/helpers/mapUseQueryHookResult';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either } from '../../common/models/Either';
import {
  useGetGamesV1GameId,
  UseGetGamesV1GameIdResult,
} from './useGetGamesV1GameId';

describe(useGetGamesV1GameId.name, () => {
  describe('when called', () => {
    let gameIdFixture: string;
    let useQueryStateResultFixture: UseQueryStateResult<
      apiModels.GameV1 | undefined
    > & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      refetch: () => any;
    };
    let mapUseQueryHookResultResult: Either<string, apiModels.GameV1> | null;

    let renderResult: RenderHookResult<UseGetGamesV1GameIdResult, unknown>;

    beforeAll(() => {
      gameIdFixture = 'game-id-fixture';
      useQueryStateResultFixture = {
        data: undefined,
        error: undefined,
        isLoading: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        refetch: jest.fn<any>(),
      };
      mapUseQueryHookResultResult = null;

      (
        cornieApi.useGetGamesV1GameIdQuery as jest.Mock<
          typeof cornieApi.useGetGamesV1GameIdQuery
        >
      ).mockReturnValueOnce(useQueryStateResultFixture);

      (
        mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>
      ).mockReturnValueOnce(mapUseQueryHookResultResult);

      renderResult = renderHook(() => useGetGamesV1GameId(gameIdFixture));
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call cornieApi.useGetGamesV1GameIdQuery()', () => {
      expect(cornieApi.useGetGamesV1GameIdQuery).toHaveBeenCalledTimes(1);
      expect(cornieApi.useGetGamesV1GameIdQuery).toHaveBeenCalledWith(
        {
          params: [
            {
              gameId: gameIdFixture,
            },
          ],
        },
        { skip: false },
      );
    });

    it('should call mapUseQueryHookResult()', () => {
      expect(mapUseQueryHookResult).toHaveBeenCalledTimes(1);
      expect(mapUseQueryHookResult).toHaveBeenCalledWith(
        useQueryStateResultFixture,
      );
    });

    it('should return expected result', () => {
      const expected: UseGetGamesV1GameIdResult = {
        queryResult: useQueryStateResultFixture,
        result: mapUseQueryHookResultResult,
      };

      expect(renderResult.result.current).toStrictEqual(expected);
    });
  });
});
