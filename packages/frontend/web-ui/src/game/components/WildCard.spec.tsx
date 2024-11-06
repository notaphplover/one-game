jest.mock(
  '../helpers/getImageCardUrl',
  () => ({ getImageCardUrl: jest.fn() }),
  {
    virtual: true,
  },
);

import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { render, RenderResult } from '@testing-library/react';

import { getImageCardUrl } from '../helpers/getImageCardUrl';
import { WildCard, WildCardOptions } from './WildCard';

describe(WildCard.name, () => {
  let wildCardOptionsFixture: WildCardOptions;
  let imageUrlFixture: string;
  let onDoubleClickMock: jest.Mock<() => void> | undefined;

  beforeAll(() => {
    wildCardOptionsFixture = {
      card: {
        kind: 'wild',
      },
      colorClass: 'white-color',
    };

    imageUrlFixture = 'image-url-fixture';
    onDoubleClickMock = jest.fn();
  });

  describe('when called', () => {
    let isExpectedClassNameInCard: boolean;
    let imageSourceUrl: string | null | undefined;

    beforeAll(() => {
      (
        getImageCardUrl as jest.Mock<typeof getImageCardUrl>
      ).mockReturnValueOnce(imageUrlFixture);

      const renderResult: RenderResult = render(
        <WildCard
          card={wildCardOptionsFixture.card}
          colorClass={wildCardOptionsFixture.colorClass}
          onDoubleClick={() => onDoubleClickMock}
        ></WildCard>,
      );

      const cardColor: HTMLElement = renderResult.container.querySelector(
        '.cornie-card-inner-content',
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
      expect(imageSourceUrl).toStrictEqual(imageUrlFixture);
    });
  });
});
