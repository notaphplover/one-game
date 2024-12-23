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
  describe('having a BaseCardOptions with isSelected true', () => {
    let childrenMock: jest.Mock<() => React.JSX.Element | React.JSX.Element[]>;
    let selectedClassName: string;
    let colorClassFixture: string;
    let isSelectedFixture: boolean;
    let onClickMock: jest.Mock<(event: MouseEvent) => void>;

    beforeAll(() => {
      childrenMock = jest.fn();
      selectedClassName = 'selected';
      colorClassFixture = 'blue-card';
      isSelectedFixture = true;
      onClickMock = jest.fn();
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
            onClick={onClickMock}
          ></BaseCard>,
        );

        const cardColor: HTMLElement = renderResult.container.querySelector(
          '.cornie-card-inner-content',
        ) as HTMLElement;

        isExpectedClassNameInCard =
          cardColor.classList.contains(colorClassFixture);

        const divSelectedCard: HTMLElement =
          renderResult.container.querySelector('.cornie-card') as HTMLElement;

        isSelectedCard = divSelectedCard.classList.contains(selectedClassName);

        const selectedCard: Element | null =
          renderResult.container.querySelector(
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

      it('should call a onClick()', () => {
        expect(onClickMock).toHaveBeenCalledTimes(1);
        expect(onClickMock).toHaveBeenCalledWith(expect.any(Object));
      });
    });
  });

  describe('having a BaseCardOptions with isSelected false', () => {
    let childrenMock: jest.Mock<() => React.JSX.Element | React.JSX.Element[]>;
    let selectedClassName: string;
    let colorClassFixture: string;
    let isSelectedFixture: boolean;
    let onClickMock: jest.Mock<(event: MouseEvent) => void>;

    beforeAll(() => {
      childrenMock = jest.fn();
      selectedClassName = 'selected';
      colorClassFixture = 'blue-card';
      isSelectedFixture = false;
      onClickMock = jest.fn();
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
            onClick={onClickMock}
          ></BaseCard>,
        );

        const cardColor: HTMLElement = renderResult.container.querySelector(
          '.cornie-card-inner-content',
        ) as HTMLElement;

        isExpectedClassNameInCard =
          cardColor.classList.contains(colorClassFixture);

        const divSelectedCard: HTMLElement =
          renderResult.container.querySelector('.cornie-card') as HTMLElement;

        isSelectedCard = divSelectedCard.classList.contains(selectedClassName);

        const selectedCard: Element | null =
          renderResult.container.querySelector(
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

      it('should not contain a div with selected className', () => {
        expect(isSelectedCard).toBe(false);
      });

      it('should call a onClick()', () => {
        expect(onClickMock).toHaveBeenCalledTimes(1);
        expect(onClickMock).toHaveBeenCalledWith(expect.any(Object));
      });
    });
  });

  describe('having a BaseCardOptions with isSelected undefined', () => {
    let childrenMock: jest.Mock<() => React.JSX.Element | React.JSX.Element[]>;
    let selectedClassName: string;
    let colorClassFixture: string;
    let isSelectedFixture: undefined;
    let onClickMock: jest.Mock<(event: MouseEvent) => void>;

    beforeAll(() => {
      childrenMock = jest.fn();
      selectedClassName = 'selected';
      colorClassFixture = 'blue-card';
      isSelectedFixture = undefined;
      onClickMock = jest.fn();
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
            onClick={onClickMock}
          ></BaseCard>,
        );

        const cardColor: HTMLElement = renderResult.container.querySelector(
          '.cornie-card-inner-content',
        ) as HTMLElement;

        isExpectedClassNameInCard =
          cardColor.classList.contains(colorClassFixture);

        const divSelectedCard: HTMLElement =
          renderResult.container.querySelector('.cornie-card') as HTMLElement;

        isSelectedCard = divSelectedCard.classList.contains(selectedClassName);

        const selectedCard: Element | null =
          renderResult.container.querySelector(
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

      it('should not contain a div with selected className', () => {
        expect(isSelectedCard).toBe(false);
      });

      it('should call a onClick()', () => {
        expect(onClickMock).toHaveBeenCalledTimes(1);
        expect(onClickMock).toHaveBeenCalledWith(expect.any(Object));
      });
    });
  });
});
