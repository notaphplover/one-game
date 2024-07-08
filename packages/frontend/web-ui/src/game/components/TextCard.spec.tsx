import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { RenderResult, render } from '@testing-library/react';

import { TextCard, TextCardOptions } from './TextCard';

describe(TextCard.name, () => {
  let textCardOptionsFixture: TextCardOptions;

  beforeAll(() => {
    textCardOptionsFixture = {
      colorClass: 'blue-card',
      text: '4',
    };
  });

  describe('when called', () => {
    let existingCardColorClassName: boolean;
    let valueCard: string | null | undefined;

    beforeAll(() => {
      const renderResult: RenderResult = render(
        <TextCard
          colorClass={textCardOptionsFixture.colorClass}
          text={textCardOptionsFixture.text}
        ></TextCard>,
      );

      const cardColor: HTMLElement = renderResult.container.querySelector(
        '.cornie-base-card-inner-content',
      ) as HTMLElement;

      existingCardColorClassName = cardColor.classList.contains(
        textCardOptionsFixture.colorClass,
      );

      valueCard = cardColor.firstChild?.textContent;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should contain a div with a blue-card className', () => {
      expect(existingCardColorClassName).toBe(true);
    });

    it('should show a card with value 4', () => {
      expect(valueCard).toBe(textCardOptionsFixture.text);
    });
  });
});
