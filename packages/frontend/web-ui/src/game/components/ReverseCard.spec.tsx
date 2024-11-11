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
import { ReverseCard, ReverseCardOptions } from './ReverseCard';

describe(ReverseCard.name, () => {
  let reverseCardOptionsFixture: ReverseCardOptions;
  let classNameFixture: string;
  let classNameSelected: string;
  let isSelectedFixture: boolean;
  let imageUrlFixture: string;
  let onDoubleClickMock: jest.Mock<(event: MouseEvent) => void>;

  beforeAll(() => {
    reverseCardOptionsFixture = {
      card: {
        color: 'blue',
        kind: 'reverse',
      },
    };

    classNameFixture = 'blue-card';
    classNameSelected = 'selected';
    imageUrlFixture = 'image-url-fixture';
    isSelectedFixture = true;
    onDoubleClickMock = jest.fn();
  });

  describe('when called', () => {
    let isExpectedClassNameInCard: boolean;
    let imageSourceUrl: string | null | undefined;
    let isSelectedCard: boolean;

    beforeAll(() => {
      (
        getCardColorClassName as jest.Mock<typeof getCardColorClassName>
      ).mockReturnValueOnce(classNameFixture);

      (
        getImageCardUrl as jest.Mock<typeof getImageCardUrl>
      ).mockReturnValueOnce(imageUrlFixture);

      const renderResult: RenderResult = render(
        <ReverseCard
          card={reverseCardOptionsFixture.card}
          isSelected={isSelectedFixture}
          onDoubleClick={onDoubleClickMock}
        ></ReverseCard>,
      );

      const cardColor: HTMLElement = renderResult.container.querySelector(
        '.cornie-card-inner-content',
      ) as HTMLElement;

      isExpectedClassNameInCard =
        cardColor.classList.contains(classNameFixture);

      const divSelectedCard: HTMLElement = renderResult.container.querySelector(
        '.cornie-card',
      ) as HTMLElement;

      isSelectedCard = divSelectedCard.classList.contains(classNameSelected);

      imageSourceUrl = cardColor.querySelector('img')?.getAttribute('src');

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

    it('should call a onDoubleClick()', () => {
      expect(onDoubleClickMock).toHaveBeenCalledTimes(1);
      expect(onDoubleClickMock).toHaveBeenCalledWith(expect.any(Object));
    });
  });
});
