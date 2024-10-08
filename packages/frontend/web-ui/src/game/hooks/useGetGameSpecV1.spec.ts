import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../common/helpers/mapUseQueryHookResultV2');
jest.mock('../../common/http/services/cornieApi');

import { models as apiModels } from '@cornie-js/api-models';
import {
  GetGamesGameIdSpecsV1Args,
  SerializableAppError,
} from '@cornie-js/frontend-api-rtk-query';
import { SerializedError } from '@reduxjs/toolkit';
import { SubscriptionOptions } from '@reduxjs/toolkit/query';

import { UseQueryStateResult } from '../../common/helpers/mapUseQueryHookResult';
import { mapUseQueryHookResultV2 } from '../../common/helpers/mapUseQueryHookResultV2';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either } from '../../common/models/Either';
import { useGetGameSpecV1, UseGetGameSpecV1Result } from './useGetGameSpecV1';

type UseQuerySubscriptionOptions = SubscriptionOptions & {
  skip?: boolean;
  refetchOnMountOrArgChange?: boolean | number;
};

describe(useGetGameSpecV1.name, () => {
  describe('having an undefined gameId', () => {
    let gameIdFixture: undefined;

    beforeAll(() => {
      gameIdFixture = undefined;
    });

    describe('when called', () => {
      let useQueryStateResultFixture: UseQueryStateResult<
        apiModels.GameSpecV1 | undefined
      > & {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        refetch: () => any;
      };
      let mapUseQueryHookResultResult: Either<
        SerializableAppError | SerializedError,
        apiModels.GameSpecV1
      > | null;

      let result: unknown;

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
          cornieApi.useGetGamesGameIdSpecsV1Query as jest.Mock<
            typeof cornieApi.useGetGamesGameIdSpecsV1Query
          >
        ).mockReturnValueOnce(useQueryStateResultFixture);

        (
          mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>
        ).mockReturnValueOnce(mapUseQueryHookResultResult);

        result = useGetGameSpecV1(gameIdFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call cornieApi.useGetGamesGameIdSpecsV1Query()', () => {
        const expectedGetGamesSpecsV1Args: GetGamesGameIdSpecsV1Args = {
          params: [
            {
              gameId: '',
            },
          ],
        };

        const expectedSubscriptionOptions: UseQuerySubscriptionOptions = {
          skip: true,
        };

        expect(cornieApi.useGetGamesGameIdSpecsV1Query).toHaveBeenCalledTimes(
          1,
        );
        expect(cornieApi.useGetGamesGameIdSpecsV1Query).toHaveBeenCalledWith(
          expectedGetGamesSpecsV1Args,
          expectedSubscriptionOptions,
        );
      });

      it('should call mapUseQueryHookResultV2()', () => {
        expect(mapUseQueryHookResultV2).toHaveBeenCalledTimes(1);
        expect(mapUseQueryHookResultV2).toHaveBeenCalledWith(
          useQueryStateResultFixture,
        );
      });

      it('should return UseGetGameSpecsV1ForGamesResult', () => {
        const expected: UseGetGameSpecV1Result = {
          result: mapUseQueryHookResultResult,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
