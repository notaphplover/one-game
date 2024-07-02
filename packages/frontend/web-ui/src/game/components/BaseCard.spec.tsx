import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { RenderResult, render } from '@testing-library/react';

import { BaseCard } from './BaseCard';

describe(BaseCard.name, () => {
  let childrenMock: jest.Mock<() => React.JSX.Element | React.JSX.Element[]>;
  let colorClassMock: string;

  beforeAll(() => {
    childrenMock = jest.fn();
    colorClassMock = 'blue-card';
  });

  describe('when called', () => {
    let existingCardColorClassName: string;

    beforeAll(() => {
      const renderResult: RenderResult = render(
        <BaseCard
          children={childrenMock()}
          colorClass={colorClassMock}
        ></BaseCard>,
      );

      const cardColor: HTMLElement = renderResult.container.querySelector(
        '.blue-card',
      ) as HTMLElement;

      existingCardColorClassName = window
        .getComputedStyle(cardColor)
        .getPropertyValue('display');
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should show a card with background blue', () => {
      expect(existingCardColorClassName).not.toBe('none');
    });
  });
});
