import { describe, expect, jest, it, beforeAll, afterAll } from '@jest/globals';

jest.mock('../../common/http/services/HttpService');
jest.mock('react-redux', () => {
  return {
    ...(jest.requireActual('react-redux') as Record<string, unknown>),
    useSelector: jest.fn(),
  };
});

import { models as apiModels } from '@cornie-js/api-models';
import {
  RenderHookResult,
  act,
  renderHook,
  waitFor,
} from '@testing-library/react';
import { UNEXPECTED_ERROR_MESSAGE, useGetGames } from './useGetGames';
import { UseGetGamesResult } from '../models/UseGetGamesResult';
import { UseSelector, useSelector } from 'react-redux';
import { httpClient } from '../../common/http/services/HttpService';

describe(useGetGames.name, () => {
  let pageSizeFixture: number;
  let tokenFixture: unknown;

  beforeAll(() => {
    pageSizeFixture = 1;
    tokenFixture = null;
  });

  describe('when called, and httpClient.getGamesMine() returns an OK response', () => {
    let gamesFixture: apiModels.GameArrayV1;
    let renderHookResult: RenderHookResult<UseGetGamesResult, unknown>;

    beforeAll(async () => {
      gamesFixture = [
        {
          id: 'id',
          name: 'name',
          state: {
            slots: [],
            status: 'nonStarted',
          },
        },
        {
          id: 'id2',
          name: 'name2',
          state: {
            slots: [],
            status: 'nonStarted',
          },
        },
        {
          id: 'id3',
          name: 'name3',
          state: {
            slots: [],
            status: 'nonStarted',
          },
        },
      ];

      pageSizeFixture = 3;

      tokenFixture = 'jwt token fixture';

      (
        useSelector as Partial<UseSelector<unknown>> as jest.Mock<
          typeof useSelector
        >
      ).mockImplementation((() => ({
        token: tokenFixture,
        errorMessage: null,
      })) as Partial<UseSelector<unknown>> as UseSelector<unknown>);

      (
        httpClient.getGamesMine as jest.Mock<typeof httpClient.getGamesMine>
      ).mockResolvedValue({
        headers: {},
        body: gamesFixture,
        statusCode: 200,
      });

      renderHookResult = renderHook(() => useGetGames(pageSizeFixture));

      act(() => {
        renderHookResult.result.current.call({
          pageNumber: 1,
          status: 'nonStarted',
        });
      });

      await waitFor(() => {
        expect(renderHookResult.result.current.result).not.toBeNull();
      });
    });

    afterAll(() => {
      jest.clearAllMocks();

      (
        useSelector as Partial<UseSelector<unknown>> as jest.Mock<
          typeof useSelector
        >
      ).mockReset();
    });

    it('should call useSelector() ', () => {
      expect(useSelector).toHaveBeenCalled();
      expect(useSelector).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should return a nonStarted games', () => {
      expect(renderHookResult.result.current.result?.value).toBe(gamesFixture);
    });
  });

  describe('when called, and httpClient.getGamesMine() returns a non OK response', () => {
    let errorFixture: apiModels.ErrorV1;
    let renderHookResult: RenderHookResult<UseGetGamesResult, unknown>;

    beforeAll(async () => {
      errorFixture = {
        description: UNEXPECTED_ERROR_MESSAGE,
      };

      pageSizeFixture = 3;

      tokenFixture = 'jwt token fixture';

      (
        useSelector as Partial<UseSelector<unknown>> as jest.Mock<
          typeof useSelector
        >
      ).mockImplementation((() => ({
        token: tokenFixture,
        errorMessage: null,
      })) as Partial<UseSelector<unknown>> as UseSelector<unknown>);

      (
        httpClient.getGamesMine as jest.Mock<typeof httpClient.getGamesMine>
      ).mockResolvedValue({
        headers: {},
        body: errorFixture,
        statusCode: 400,
      });

      renderHookResult = renderHook(() => useGetGames(pageSizeFixture));

      act(() => {
        renderHookResult.result.current.call({
          pageNumber: 1,
          status: 'nonStarted',
        });
      });

      await waitFor(() => {
        expect(renderHookResult.result.current.result).not.toBeNull();
      });
    });

    afterAll(() => {
      jest.clearAllMocks();

      (
        useSelector as Partial<UseSelector<unknown>> as jest.Mock<
          typeof useSelector
        >
      ).mockReset();
    });

    it('should call useSelector() ', () => {
      expect(useSelector).toHaveBeenCalled();
      expect(useSelector).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should return an unexpected error message', () => {
      expect(renderHookResult.result.current.result?.value).toBe(
        UNEXPECTED_ERROR_MESSAGE,
      );
    });
  });
});
