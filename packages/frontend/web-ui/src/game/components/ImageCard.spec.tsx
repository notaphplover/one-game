import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { RenderResult, render } from '@testing-library/react';

import { ImageCard, ImageCardOptions } from './ImageCard';

describe(ImageCard.name, () => {
  let imageCardOptionsMock: ImageCardOptions;

  beforeAll(() => {
    imageCardOptionsMock = {
      colorClass: 'blue-card',
      image: '/src/app/images/favicon.ico',
    };
  });

  describe('when called', () => {
    let existingCardColorClassName: string;
    let valueImageCard: string | null | undefined;

    beforeAll(() => {
      const renderResult: RenderResult = render(
        <ImageCard
          colorClass={imageCardOptionsMock.colorClass}
          image={imageCardOptionsMock.image}
        ></ImageCard>,
      );

      const cardColor: HTMLElement = renderResult.container.querySelector(
        '.blue-card',
      ) as HTMLElement;

      existingCardColorClassName = window
        .getComputedStyle(cardColor)
        .getPropertyValue('display');

      valueImageCard = renderResult.container
        .querySelector('img')
        ?.getAttribute('src');
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should show a card with background blue', () => {
      expect(existingCardColorClassName).not.toBe('none');
    });

    it('should show a card with src image', () => {
      expect(valueImageCard).toBe('/src/app/images/favicon.ico');
    });
  });
});
