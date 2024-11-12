jest.mock('../helpers/getCardColorClassName');
jest.mock(
  '../helpers/getImageCardUrl',
  () => ({ getImageCardUrl: jest.fn() }),
  {
    virtual: true,
  },
);

import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import { MouseEvent } from 'react';

import { getCardColorClassName } from '../helpers/getCardColorClassName';
import { getImageCardUrl } from '../helpers/getImageCardUrl';
import { DrawCard, DrawCardOptions } from './DrawCard';

describe(DrawCard.name, () => {
  let drawCardOptionsFixture: DrawCardOptions;
  let classNameFixture: string;
  let selectedClassName: string;
  let isSelectedFixture: boolean;
  let imageUrlFixture: string;
  let onClickMock: jest.Mock<(event: MouseEvent) => void>;

  beforeAll(() => {
    drawCardOptionsFixture = {
      card: {
        color: 'blue',
        kind: 'draw',
      },
    };

    classNameFixture = 'blue-card';
    selectedClassName = 'selected';
    imageUrlFixture = 'image-url-fixture';
    isSelectedFixture = true;
    onClickMock = jest.fn();
  });

  describe('when called', () => {
    let isExpectedClassNameInCard: boolean;
    let isSelectedCard: boolean;
    let imageSourceUrl: string | null | undefined;

    beforeAll(() => {
      (
        getCardColorClassName as jest.Mock<typeof getCardColorClassName>
      ).mockReturnValueOnce(classNameFixture);

      (
        getImageCardUrl as jest.Mock<typeof getImageCardUrl>
      ).mockReturnValueOnce(imageUrlFixture);

      const renderResult: RenderResult = render(
        <DrawCard
          card={drawCardOptionsFixture.card}
          isSelected={isSelectedFixture}
          onClick={onClickMock}
        ></DrawCard>,
      );

      const cardColor: HTMLElement = renderResult.container.querySelector(
        '.cornie-card-inner-content',
      ) as HTMLElement;

      isExpectedClassNameInCard =
        cardColor.classList.contains(classNameFixture);

      imageSourceUrl = cardColor.querySelector('img')?.getAttribute('src');

      const divSelectedCard: HTMLElement = renderResult.container.querySelector(
        '.cornie-card',
      ) as HTMLElement;

      isSelectedCard = divSelectedCard.classList.contains(selectedClassName);

      const selectedCard: Element | null = renderResult.container.querySelector(
        '.cornie-card-inner-content',
      ) as Element;

      fireEvent.click(selectedCard);

      void waitFor(() => {
        // eslint-disable-next-line jest/no-standalone-expect
        expect(onClickMock).toHaveBeenCalledTimes(1);
      });
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

    it('should contain a div with selected className', () => {
      expect(isSelectedCard).toBe(true);
    });

    it('should show a card with src image', () => {
      expect(imageSourceUrl).toStrictEqual(imageUrlFixture);
    });

    it('should call a onClick()', () => {
      expect(onClickMock).toHaveBeenCalledTimes(1);
      expect(onClickMock).toHaveBeenCalledWith(expect.any(Object));
    });
  });
});
