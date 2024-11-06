import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import { MouseEvent } from 'react';

import { ImageCard, ImageCardOptions } from './ImageCard';

describe(ImageCard.name, () => {
  let imageCardOptionsFixture: ImageCardOptions;
  let onDoubleClickMock: jest.Mock<(event: MouseEvent) => void>;

  beforeAll(() => {
    imageCardOptionsFixture = {
      colorClass: 'blue-card',
      image: '/assets/image.png',
    };
    onDoubleClickMock = jest.fn();
  });

  describe('when called', () => {
    let isExpectedClassNameInCard: boolean;
    let imageSourceUrl: string | null | undefined;

    beforeAll(() => {
      const renderResult: RenderResult = render(
        <ImageCard
          colorClass={imageCardOptionsFixture.colorClass}
          image={imageCardOptionsFixture.image}
          onDoubleClick={onDoubleClickMock}
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

      const selectedCard: Element | null = renderResult.container.querySelector(
        '.cornie-card-inner-content',
      ) as Element;

      fireEvent.dblClick(selectedCard);

      void waitFor(() => {
        // eslint-disable-next-line jest/no-standalone-expect
        expect(onDoubleClickMock).toHaveBeenCalledTimes(1);
      });
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

    it('should call a onDoubleClick()', () => {
      expect(onDoubleClickMock).toHaveBeenCalledTimes(1);
      expect(onDoubleClickMock).toHaveBeenCalledWith(expect.any(Object));
    });
  });
});
