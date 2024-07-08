jest.mock('../helpers/getCardColorClassName');
jest.mock('../helpers/getImageCard');

import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { RenderResult, render } from '@testing-library/react';

import { getCardColorClassName } from '../helpers/getCardColorClassName';
import { getImageCard } from '../helpers/getImageCard';
import { SkipCard, SkipCardOptions } from './SkipCard';

describe(SkipCard.name, () => {
  let skipCardOptionsFixture: SkipCardOptions;
  let classNameFixture: string;
  let imagePathFixture: string;

  beforeAll(() => {
    skipCardOptionsFixture = {
      card: {
        color: 'blue',
        kind: 'skip',
      },
    };

    classNameFixture = 'blue-card';
    imagePathFixture = '/src/app/images/skip.ico';
  });

  describe('when called', () => {
    let isExpectedClassNameInCard: boolean;
    let valueImageCard: string | null | undefined;

    beforeAll(() => {
      (
        getCardColorClassName as jest.Mock<typeof getCardColorClassName>
      ).mockReturnValueOnce(classNameFixture);

      (getImageCard as jest.Mock<typeof getImageCard>).mockReturnValueOnce(
        imagePathFixture,
      );

      const renderResult: RenderResult = render(
        <SkipCard card={skipCardOptionsFixture.card}></SkipCard>,
      );

      const cardColor: HTMLElement = renderResult.container.querySelector(
        '.cornie-base-card-inner-content',
      ) as HTMLElement;

      isExpectedClassNameInCard =
        cardColor.classList.contains(classNameFixture);

      valueImageCard = cardColor.querySelector('img')?.getAttribute('src');
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should have been called getCardColorClassName once', () => {
      expect(getCardColorClassName).toHaveBeenCalledTimes(1);
    });

    it('should have been called getImageCard once', () => {
      expect(getImageCard).toHaveBeenCalledTimes(1);
    });

    it('should contain a div with a blue-card className', () => {
      expect(isExpectedClassNameInCard).toBe(true);
    });

    it('should show a card with src image', () => {
      expect(valueImageCard).toStrictEqual(imagePathFixture);
    });
  });
});
