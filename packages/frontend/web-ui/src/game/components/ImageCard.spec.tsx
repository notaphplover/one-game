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
  let selectedClassName: string;
  let imageCardOptionsFixture: ImageCardOptions;
  let isSelectedFixture: boolean;
  let onDoubleClickMock: jest.Mock<(event: MouseEvent) => void>;

  beforeAll(() => {
    selectedClassName = 'selected';
    imageCardOptionsFixture = {
      colorClass: 'blue-card',
      image: '/assets/image.png',
    };
    isSelectedFixture = true;
    onDoubleClickMock = jest.fn();
  });

  describe('when called', () => {
    let isExpectedClassNameInCard: boolean;
    let imageSourceUrl: string | null | undefined;
    let isSelectedCard: boolean;

    beforeAll(() => {
      const renderResult: RenderResult = render(
        <ImageCard
          colorClass={imageCardOptionsFixture.colorClass}
          image={imageCardOptionsFixture.image}
          isSelected={isSelectedFixture}
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

      const divSelectedCard: HTMLElement = renderResult.container.querySelector(
        '.cornie-card',
      ) as HTMLElement;

      isSelectedCard = divSelectedCard.classList.contains(selectedClassName);

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

    it('should contain a div with selected className', () => {
      expect(isSelectedCard).toBe(true);
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
