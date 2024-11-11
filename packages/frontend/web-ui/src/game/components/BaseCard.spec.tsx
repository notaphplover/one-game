import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import { MouseEvent } from 'react';

import { BaseCard } from './BaseCard';

describe(BaseCard.name, () => {
  let childrenMock: jest.Mock<() => React.JSX.Element | React.JSX.Element[]>;
  let classNameSelected: string;
  let colorClassFixture: string;
  let isSelectedFixture: boolean;
  let onDoubleClickMock: jest.Mock<(event: MouseEvent) => void>;

  beforeAll(() => {
    childrenMock = jest.fn();
    classNameSelected = 'selected';
    colorClassFixture = 'blue-card';
    isSelectedFixture = true;
    onDoubleClickMock = jest.fn();
  });

  describe('when called', () => {
    let isExpectedClassNameInCard: boolean;
    let isSelectedCard: boolean;

    beforeAll(() => {
      const renderResult: RenderResult = render(
        <BaseCard
          children={childrenMock()}
          colorClass={colorClassFixture}
          isSelected={isSelectedFixture}
          onDoubleClick={onDoubleClickMock}
        ></BaseCard>,
      );

      const cardColor: HTMLElement = renderResult.container.querySelector(
        '.cornie-card-inner-content',
      ) as HTMLElement;

      isExpectedClassNameInCard =
        cardColor.classList.contains(colorClassFixture);

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

    it('should contain a div with a blue-card className', () => {
      expect(isExpectedClassNameInCard).toBe(true);
    });

    it('should contain a div with selected className', () => {
      expect(isSelectedCard).toBe(true);
    });

    it('should call a onDoubleClick()', () => {
      expect(onDoubleClickMock).toHaveBeenCalledTimes(1);
      expect(onDoubleClickMock).toHaveBeenCalledWith(expect.any(Object));
    });
  });
});
