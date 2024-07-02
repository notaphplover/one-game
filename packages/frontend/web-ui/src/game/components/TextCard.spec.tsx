import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { RenderResult, render } from '@testing-library/react';

import { TextCard, TextCardOptions } from './TextCard';

describe(TextCard.name, () => {
  let textCardOptionsMock: TextCardOptions;

  beforeAll(() => {
    textCardOptionsMock = {
      colorClass: 'blue-card',
      text: '4',
    };
  });

  describe('when called', () => {
    let existingCardColorClassName: string;
    let valueCard: string | null | undefined;

    beforeAll(() => {
      const renderResult: RenderResult = render(
        <TextCard
          colorClass={textCardOptionsMock.colorClass}
          text={textCardOptionsMock.text}
        ></TextCard>,
      );

      const cardColor: HTMLElement = renderResult.container.querySelector(
        '.blue-card',
      ) as HTMLElement;

      existingCardColorClassName = window
        .getComputedStyle(cardColor)
        .getPropertyValue('display');

      valueCard = cardColor.firstChild?.textContent;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should show a card with background blue', () => {
      expect(existingCardColorClassName).not.toBe('none');
    });

    it('should show a card with value 4', () => {
      expect(valueCard).toBe('4');
    });
  });
});
