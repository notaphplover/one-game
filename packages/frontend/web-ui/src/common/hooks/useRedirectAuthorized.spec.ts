import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('react-router');

jest.mock('../../app/store/hooks');
jest.mock('../helpers/getSlug');

import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useNavigate } from 'react-router';

import { AuthenticatedAuthState } from '../../app/store/helpers/models/AuthState';
import { AuthStateStatus } from '../../app/store/helpers/models/AuthStateStatus';
import { useAppSelector } from '../../app/store/hooks';
import { getSlug } from '../helpers/getSlug';
import { PageName } from '../models/PageName';
import { useRedirectAuthorized } from './useRedirectAuthorized';

describe(useRedirectAuthorized.name, () => {
  describe('having no skip', () => {
    describe('when called, and useAppSelector() returns null', () => {
      let slugFixture: string;

      let navigateMock: ReturnType<typeof useNavigate> &
        jest.Mock<ReturnType<typeof useNavigate>>;

      beforeAll(async () => {
        slugFixture = '/slug-fixture';

        navigateMock = jest.fn<ReturnType<typeof useNavigate>>() as ReturnType<
          typeof useNavigate
        > &
          jest.Mock<ReturnType<typeof useNavigate>>;

        (useNavigate as jest.Mock<typeof useNavigate>).mockReturnValueOnce(
          navigateMock,
        );

        (
          useAppSelector as jest.Mock<typeof useAppSelector>
        ).mockReturnValueOnce(null);

        (getSlug as jest.Mock<typeof getSlug>).mockReturnValueOnce(slugFixture);

        await act(async () => {
          renderHook(() => useRedirectAuthorized());
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

      it('should not call getSlug()', () => {
        expect(getSlug).not.toHaveBeenCalled();
      });

      it('should not call navigate()', () => {
        expect(navigateMock).not.toHaveBeenCalled();
      });
    });

    describe('when called, and useAppSelector() returns AuthenticatedAuthState', () => {
      let slugFixture: string;

      let navigateMock: ReturnType<typeof useNavigate> &
        jest.Mock<ReturnType<typeof useNavigate>>;

      beforeAll(async () => {
        slugFixture = '/slug-fixture';

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

        (
          useAppSelector as jest.Mock<typeof useAppSelector>
        ).mockReturnValueOnce(authenticatedAuthState);

        (getSlug as jest.Mock<typeof getSlug>).mockReturnValueOnce(slugFixture);

        await act(async () => {
          renderHook(() => useRedirectAuthorized());
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
        expect(getSlug).toHaveBeenCalledWith(PageName.home);
      });

      it('should call navigate()', () => {
        expect(navigateMock).toHaveBeenCalledTimes(1);
        expect(navigateMock).toHaveBeenCalledWith(slugFixture);
      });
    });
  });

  describe('having skip true', () => {
    describe('when called, and useAppSelector() returns AuthenticatedAuthState', () => {
      let slugFixture: string;

      let navigateMock: ReturnType<typeof useNavigate> &
        jest.Mock<ReturnType<typeof useNavigate>>;

      beforeAll(async () => {
        slugFixture = '/slug-fixture';

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

        (
          useAppSelector as jest.Mock<typeof useAppSelector>
        ).mockReturnValueOnce(authenticatedAuthState);

        (getSlug as jest.Mock<typeof getSlug>).mockReturnValueOnce(slugFixture);

        await act(async () => {
          renderHook(() => useRedirectAuthorized(true));
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

      it('should not call getSlug()', () => {
        expect(getSlug).not.toHaveBeenCalled();
      });

      it('should not call navigate()', () => {
        expect(navigateMock).not.toHaveBeenCalled();
      });
    });
  });
});
