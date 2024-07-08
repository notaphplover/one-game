import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { RenderResult, render } from '@testing-library/react';

import { BaseCard } from './BaseCard';

describe(BaseCard.name, () => {
  let childrenMock: jest.Mock<() => React.JSX.Element | React.JSX.Element[]>;
  let colorClassFixture: string;

  beforeAll(() => {
    childrenMock = jest.fn();
    colorClassFixture = 'blue-card';
  });

  describe('when called', () => {
    let existingCardColorClassName: boolean;

    beforeAll(() => {
      const renderResult: RenderResult = render(
        <BaseCard
          children={childrenMock()}
          colorClass={colorClassFixture}
        ></BaseCard>,
      );

      const cardColor: HTMLElement = renderResult.container.querySelector(
        '.cornie-base-card-inner-content',
      ) as HTMLElement;

      existingCardColorClassName =
        cardColor.classList.contains(colorClassFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should contain a div with a blue-card className', () => {
      expect(existingCardColorClassName).toBe(true);
    });
  });
});
