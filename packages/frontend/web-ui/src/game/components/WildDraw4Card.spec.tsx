jest.mock('../helpers/getImageCard');

import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { RenderResult, render } from '@testing-library/react';

import { getImageCard } from '../helpers/getImageCard';
import { WildDraw4Card, WildDraw4CardOptions } from './WildDraw4Card';

describe(WildDraw4Card.name, () => {
  let wildDraw4CardOptionsFixture: WildDraw4CardOptions;
  let imagePathFixture: string;

  beforeAll(() => {
    wildDraw4CardOptionsFixture = {
      card: {
        kind: 'wildDraw4',
      },
      colorClass: 'white-color',
    };

    imagePathFixture = '/src/app/images/wildDraw4.ico';
  });

  describe('when called', () => {
    let isExpectedClassNameInCard: boolean;
    let valueImageCard: string | null | undefined;

    beforeAll(() => {
      (getImageCard as jest.Mock<typeof getImageCard>).mockReturnValueOnce(
        imagePathFixture,
      );

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

      valueImageCard = cardColor.querySelector('img')?.getAttribute('src');
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should have been called getImageCard once', () => {
      expect(getImageCard).toHaveBeenCalledTimes(1);
    });

    it('should contain a div with a white-color className', () => {
      expect(isExpectedClassNameInCard).toBe(true);
    });

    it('should show a card with src image', () => {
      expect(valueImageCard).toStrictEqual(imagePathFixture);
    });
  });
});
