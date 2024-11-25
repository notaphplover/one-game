import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('react-router');

jest.mock('../../app/store/hooks');
jest.mock('../helpers/getSlug');

import { renderHook } from '@testing-library/react';
import { act } from 'react';
import {
  Location as ReactRouterLocation,
  useLocation,
  useNavigate,
} from 'react-router';

import { AuthenticatedAuthState } from '../../app/store/helpers/models/AuthState';
import { AuthStateStatus } from '../../app/store/helpers/models/AuthStateStatus';
import { useAppSelector } from '../../app/store/hooks';
import { getSlug } from '../helpers/getSlug';
import { PageName } from '../models/PageName';
import { useRedirectUnauthorized } from './useRedirectUnauthorized';

describe(useRedirectUnauthorized.name, () => {
  describe('having a window with location.href with gameId query', () => {
    let previousLocation: Location;
    let locationFixture: URL;

    beforeAll(() => {
      previousLocation = window.location;
      locationFixture = new URL('http://corniegame.com/sample-path');

      Object.defineProperty(window, 'location', {
        configurable: true,
        value: new URL(locationFixture),
        writable: true,
      });
    });

    describe('when called, and useAppSelector() returns null', () => {
      let reactRouterLocationFixture: ReactRouterLocation;
      let slugFixture: string;

      let navigateMock: ReturnType<typeof useNavigate> &
        jest.Mock<ReturnType<typeof useNavigate>>;

      beforeAll(async () => {
        reactRouterLocationFixture = {
          pathname: '/path-fixture',
          search: '?search=fixture',
        } as Partial<ReactRouterLocation> as ReactRouterLocation;
        slugFixture = '/slug-fixture';

        navigateMock = jest.fn<ReturnType<typeof useNavigate>>() as ReturnType<
          typeof useNavigate
        > &
          jest.Mock<ReturnType<typeof useNavigate>>;

        (useLocation as jest.Mock<typeof useLocation>).mockReturnValueOnce(
          reactRouterLocationFixture,
        );

        (useNavigate as jest.Mock<typeof useNavigate>).mockReturnValueOnce(
          navigateMock,
        );

        (
          useAppSelector as jest.Mock<typeof useAppSelector>
        ).mockReturnValueOnce(null);

        (getSlug as jest.Mock<typeof getSlug>).mockReturnValueOnce(slugFixture);

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

      it('should call getSlug()', () => {
        expect(getSlug).toHaveBeenCalledTimes(1);
        expect(getSlug).toHaveBeenCalledWith(PageName.login);
      });

      it('should call navigate()', () => {
        const expectedRedirection: string = new URL(
          reactRouterLocationFixture.pathname +
            reactRouterLocationFixture.search,
          locationFixture.href,
        ).toString();

        expect(navigateMock).toHaveBeenCalledTimes(1);
        expect(navigateMock).toHaveBeenCalledWith(
          `${slugFixture}?redirectTo=${encodeURIComponent(expectedRedirection)}`,
        );
      });
    });

    afterAll(() => {
      Object.defineProperty(window, 'location', {
        configurable: true,
        value: previousLocation,
        writable: true,
      });
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
