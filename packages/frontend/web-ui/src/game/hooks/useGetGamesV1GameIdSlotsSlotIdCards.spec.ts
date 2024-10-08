import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../common/helpers/mapUseQueryHookResult');
jest.mock('../../common/http/services/cornieApi');

import { models as apiModels } from '@cornie-js/api-models';
import {
  ApiTag,
  GetGamesV1GameIdSlotsSlotIdCardsArgs,
  SerializableAppError,
} from '@cornie-js/frontend-api-rtk-query';
import {
  BaseQueryFn,
  QueryActionCreatorResult,
  QueryDefinition,
} from '@reduxjs/toolkit/query';
import { renderHook, RenderHookResult } from '@testing-library/react';

import {
  mapUseQueryHookResult,
  UseQueryStateResult,
} from '../../common/helpers/mapUseQueryHookResult';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either } from '../../common/models/Either';
import {
  useGetGamesV1GameIdSlotsSlotIdCards,
  UseGetGamesV1GameIdSlotsSlotIdCardsResult,
} from './useGetGamesV1GameIdSlotsSlotIdCards';

describe(useGetGamesV1GameIdSlotsSlotIdCards.name, () => {
  describe('when called', () => {
    let gameIdFixture: string;
    let gameSlotIndexFixture: string;
    let useQueryStateResultFixture: UseQueryStateResult<apiModels.CardArrayV1> & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      refetch: () => any;
    };
    let mapUseQueryHookResultResult: Either<
      string,
      apiModels.CardArrayV1
    > | null;

    let renderResult: RenderHookResult<
      UseGetGamesV1GameIdSlotsSlotIdCardsResult,
      unknown
    >;

    beforeAll(() => {
      gameIdFixture = 'game-id-fixture';
      gameSlotIndexFixture = '1';
      useQueryStateResultFixture = {
        data: undefined,
        error: undefined,
        isLoading: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        refetch: jest.fn<any>(),
      };
      mapUseQueryHookResultResult = null;

      (
        cornieApi.useGetGamesV1GameIdSlotsSlotIdCardsQuery as jest.Mock<
          typeof cornieApi.useGetGamesV1GameIdSlotsSlotIdCardsQuery
        >
      ).mockReturnValueOnce(useQueryStateResultFixture);

      (
        mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>
      ).mockReturnValueOnce(mapUseQueryHookResultResult);

      renderResult = renderHook(() =>
        useGetGamesV1GameIdSlotsSlotIdCards(
          gameIdFixture,
          gameSlotIndexFixture,
        ),
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call cornieApi.useGetGamesV1GameIdSlotsSlotIdCardsQuery()', () => {
      expect(
        cornieApi.useGetGamesV1GameIdSlotsSlotIdCardsQuery,
      ).toHaveBeenCalledTimes(1);
      expect(
        cornieApi.useGetGamesV1GameIdSlotsSlotIdCardsQuery,
      ).toHaveBeenCalledWith(
        {
          params: [
            {
              gameId: gameIdFixture,
              gameSlotIndex: gameSlotIndexFixture,
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
      const expected: UseGetGamesV1GameIdSlotsSlotIdCardsResult = {
        refetch: expect.any(
          Function,
        ) as unknown as () => QueryActionCreatorResult<
          QueryDefinition<
            GetGamesV1GameIdSlotsSlotIdCardsArgs,
            BaseQueryFn<void, symbol, SerializableAppError>,
            ApiTag,
            apiModels.CardArrayV1
          >
        >,
        result: mapUseQueryHookResultResult,
      };

      expect(renderResult.result.current).toStrictEqual(expected);
    });
  });
});
