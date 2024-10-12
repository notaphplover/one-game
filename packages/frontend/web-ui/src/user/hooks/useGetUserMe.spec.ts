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
import { useGetUserMe, UseGetUserMeResult } from './useGetUserMe';

describe(useGetUserMe.name, () => {
  describe('when called', () => {
    let useQueryStateResultFixture: UseQueryStateResult<apiModels.UserV1> & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      refetch: () => any;
    };
    let mapUseQueryHookResultResult: Either<string, apiModels.UserV1> | null;

    let renderResult: RenderHookResult<UseGetUserMeResult, unknown>;

    beforeAll(() => {
      useQueryStateResultFixture = {
        data: undefined,
        error: undefined,
        isLoading: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        refetch: jest.fn<any>(),
      };
      mapUseQueryHookResultResult = null;

      (
        cornieApi.useGetUsersV1MeQuery as jest.Mock<
          typeof cornieApi.useGetUsersV1MeQuery
        >
      ).mockReturnValueOnce(useQueryStateResultFixture);

      (
        mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>
      ).mockReturnValueOnce(mapUseQueryHookResultResult);

      renderResult = renderHook(() => useGetUserMe());
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call cornieApi.useGetUsersV1MeQuery()', () => {
      expect(cornieApi.useGetUsersV1MeQuery).toHaveBeenCalledTimes(1);
      expect(cornieApi.useGetUsersV1MeQuery).toHaveBeenCalledWith({
        params: [],
      });
    });

    it('should call mapUseQueryHookResult()', () => {
      expect(mapUseQueryHookResult).toHaveBeenCalledTimes(1);
      expect(mapUseQueryHookResult).toHaveBeenCalledWith(
        useQueryStateResultFixture,
      );
    });

    it('should return expected result', () => {
      const expected: UseGetUserMeResult = {
        queryResult: useQueryStateResultFixture,
        result: mapUseQueryHookResultResult,
      };

      expect(renderResult.result.current).toStrictEqual(expected);
    });
  });
});
