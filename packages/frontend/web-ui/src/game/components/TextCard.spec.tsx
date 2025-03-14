import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import { MouseEvent } from 'react';

import { TextCard, TextCardOptions } from './TextCard';

describe(TextCard.name, () => {
  let selectedClassName: string;
  let isSelectedFixture: boolean;
  let textCardOptionsFixture: TextCardOptions;
  let onClickMock: jest.Mock<(event: MouseEvent) => void>;

  beforeAll(() => {
    selectedClassName = 'selected';
    isSelectedFixture = true;
    textCardOptionsFixture = {
      colorClass: 'blue-card',
      text: '4',
    };
    onClickMock = jest.fn();
  });

  describe('when called', () => {
    let isExpectedClassNameInCard: boolean;
    let cardValue: string | null | undefined;
    let isSelectedCard: boolean;

    beforeAll(() => {
      const renderResult: RenderResult = render(
        <TextCard
          colorClass={textCardOptionsFixture.colorClass}
          isSelected={isSelectedFixture}
          text={textCardOptionsFixture.text}
          onClick={onClickMock}
        ></TextCard>,
      );

      const cardColor: HTMLElement = renderResult.container.querySelector(
        '.cornie-card-inner-content',
      ) as HTMLElement;

      isExpectedClassNameInCard = cardColor.classList.contains(
        textCardOptionsFixture.colorClass,
      );

      cardValue = cardColor.firstChild?.textContent;

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

    it('should contain a div with a blue-card className', () => {
      expect(isExpectedClassNameInCard).toBe(true);
    });

    it('should contain a div with selected className', () => {
      expect(isSelectedCard).toBe(true);
    });

    it('should show a card with value 4', () => {
      expect(cardValue).toBe(textCardOptionsFixture.text);
    });

    it('should call a onClick()', () => {
      expect(onClickMock).toHaveBeenCalledTimes(1);
      expect(onClickMock).toHaveBeenCalledWith(expect.any(Object));
    });
  });
});
