jest.mock('../../app/store/hooks');

import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { RenderResult, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CornieHome } from './CornieHome';
import { useAppSelector } from '../../app/store/hooks';
import { AuthenticatedAuthState } from '../../app/store/helpers/models/AuthState';
import { AuthStateStatus } from '../../app/store/helpers/models/AuthStateStatus';

const HOME_PAGE = '#home-page';
const HOME_PAGE_WITH_AUTH = '#home-page-with-auth';

describe(CornieHome.name, () => {
  let authenticateAuthStateFixture: AuthenticatedAuthState | null;

  beforeAll(() => {
    authenticateAuthStateFixture = null;
  });

  describe('when called, and useSelector() returns a null accessToken', () => {
    let shownPage: Element | null;

    beforeAll(() => {
      (
        useAppSelector as unknown as jest.Mock<typeof useAppSelector>
      ).mockReturnValueOnce(authenticateAuthStateFixture);

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
      expect(shownPage).not.toBe(undefined);
    });
  });

  describe('when called, and useSelector() returns a valid accessToken', () => {
    let shownPage: Element | null;

    beforeAll(() => {
      authenticateAuthStateFixture = {
        status: AuthStateStatus.authenticated,
        accessToken: 'accessToken-fixture',
        refreshToken: 'refreshToken-fixture',
      };

      (
        useAppSelector as unknown as jest.Mock<typeof useAppSelector>
      ).mockReturnValueOnce(authenticateAuthStateFixture);

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
      expect(shownPage).not.toBe(undefined);
    });
  });
});
