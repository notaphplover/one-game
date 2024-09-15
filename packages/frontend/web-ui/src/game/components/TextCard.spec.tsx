import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { render, RenderResult } from '@testing-library/react';

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
    let isExpectedClassNameInCard: boolean;
    let cardValue: string | null | undefined;

    beforeAll(() => {
      const renderResult: RenderResult = render(
        <TextCard
          colorClass={textCardOptionsFixture.colorClass}
          text={textCardOptionsFixture.text}
        ></TextCard>,
      );

      const cardColor: HTMLElement = renderResult.container.querySelector(
        '.cornie-card-inner-content',
      ) as HTMLElement;

      isExpectedClassNameInCard = cardColor.classList.contains(
        textCardOptionsFixture.colorClass,
      );

      cardValue = cardColor.firstChild?.textContent;
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
  });
});
