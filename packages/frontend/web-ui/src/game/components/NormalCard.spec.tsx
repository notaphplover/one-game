jest.mock('../helpers/getCardColorClassName');

import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import { MouseEvent } from 'react';

import { getCardColorClassName } from '../helpers/getCardColorClassName';
import { NormalCard, NormalCardOptions } from './NormalCard';

describe(NormalCard.name, () => {
  let normalCardOptionsFixture: NormalCardOptions;
  let classNameFixture: string;
  let classNameSelected: string;
  let isSelectedFixture: boolean;
  let onDoubleClickMock: jest.Mock<(event: MouseEvent) => void>;

  beforeAll(() => {
    normalCardOptionsFixture = {
      card: {
        color: 'blue',
        kind: 'normal',
        number: 4,
      },
    };

    classNameFixture = 'blue-card';
    classNameSelected = 'selected';
    isSelectedFixture = true;
    onDoubleClickMock = jest.fn();
  });

  describe('when called', () => {
    let isExpectedClassNameInCard: boolean;
    let cardValue: string | null | undefined;
    let isSelectedCard: boolean;

    beforeAll(() => {
      (
        getCardColorClassName as jest.Mock<typeof getCardColorClassName>
      ).mockReturnValueOnce(classNameFixture);

      const renderResult: RenderResult = render(
        <NormalCard
          card={normalCardOptionsFixture.card}
          isSelected={isSelectedFixture}
          onDoubleClick={onDoubleClickMock}
        ></NormalCard>,
      );

      const cardColor: HTMLElement = renderResult.container.querySelector(
        '.cornie-card-inner-content',
      ) as HTMLElement;

      isExpectedClassNameInCard =
        cardColor.classList.contains(classNameFixture);

      cardValue = cardColor.firstChild?.textContent;

      const divSelectedCard: HTMLElement = renderResult.container.querySelector(
        '.cornie-card',
      ) as HTMLElement;

      isSelectedCard = divSelectedCard.classList.contains(classNameSelected);

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

    it('should contain a div with a blue-card className', () => {
      expect(isExpectedClassNameInCard).toBe(true);
    });

    it('should contain a div with selected className', () => {
      expect(isSelectedCard).toBe(true);
    });

    it('should show a card with value 4', () => {
      expect(cardValue).toBe(normalCardOptionsFixture.card.number.toString());
    });

    it('should call a onDoubleClick()', () => {
      expect(onDoubleClickMock).toHaveBeenCalledTimes(1);
      expect(onDoubleClickMock).toHaveBeenCalledWith(expect.any(Object));
    });
  });
});
