jest.mock('../helpers/getImageCard');

import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { RenderResult, render } from '@testing-library/react';

import { getImageCard } from '../helpers/getImageCard';
import { WildCard, WildCardOptions } from './WildCard';

describe(WildCard.name, () => {
  let wildCardOptionsFixture: WildCardOptions;
  let imagePathFixture: string;

  beforeAll(() => {
    wildCardOptionsFixture = {
      card: {
        kind: 'wild',
      },
      colorClass: 'white-color',
    };

    imagePathFixture = '/src/app/images/wild.ico';
  });

  describe('when called', () => {
    let isExpectedClassNameInCard: boolean;
    let valueImageCard: string | null | undefined;

    beforeAll(() => {
      (getImageCard as jest.Mock<typeof getImageCard>).mockReturnValueOnce(
        imagePathFixture,
      );

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
