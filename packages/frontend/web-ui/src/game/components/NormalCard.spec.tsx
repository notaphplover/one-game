jest.mock('../helpers/getCardColorClassName');

import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { render, RenderResult } from '@testing-library/react';

import { getCardColorClassName } from '../helpers/getCardColorClassName';
import { NormalCard, NormalCardOptions } from './NormalCard';

describe(NormalCard.name, () => {
  let normalCardOptionsFixture: NormalCardOptions;
  let classNameFixture: string;

  beforeAll(() => {
    normalCardOptionsFixture = {
      card: {
        color: 'blue',
        kind: 'normal',
        number: 4,
      },
    };

    classNameFixture = 'blue-card';
  });

  describe('when called', () => {
    let isExpectedClassNameInCard: boolean;
    let cardValue: string | null | undefined;

    beforeAll(() => {
      (
        getCardColorClassName as jest.Mock<typeof getCardColorClassName>
      ).mockReturnValueOnce(classNameFixture);

      const renderResult: RenderResult = render(
        <NormalCard card={normalCardOptionsFixture.card}></NormalCard>,
      );

      const cardColor: HTMLElement = renderResult.container.querySelector(
        '.cornie-card-inner-content',
      ) as HTMLElement;

      isExpectedClassNameInCard =
        cardColor.classList.contains(classNameFixture);

      cardValue = cardColor.firstChild?.textContent;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should have been called getCardColorClassName once', () => {
      expect(getCardColorClassName).toHaveBeenCalledTimes(1);
    });

    it('should contain a div with a blue-card className', () => {
      expect(isExpectedClassNameInCard).toBe(true);
    });

    it('should show a card with value 4', () => {
      expect(cardValue).toBe(normalCardOptionsFixture.card.number.toString());
    });
  });
});
