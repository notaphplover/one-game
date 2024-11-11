jest.mock('./NormalCard', () => ({ NormalCard: jest.fn() }), {
  virtual: true,
});
jest.mock('./DrawCard', () => ({ DrawCard: jest.fn() }), {
  virtual: true,
});
jest.mock('./ReverseCard', () => ({ ReverseCard: jest.fn() }), {
  virtual: true,
});
jest.mock('./SkipCard', () => ({ SkipCard: jest.fn() }), {
  virtual: true,
});
jest.mock('./WildCard', () => ({ WildCard: jest.fn() }), {
  virtual: true,
});
jest.mock('./WildDraw4Card', () => ({ WildDraw4Card: jest.fn() }), {
  virtual: true,
});

import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { render, RenderResult } from '@testing-library/react';

import { Card, CardOptions } from './Card';
import { DrawCard } from './DrawCard';
import { NormalCard } from './NormalCard';
import { ReverseCard } from './ReverseCard';
import { SkipCard } from './SkipCard';
import { WildCard } from './WildCard';
import { WildDraw4Card } from './WildDraw4Card';

describe(Card.name, () => {
  describe('having a card with normal kind', () => {
    let cardOptionsFixture: CardOptions;

    beforeAll(() => {
      cardOptionsFixture = {
        card: {
          color: 'blue',
          kind: 'normal',
          number: 5,
        },
        isSelected: true,
        onDoubleClick: () => undefined,
      };
    });

    describe('when called', () => {
      let normalCardFixture: React.JSX.Element;
      let chosenCard: HTMLElement;

      beforeAll(() => {
        normalCardFixture = <div className="normal-card-fixture"></div>;

        (NormalCard as jest.Mock<typeof NormalCard>).mockReturnValueOnce(
          normalCardFixture,
        );

        const renderResult: RenderResult = render(
          <Card {...cardOptionsFixture} />,
        );

        chosenCard = renderResult.container.querySelector(
          '.normal-card-fixture',
        ) as HTMLElement;
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call normal card', () => {
        expect(NormalCard).toHaveBeenCalledTimes(1);
        expect(NormalCard).toHaveBeenCalledWith(cardOptionsFixture, {});
      });

      it('should contain a div with normal card', () => {
        expect(chosenCard).toBeDefined();
      });
    });
  });

  describe('having a card with draw kind', () => {
    let cardOptionsFixture: CardOptions;

    beforeAll(() => {
      cardOptionsFixture = {
        card: {
          color: 'blue',
          kind: 'draw',
        },
        isSelected: true,
        onDoubleClick: () => undefined,
      };
    });

    describe('when called', () => {
      let drawCardFixture: React.JSX.Element;
      let chosenCard: HTMLElement;

      beforeAll(() => {
        drawCardFixture = <div className="draw-card-fixture"></div>;

        (DrawCard as jest.Mock<typeof DrawCard>).mockReturnValueOnce(
          drawCardFixture,
        );

        const renderResult: RenderResult = render(
          <Card {...cardOptionsFixture} />,
        );

        chosenCard = renderResult.container.querySelector(
          '.draw-card-fixture',
        ) as HTMLElement;
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call draw card', () => {
        expect(DrawCard).toHaveBeenCalledTimes(1);
        expect(DrawCard).toHaveBeenCalledWith(cardOptionsFixture, {});
      });

      it('should contain a div with draw card', () => {
        expect(chosenCard).toBeDefined();
      });
    });
  });

  describe('having a card with reverse kind', () => {
    let cardOptionsFixture: CardOptions;

    beforeAll(() => {
      cardOptionsFixture = {
        card: {
          color: 'blue',
          kind: 'reverse',
        },
        isSelected: true,
        onDoubleClick: () => undefined,
      };
    });

    describe('when called', () => {
      let reverseCardFixture: React.JSX.Element;
      let chosenCard: HTMLElement;

      beforeAll(() => {
        reverseCardFixture = <div className="reverse-card-fixture"></div>;

        (ReverseCard as jest.Mock<typeof ReverseCard>).mockReturnValueOnce(
          reverseCardFixture,
        );

        const renderResult: RenderResult = render(
          <Card {...cardOptionsFixture} />,
        );

        chosenCard = renderResult.container.querySelector(
          '.reverse-card-fixture',
        ) as HTMLElement;
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call reverse card', () => {
        expect(ReverseCard).toHaveBeenCalledTimes(1);
        expect(ReverseCard).toHaveBeenCalledWith(cardOptionsFixture, {});
      });

      it('should contain a div with reverse card', () => {
        expect(chosenCard).toBeDefined();
      });
    });
  });

  describe('having a card with skip kind', () => {
    let cardOptionsFixture: CardOptions;

    beforeAll(() => {
      cardOptionsFixture = {
        card: {
          color: 'blue',
          kind: 'skip',
        },
        isSelected: true,
        onDoubleClick: () => undefined,
      };
    });

    describe('when called', () => {
      let skipCardFixture: React.JSX.Element;
      let chosenCard: HTMLElement;

      beforeAll(() => {
        skipCardFixture = <div className="skip-card-fixture"></div>;

        (SkipCard as jest.Mock<typeof SkipCard>).mockReturnValueOnce(
          skipCardFixture,
        );

        const renderResult: RenderResult = render(
          <Card {...cardOptionsFixture} />,
        );

        chosenCard = renderResult.container.querySelector(
          '.skip-card-fixture',
        ) as HTMLElement;
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call skip card', () => {
        expect(SkipCard).toHaveBeenCalledTimes(1);
        expect(SkipCard).toHaveBeenCalledWith(cardOptionsFixture, {});
      });

      it('should contain a div with skip card', () => {
        expect(chosenCard).toBeDefined();
      });
    });
  });

  describe('having a card with wild kind', () => {
    let cardOptionsFixture: CardOptions;

    beforeAll(() => {
      cardOptionsFixture = {
        card: {
          kind: 'wild',
        },
        isSelected: true,
        onDoubleClick: () => undefined,
      };
    });

    describe('when called', () => {
      let wildCardFixture: React.JSX.Element;
      let chosenCard: HTMLElement;

      beforeAll(() => {
        wildCardFixture = <div className="wild-card-fixture"></div>;

        (WildCard as jest.Mock<typeof WildCard>).mockReturnValueOnce(
          wildCardFixture,
        );

        const renderResult: RenderResult = render(
          <Card {...cardOptionsFixture} />,
        );

        chosenCard = renderResult.container.querySelector(
          '.wild-card-fixture',
        ) as HTMLElement;
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call wild card', () => {
        expect(WildCard).toHaveBeenCalledTimes(1);
        expect(WildCard).toHaveBeenCalledWith(
          {
            card: cardOptionsFixture.card,
            colorClass: 'white-color',
            isSelected: true,
            onDoubleClick: cardOptionsFixture.onDoubleClick,
          },
          {},
        );
      });

      it('should contain a div with wild card', () => {
        expect(chosenCard).toBeDefined();
      });
    });
  });

  describe('having a card with wildDraw4 kind', () => {
    let cardOptionsFixture: CardOptions;

    beforeAll(() => {
      cardOptionsFixture = {
        card: {
          kind: 'wildDraw4',
        },
        isSelected: true,
        onDoubleClick: () => undefined,
      };
    });

    describe('when called', () => {
      let wildDraw4CardFixture: React.JSX.Element;
      let chosenCard: HTMLElement;

      beforeAll(() => {
        wildDraw4CardFixture = <div className="wildDraw4-card-fixture"></div>;

        (WildDraw4Card as jest.Mock<typeof WildDraw4Card>).mockReturnValueOnce(
          wildDraw4CardFixture,
        );

        const renderResult: RenderResult = render(
          <Card {...cardOptionsFixture} />,
        );

        chosenCard = renderResult.container.querySelector(
          '.wildDraw4-card-fixture',
        ) as HTMLElement;
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call wildDraw4 card', () => {
        expect(WildDraw4Card).toHaveBeenCalledTimes(1);
        expect(WildDraw4Card).toHaveBeenCalledWith(
          {
            card: cardOptionsFixture.card,
            colorClass: 'white-color',
            isSelected: true,
            onDoubleClick: cardOptionsFixture.onDoubleClick,
          },
          {},
        );
      });

      it('should contain a div with wildDraw4 card', () => {
        expect(chosenCard).toBeDefined();
      });
    });
  });
});
