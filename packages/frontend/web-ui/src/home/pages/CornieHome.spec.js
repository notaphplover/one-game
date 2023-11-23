import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { CornieHome } from './CornieHome';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
  };
});

const HOME_PAGE = '#home-page';
const HOME_PAGE_WITH_AUTH = '#home-page-with-auth';

describe(CornieHome.name, () => {
  let tokenFixture;
  let errorMessageFixture;

  beforeAll(() => {
    tokenFixture = null;
    errorMessageFixture = null;
  });

  describe('when called, and useSelector() returns a null token', () => {
    let result;
    let shownPage;

    beforeAll(() => {
      tokenFixture = null;
      errorMessageFixture = null;

      useSelector.mockImplementation(() => ({
        token: tokenFixture,
        errorMessage: errorMessageFixture,
      }));

      result = render(
        <MemoryRouter>
          <CornieHome />
        </MemoryRouter>,
      );

      shownPage = result.container.querySelector(HOME_PAGE);
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return a <Home /> page', () => {
      expect(shownPage).not.toBe(undefined);
    });
  });

  describe('when called, and useSelector() returns a valid token', () => {
    let result;
    let shownPage;

    beforeAll(() => {
      tokenFixture = 'jwt token fixture';
      errorMessageFixture = null;

      useSelector.mockImplementation(() => ({
        token: tokenFixture,
        errorMessage: errorMessageFixture,
      }));

      result = render(
        <MemoryRouter>
          <CornieHome />
        </MemoryRouter>,
      );

      shownPage = result.container.querySelector(HOME_PAGE_WITH_AUTH);
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
