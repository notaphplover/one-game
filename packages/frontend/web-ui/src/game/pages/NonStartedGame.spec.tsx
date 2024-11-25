import { beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../common/helpers/getSlug');
jest.mock('../../common/layout/CornieLayout');

import { render, RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { getSlug } from '../../common/helpers/getSlug';
import { PageName } from '../../common/models/PageName';
import { NonStartedGame } from './NonStartedGame';

describe(NonStartedGame.name, () => {
  describe('when called', () => {
    let slugFixture: string;

    let homeLinkElement: HTMLElement;

    beforeAll(() => {
      slugFixture = '/slug-fixture';

      (getSlug as jest.Mock<typeof getSlug>).mockReturnValueOnce(slugFixture);

      const renderResult: RenderResult = render(
        <MemoryRouter>
          <NonStartedGame />
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
