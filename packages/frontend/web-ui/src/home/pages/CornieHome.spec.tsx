import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('react-redux', () => {
  return {
    ...(jest.requireActual('react-redux') ?? {}),
    useSelector: jest.fn(),
  };
});

import { RenderResult, render } from '@testing-library/react';
import { UseSelector, useSelector } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { CornieHome } from './CornieHome';

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
        useSelector as Partial<UseSelector<unknown>> as jest.Mock<
          typeof useSelector
        >
      ).mockImplementation((() => ({
        token: tokenFixture,
      })) as Partial<UseSelector<unknown>> as UseSelector<unknown>);

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
        useSelector as Partial<UseSelector<unknown>> as jest.Mock<
          typeof useSelector
        >
      ).mockImplementation((() => ({
        token: tokenFixture,
      })) as Partial<UseSelector<unknown>> as UseSelector<unknown>);

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
