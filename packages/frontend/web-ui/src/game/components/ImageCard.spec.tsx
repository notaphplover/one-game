import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { render, RenderResult } from '@testing-library/react';

import { ImageCard, ImageCardOptions } from './ImageCard';

describe(ImageCard.name, () => {
  let imageCardOptionsFixture: ImageCardOptions;

  beforeAll(() => {
    imageCardOptionsFixture = {
      colorClass: 'blue-card',
      image: '/assets/image.png',
    };
  });

  describe('when called', () => {
    let isExpectedClassNameInCard: boolean;
    let imageSourceUrl: string | null | undefined;

    beforeAll(() => {
      const renderResult: RenderResult = render(
        <ImageCard
          colorClass={imageCardOptionsFixture.colorClass}
          image={imageCardOptionsFixture.image}
        ></ImageCard>,
      );

      const cardColor: HTMLElement = renderResult.container.querySelector(
        '.cornie-card-inner-content',
      ) as HTMLElement;

      isExpectedClassNameInCard = cardColor.classList.contains(
        imageCardOptionsFixture.colorClass,
      );

      imageSourceUrl = renderResult.container
        .querySelector('img')
        ?.getAttribute('src');
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should contain a div with a blue-card className', () => {
      expect(isExpectedClassNameInCard).toBe(true);
    });

    it('should show a card with src image', () => {
      expect(imageSourceUrl).toBe(imageCardOptionsFixture.image);
    });
  });
});
