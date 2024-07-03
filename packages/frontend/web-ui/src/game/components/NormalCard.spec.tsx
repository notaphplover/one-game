jest.mock('../helpers/getCardColorClassName');

import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { RenderResult, render } from '@testing-library/react';

import { getCardColorClassName } from '../helpers/getCardColorClassName';
import { NormalCard, NormalCardOptions } from './NormalCard';

describe(NormalCard.name, () => {
  let normalCardOptionsMock: NormalCardOptions;

  beforeAll(() => {
    normalCardOptionsMock = {
      card: {
        color: 'blue',
        kind: 'normal',
        number: 4,
      },
    };
  });

  describe('when called', () => {
    let existingCardColorClassName: string;
    let valueCard: string | null | undefined;

    beforeAll(() => {
      (
        getCardColorClassName as jest.Mock<typeof getCardColorClassName>
      ).mockReturnValueOnce('blue-card');

      const renderResult: RenderResult = render(
        <NormalCard card={normalCardOptionsMock.card}></NormalCard>,
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

    it('should have been called getCardColorClassName once', () => {
      expect(getCardColorClassName).toHaveBeenCalledTimes(1);
    });

    it('should show a card with background blue', () => {
      expect(existingCardColorClassName).not.toBe('none');
    });

    it('should show a card with value 4', () => {
      expect(valueCard).toBe('4');
    });
  });
});
