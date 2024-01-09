import { describe, expect, jest, it, beforeAll, afterAll } from '@jest/globals';
import { act, renderHook } from '@testing-library/react';
import {
  STATUS_GAME_FULFILLED,
  STATUS_GAME_REJECTED,
  useGetGames,
} from './useGetGames';
import { useSelector } from 'react-redux';
import { httpClient } from '../../common/http/services/HttpService';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
  };
});
jest.mock('../../common/http/services/HttpService');

describe(useGetGames.name, () => {
  let statusGameFixture;
  let pageFixture;
  let pageSizeFixture;
  let errorMessageFixture;
  let tokenFixture;

  beforeAll(() => {
    statusGameFixture = null;
    pageFixture = 1;
    pageSizeFixture = 1;
    tokenFixture = null;
    errorMessageFixture = null;
  });

  describe('when called, and exists token and httpClient.getGamesMine() returns an OK response', () => {
    let result;
    let status;
    let gameList;
    let numPage;
    let errorMessage;

    beforeAll(async () => {
      statusGameFixture = 'nonStarted';
      pageSizeFixture = 3;

      tokenFixture = 'jwt token fixture';

      useSelector.mockImplementation(() => ({
        token: tokenFixture,
        errorMessage: errorMessageFixture,
      }));

      httpClient.getGamesMine.mockReturnValueOnce({
        headers: {},
        body: [
          {
            id: 'id',
            name: 'name',
            state: {
              status: statusGameFixture,
            },
          },
          {
            id: 'id2',
            name: 'name2',
            state: {
              status: statusGameFixture,
            },
          },
          {
            id: 'id3',
            name: 'name3',
            state: {
              status: statusGameFixture,
            },
          },
        ],
        statusCode: 200,
      });

      await act(() => {
        result = renderHook(() =>
          useGetGames(statusGameFixture, pageFixture, pageSizeFixture),
        ).result;
      });

      status = result.current.status;
      gameList = result.current.gameList;
      errorMessage = result.current.errorMessage;
      numPage = result.current.numPage;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should called useSelector() ', () => {
      expect(useSelector).toHaveBeenCalled();
      expect(useSelector).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should return a fulfilled status', () => {
      expect(status).toBe(STATUS_GAME_FULFILLED);
    });

    it('should return a null error message', () => {
      expect(errorMessage).toBeNull();
    });

    it('should return a page number', () => {
      expect(numPage).toEqual(pageFixture);
    });

    it('should return a list of games', () => {
      expect(gameList).toEqual([
        {
          id: 'id',
          name: 'name',
          state: {
            status: statusGameFixture,
          },
        },
        {
          id: 'id2',
          name: 'name2',
          state: {
            status: statusGameFixture,
          },
        },
        {
          id: 'id3',
          name: 'name3',
          state: {
            status: statusGameFixture,
          },
        },
      ]);
    });
  });

  describe('when called, and exists token and httpClient.getGamesMine() returns a non OK response', () => {
    let result;
    let status;
    let gameList;
    let errorMessage;

    beforeAll(async () => {
      tokenFixture = 'jwt token fixture';

      useSelector.mockImplementation(() => ({
        token: tokenFixture,
        errorMessage: errorMessageFixture,
      }));

      httpClient.getGamesMine.mockReturnValueOnce({
        headers: {},
        body: {
          code: null,
          description: 'Error Fixture',
          parameters: {},
        },
        statusCode: 401,
      });

      await act(() => {
        result = renderHook(() =>
          useGetGames(statusGameFixture, pageFixture, pageSizeFixture),
        ).result;
      });

      status = result.current.status;
      gameList = result.current.gameList;
      errorMessage = result.current.errorMessage.message;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should called useSelector() ', () => {
      expect(useSelector).toHaveBeenCalled();
      expect(useSelector).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should return a rejected status', () => {
      expect(status).toBe(STATUS_GAME_REJECTED);
    });

    it('should return a null error message', () => {
      expect(errorMessage).toContain(
        'Unexpected error when fetching user games',
      );
    });

    it('should return a list of games', () => {
      expect(gameList).toStrictEqual({});
    });
  });
});
