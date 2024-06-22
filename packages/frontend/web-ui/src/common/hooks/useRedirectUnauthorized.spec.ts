import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('react-router-dom');

jest.mock('../../app/store/hooks');

import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthenticatedAuthState } from '../../app/store/helpers/models/AuthState';
import { AuthStateStatus } from '../../app/store/helpers/models/AuthStateStatus';
import { useAppSelector } from '../../app/store/hooks';
import { useRedirectUnauthorized } from './useRedirectUnauthorized';

describe(useRedirectUnauthorized.name, () => {
  describe('when called, and useAppSelector() returns null', () => {
    let navigateMock: ReturnType<typeof useNavigate> &
      jest.Mock<ReturnType<typeof useNavigate>>;

    beforeAll(async () => {
      navigateMock = jest.fn<ReturnType<typeof useNavigate>>() as ReturnType<
        typeof useNavigate
      > &
        jest.Mock<ReturnType<typeof useNavigate>>;

      (useNavigate as jest.Mock<typeof useNavigate>).mockReturnValueOnce(
        navigateMock,
      );

      (useAppSelector as jest.Mock<typeof useAppSelector>).mockReturnValueOnce(
        null,
      );

      await act(async () => {
        renderHook(() => useRedirectUnauthorized());
      });
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call useNavigate()', () => {
      expect(useNavigate).toHaveBeenCalledTimes(1);
      expect(useNavigate).toHaveBeenCalledWith();
    });

    it('should call useAppSelector()', () => {
      expect(useAppSelector).toHaveBeenCalledTimes(1);
      expect(useAppSelector).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should call navigate()', () => {
      expect(navigateMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledWith('/');
    });
  });

  describe('when called, and useAppSelector() returns AuthenticatedAuthState', () => {
    let navigateMock: ReturnType<typeof useNavigate> &
      jest.Mock<ReturnType<typeof useNavigate>>;

    beforeAll(async () => {
      navigateMock = jest.fn<ReturnType<typeof useNavigate>>() as ReturnType<
        typeof useNavigate
      > &
        jest.Mock<ReturnType<typeof useNavigate>>;

      (useNavigate as jest.Mock<typeof useNavigate>).mockReturnValueOnce(
        navigateMock,
      );

      const authenticatedAuthState: AuthenticatedAuthState = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        status: AuthStateStatus.authenticated,
      };

      (useAppSelector as jest.Mock<typeof useAppSelector>).mockReturnValueOnce(
        authenticatedAuthState,
      );

      await act(async () => {
        renderHook(() => useRedirectUnauthorized());
      });
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call useNavigate()', () => {
      expect(useNavigate).toHaveBeenCalledTimes(1);
      expect(useNavigate).toHaveBeenCalledWith();
    });

    it('should call useAppSelector()', () => {
      expect(useAppSelector).toHaveBeenCalledTimes(1);
      expect(useAppSelector).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should not call navigate()', () => {
      expect(navigateMock).not.toHaveBeenCalled();
    });
  });
});
