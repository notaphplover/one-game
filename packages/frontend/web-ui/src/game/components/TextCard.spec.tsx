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
  let textCardOptionsFixture: TextCardOptions;
  let onDoubleClickMock: jest.Mock<(event: MouseEvent) => void>;

  beforeAll(() => {
    textCardOptionsFixture = {
      colorClass: 'blue-card',
      text: '4',
    };
    onDoubleClickMock = jest.fn();
  });

  describe('when called', () => {
    let isExpectedClassNameInCard: boolean;
    let cardValue: string | null | undefined;

    beforeAll(() => {
      const renderResult: RenderResult = render(
        <TextCard
          colorClass={textCardOptionsFixture.colorClass}
          text={textCardOptionsFixture.text}
          onDoubleClick={onDoubleClickMock}
        ></TextCard>,
      );

      const cardColor: HTMLElement = renderResult.container.querySelector(
        '.cornie-card-inner-content',
      ) as HTMLElement;

      isExpectedClassNameInCard = cardColor.classList.contains(
        textCardOptionsFixture.colorClass,
      );

      cardValue = cardColor.firstChild?.textContent;

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

    it('should show a card with value 4', () => {
      expect(cardValue).toBe(textCardOptionsFixture.text);
    });

    it('should call a onDoubleClick()', () => {
      expect(onDoubleClickMock).toHaveBeenCalledTimes(1);
      expect(onDoubleClickMock).toHaveBeenCalledWith(expect.any(Object));
    });
  });
});
