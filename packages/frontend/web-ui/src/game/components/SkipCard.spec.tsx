jest.mock('../helpers/getCardColorClassName');
jest.mock(
  '../helpers/getImageCardUrl',
  () => ({ getImageCardUrl: jest.fn() }),
  {
    virtual: true,
  },
);

import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { render, RenderResult } from '@testing-library/react';

import { getCardColorClassName } from '../helpers/getCardColorClassName';
import { getImageCardUrl } from '../helpers/getImageCardUrl';
import { SkipCard, SkipCardOptions } from './SkipCard';

describe(SkipCard.name, () => {
  let skipCardOptionsFixture: SkipCardOptions;
  let classNameFixture: string;
  let imageUrlFixture: string;
  let onDoubleClickMock: jest.Mock<() => void> | undefined;

  beforeAll(() => {
    skipCardOptionsFixture = {
      card: {
        color: 'blue',
        kind: 'skip',
      },
    };

    classNameFixture = 'blue-card';
    imageUrlFixture = 'image-url-fixture';
    onDoubleClickMock = jest.fn();
  });

  describe('when called', () => {
    let isExpectedClassNameInCard: boolean;
    let imageSourceUrl: string | null | undefined;

    beforeAll(() => {
      (
        getCardColorClassName as jest.Mock<typeof getCardColorClassName>
      ).mockReturnValueOnce(classNameFixture);

      (
        getImageCardUrl as jest.Mock<typeof getImageCardUrl>
      ).mockReturnValueOnce(imageUrlFixture);

      const renderResult: RenderResult = render(
        <SkipCard
          card={skipCardOptionsFixture.card}
          onDoubleClick={() => onDoubleClickMock}
        ></SkipCard>,
      );

      const cardColor: HTMLElement = renderResult.container.querySelector(
        '.cornie-card-inner-content',
      ) as HTMLElement;

      isExpectedClassNameInCard =
        cardColor.classList.contains(classNameFixture);

      imageSourceUrl = cardColor.querySelector('img')?.getAttribute('src');
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should have been called getCardColorClassName once', () => {
      expect(getCardColorClassName).toHaveBeenCalledTimes(1);
    });

    it('should have been called getImageCardUrl once', () => {
      expect(getImageCardUrl).toHaveBeenCalledTimes(1);
    });

    it('should contain a div with a blue-card className', () => {
      expect(isExpectedClassNameInCard).toBe(true);
    });

    it('should show a card with src image', () => {
      expect(imageSourceUrl).toStrictEqual(imageUrlFixture);
    });
  });
});
