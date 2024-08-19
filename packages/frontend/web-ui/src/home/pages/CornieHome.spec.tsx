jest.mock('../../app/store/hooks');
jest.mock('../components/Home', () => ({
  Home: () => {
    return <div id="home-page">Home fixture</div>;
  },
}));
jest.mock('../components/HomeWithAuth', () => ({
  HomeWithAuth: () => {
    return <div id="home-page-with-auth">Home with auth fixture</div>;
  },
}));

import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { render, RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { AuthenticatedAuthState } from '../../app/store/helpers/models/AuthState';
import { AuthStateStatus } from '../../app/store/helpers/models/AuthStateStatus';
import { useAppSelector } from '../../app/store/hooks';
import { CornieHome } from './CornieHome';

const HOME_PAGE = '#home-page';
const HOME_PAGE_WITH_AUTH = '#home-page-with-auth';

describe(CornieHome.name, () => {
  describe('when called, and useSelector() returns null', () => {
    let shownPage: Element | null;

    beforeAll(() => {
      (
        useAppSelector as unknown as jest.Mock<typeof useAppSelector>
      ).mockReturnValueOnce(null);

      const renderResult: RenderResult = render(
        <MemoryRouter>
          <CornieHome />
        </MemoryRouter>,
      );

      shownPage = renderResult.container.querySelector(HOME_PAGE);
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return a <Home /> page', () => {
      expect(shownPage).not.toBeNull();
      expect((shownPage as Element).innerHTML).toBe('Home fixture');
    });
  });

  describe('when called, and useSelector() returns AuthenticatedAuthState', () => {
    let authStateFixture: AuthenticatedAuthState;
    let shownPage: Element | null;

    beforeAll(() => {
      authStateFixture = {
        accessToken: 'accessToken-fixture',
        refreshToken: 'refreshToken-fixture',
        status: AuthStateStatus.authenticated,
      };

      (
        useAppSelector as unknown as jest.Mock<typeof useAppSelector>
      ).mockReturnValueOnce(authStateFixture);

      const renderResult: RenderResult = render(
        <MemoryRouter>
          <CornieHome />
        </MemoryRouter>,
      );

      shownPage = renderResult.container.querySelector(HOME_PAGE_WITH_AUTH);
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return a <HomeWithAuth /> page', () => {
      expect(shownPage).not.toBeNull();
      expect((shownPage as Element).innerHTML).toBe('Home with auth fixture');
    });
  });
});
