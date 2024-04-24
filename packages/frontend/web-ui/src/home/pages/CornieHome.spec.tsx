jest.mock('../../app/store/hooks');

import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { RenderResult, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CornieHome } from './CornieHome';
import { useAppSelector } from '../../app/store/hooks';

const HOME_PAGE = '#home-page';
const HOME_PAGE_WITH_AUTH = '#home-page-with-auth';

describe(CornieHome.name, () => {
  let tokenFixture: unknown;

  beforeAll(() => {
    tokenFixture = null;
  });

  describe('when called, and useSelector() returns a null token', () => {
    let shownPage: Element | null;

    beforeAll(() => {
      tokenFixture = null;

      (
        useAppSelector as unknown as jest.Mock<typeof useAppSelector>
      ).mockReturnValueOnce(tokenFixture);

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

  describe('when called, and useSelector() returns a valid token', () => {
    let shownPage: Element | null;

    beforeAll(() => {
      tokenFixture = 'jwt token fixture';

      (
        useAppSelector as unknown as jest.Mock<typeof useAppSelector>
      ).mockReturnValueOnce(tokenFixture);

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
