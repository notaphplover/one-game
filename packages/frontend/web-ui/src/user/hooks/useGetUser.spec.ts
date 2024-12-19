import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../common/helpers/mapUseQueryHookResultV2');
jest.mock('../../common/http/services/cornieApi');

import { models as apiModels } from '@cornie-js/api-models';
import { SerializableAppError } from '@cornie-js/frontend-api-rtk-query';
import { SerializedError } from '@reduxjs/toolkit';
import { renderHook, RenderHookResult } from '@testing-library/react';

import {
  mapUseQueryHookResultV2,
  UseQueryStateResultV2,
} from '../../common/helpers/mapUseQueryHookResultV2';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either } from '../../common/models/Either';
import { useGetUser, UseGetUserResult } from './useGetUser';

describe(useGetUser.name, () => {
  describe('when called', () => {
    let useQueryStateResultFixture: UseQueryStateResultV2<apiModels.UserV1> & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      refetch: () => any;
    };
    let mapUseQueryHookResultResultV2: Either<
      SerializableAppError | SerializedError,
      apiModels.UserV1
    > | null;
    let userIdFixture: string;
    let renderResult: RenderHookResult<UseGetUserResult, unknown>;

    beforeAll(() => {
      useQueryStateResultFixture = {
        data: undefined,
        error: undefined,
        isLoading: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        refetch: jest.fn<any>(),
      };
      mapUseQueryHookResultResultV2 = null;

      userIdFixture = 'userId-fixture';

      (
        cornieApi.useGetUserV1Query as jest.Mock<
          typeof cornieApi.useGetUserV1Query
        >
      ).mockReturnValue(useQueryStateResultFixture);

      (
        mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>
      ).mockReturnValue(mapUseQueryHookResultResultV2);

      renderResult = renderHook(() => useGetUser(userIdFixture));
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call cornieApi.useGetUserV1Query()', () => {
      expect(cornieApi.useGetUserV1Query).toHaveBeenCalledTimes(1);
      expect(cornieApi.useGetUserV1Query).toHaveBeenCalledWith({
        params: [{ userId: userIdFixture }],
      });
    });

    it('should call mapUseQueryHookResult()', () => {
      expect(mapUseQueryHookResultV2).toHaveBeenCalledTimes(1);
      expect(mapUseQueryHookResultV2).toHaveBeenCalledWith(
        useQueryStateResultFixture,
      );
    });

    it('should return expected result', () => {
      const expected: UseGetUserResult = {
        queryResult: useQueryStateResultFixture,
        result: mapUseQueryHookResultResultV2,
      };

      expect(renderResult.result.current).toStrictEqual(expected);
    });
  });
});
