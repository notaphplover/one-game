jest.mock('../helpers/getCardColorClassName');
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

import skipCardImageUrl from '../../app/images/cards/skip.svg';
import { getCardColorClassName } from '../helpers/getCardColorClassName';
import { getImageCardUrl } from '../helpers/getImageCardUrl';
import { SkipCard, SkipCardOptions } from './SkipCard';

describe(SkipCard.name, () => {
  let skipCardOptionsFixture: SkipCardOptions;
  let classNameFixture: string;

  beforeAll(() => {
    skipCardOptionsFixture = {
      card: {
        color: 'blue',
        kind: 'skip',
      },
    };

    classNameFixture = 'blue-card';
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
      ).mockReturnValueOnce(skipCardImageUrl);

      const renderResult: RenderResult = render(
        <SkipCard card={skipCardOptionsFixture.card}></SkipCard>,
      );

      const cardColor: HTMLElement = renderResult.container.querySelector(
        '.cornie-base-card-inner-content',
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
      expect(imageSourceUrl).toStrictEqual(skipCardImageUrl);
    });
  });
});
