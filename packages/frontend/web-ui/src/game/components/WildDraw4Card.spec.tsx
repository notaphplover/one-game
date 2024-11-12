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

import { getImageCardUrl } from '../helpers/getImageCardUrl';
import { WildDraw4Card, WildDraw4CardOptions } from './WildDraw4Card';

describe(WildDraw4Card.name, () => {
  let wildDraw4CardOptionsFixture: WildDraw4CardOptions;
  let selectedClassName: string;
  let isSelectedFixture: boolean;
  let imageUrlFixture: string;
  let onDoubleClickMock: jest.Mock<(event: MouseEvent) => void>;

  beforeAll(() => {
    selectedClassName = 'selected';
    isSelectedFixture = true;
    wildDraw4CardOptionsFixture = {
      card: {
        kind: 'wildDraw4',
      },
      colorClass: 'white-color',
    };

    imageUrlFixture = 'image-url-fixture';
    onDoubleClickMock = jest.fn();
  });

  describe('when called', () => {
    let isExpectedClassNameInCard: boolean;
    let imageSourceUrl: string | null | undefined;
    let isSelectedCard: boolean;

    beforeAll(() => {
      (
        getImageCardUrl as jest.Mock<typeof getImageCardUrl>
      ).mockReturnValueOnce(imageUrlFixture);

      const renderResult: RenderResult = render(
        <WildDraw4Card
          card={wildDraw4CardOptionsFixture.card}
          colorClass={wildDraw4CardOptionsFixture.colorClass}
          isSelected={isSelectedFixture}
          onDoubleClick={onDoubleClickMock}
        ></WildDraw4Card>,
      );

      const cardColor: HTMLElement = renderResult.container.querySelector(
        '.cornie-card-inner-content',
      ) as HTMLElement;

      isExpectedClassNameInCard = cardColor.classList.contains(
        wildDraw4CardOptionsFixture.colorClass,
      );

      imageSourceUrl = cardColor.querySelector('img')?.getAttribute('src');

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

    it('should have been called getImageCardUrl once', () => {
      expect(getImageCardUrl).toHaveBeenCalledTimes(1);
    });

    it('should contain a div with a white-color className', () => {
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
