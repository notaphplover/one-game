import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { render, RenderResult } from '@testing-library/react';

import { BaseCard } from './BaseCard';

describe(BaseCard.name, () => {
  let childrenMock: jest.Mock<() => React.JSX.Element | React.JSX.Element[]>;
  let colorClassFixture: string;
  let onDoubleClickMock: jest.Mock<() => void> | undefined;

  beforeAll(() => {
    childrenMock = jest.fn();
    colorClassFixture = 'blue-card';
    onDoubleClickMock = jest.fn();
  });

  describe('when called', () => {
    let isExpectedClassNameInCard: boolean;

    beforeAll(() => {
      const renderResult: RenderResult = render(
        <BaseCard
          children={childrenMock()}
          colorClass={colorClassFixture}
          onDoubleClick={() => onDoubleClickMock}
        ></BaseCard>,
      );

      const cardColor: HTMLElement = renderResult.container.querySelector(
        '.cornie-card-inner-content',
      ) as HTMLElement;

      isExpectedClassNameInCard =
        cardColor.classList.contains(colorClassFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should contain a div with a blue-card className', () => {
      expect(isExpectedClassNameInCard).toBe(true);
    });
  });
});
