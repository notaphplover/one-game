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

import wildDraw4CardImageUrl from '../../app/images/cards/wildDraw4.svg';
import { getImageCardUrl } from '../helpers/getImageCardUrl';
import { WildDraw4Card, WildDraw4CardOptions } from './WildDraw4Card';

describe(WildDraw4Card.name, () => {
  let wildDraw4CardOptionsFixture: WildDraw4CardOptions;

  beforeAll(() => {
    wildDraw4CardOptionsFixture = {
      card: {
        kind: 'wildDraw4',
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
      ).mockReturnValueOnce(wildDraw4CardImageUrl);

      const renderResult: RenderResult = render(
        <WildDraw4Card
          card={wildDraw4CardOptionsFixture.card}
          colorClass={wildDraw4CardOptionsFixture.colorClass}
        ></WildDraw4Card>,
      );

      const cardColor: HTMLElement = renderResult.container.querySelector(
        '.cornie-base-card-inner-content',
      ) as HTMLElement;

      isExpectedClassNameInCard = cardColor.classList.contains(
        wildDraw4CardOptionsFixture.colorClass,
      );

      imageSourceUrl = cardColor.querySelector('img')?.getAttribute('src');
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should have been called getImageCardUrl once', () => {
      expect(getImageCardUrl).toHaveBeenCalledTimes(1);
    });

    it('should contain a div with a white-color className', () => {
      expect(isExpectedClassNameInCard).toBe(true);
    });

    it('should show a card with src image', () => {
      expect(imageSourceUrl).toStrictEqual(wildDraw4CardImageUrl);
    });
  });
});
