import { beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../helpers/getSlug');
jest.mock('../layout/CornieLayout');

import { render, RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { getSlug } from '../helpers/getSlug';
import { PageName } from '../models/PageName';
import { PageNotFound } from './PageNotFound';

describe(PageNotFound.name, () => {
  describe('when called', () => {
    let slugFixture: string;

    let homeLinkElement: HTMLElement;

    beforeAll(() => {
      slugFixture = '/slug-fixture';

      (getSlug as jest.Mock<typeof getSlug>).mockReturnValueOnce(slugFixture);

      const renderResult: RenderResult = render(
        <MemoryRouter>
          <PageNotFound />
        </MemoryRouter>,
      );

      homeLinkElement = renderResult.getByTestId('home-link');
    });

    it('should call getSlug()', () => {
      expect(getSlug).toHaveBeenCalledTimes(1);
      expect(getSlug).toHaveBeenCalledWith(PageName.home);
    });

    it('should render home link element', () => {
      const homeLinkHref: Attr | null =
        homeLinkElement.attributes.getNamedItem('href');

      expect(homeLinkElement.innerHTML).toStrictEqual(
        expect.stringContaining('Return home'),
      );
      expect(homeLinkHref?.value).toBe(slugFixture);
    });
  });
});
