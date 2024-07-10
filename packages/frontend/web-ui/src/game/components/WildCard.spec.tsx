jest.mock('../helpers/getImageCardUrl');
jest.mock('../../app/images/cards/draw.svg', () => 'draw-url-fixture', {
  virtual: true,
});
jest.mock('../../app/images/cards/reverse.svg', () => 'reverse-url-fixture', {
  virtual: true,
});
jest.mock('../../app/images/cards/skip.svg', () => 'skip-url-fixture', {
  virtual: true,
});
jest.mock('../../app/images/cards/wild.svg', () => 'wild-url-fixture', {
  virtual: true,
});
jest.mock(
  '../../app/images/cards/wildDraw4.svg',
  () => 'wild-draw-4-url-fixture',
  {
    virtual: true,
  },
);

import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { RenderResult, render } from '@testing-library/react';

import wildCardImageUrl from '../../app/images/cards/wild.svg';
import { getImageCardUrl } from '../helpers/getImageCardUrl';
import { WildCard, WildCardOptions } from './WildCard';

describe(WildCard.name, () => {
  let wildCardOptionsFixture: WildCardOptions;

  beforeAll(() => {
    wildCardOptionsFixture = {
      card: {
        kind: 'wild',
      },
      colorClass: 'white-color',
    };
  });

  describe('when called', () => {
    let isExpectedClassNameInCard: boolean;
    let imageSourceUrl: string | null | undefined;

    beforeAll(() => {
      (
        getImageCardUrl as jest.Mock<typeof getImageCardUrl>
      ).mockReturnValueOnce(wildCardImageUrl);

      const renderResult: RenderResult = render(
        <WildCard
          card={wildCardOptionsFixture.card}
          colorClass={wildCardOptionsFixture.colorClass}
        ></WildCard>,
      );

      const cardColor: HTMLElement = renderResult.container.querySelector(
        '.cornie-base-card-inner-content',
      ) as HTMLElement;

      isExpectedClassNameInCard = cardColor.classList.contains(
        wildCardOptionsFixture.colorClass,
      );

      imageSourceUrl = cardColor.querySelector('img')?.getAttribute('src');
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should have been called getImageCard once', () => {
      expect(getImageCardUrl).toHaveBeenCalledTimes(1);
    });

    it('should contain a div with a white-color className', () => {
      expect(isExpectedClassNameInCard).toBe(true);
    });

    it('should show a card with src image', () => {
      expect(imageSourceUrl).toStrictEqual(wildCardImageUrl);
    });
  });
});
