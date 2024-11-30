import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { renderHook, RenderHookResult } from '@testing-library/react';
import { act } from 'react';

import { GameCard, useGameCards, UseGameCardsResult } from './useGameCards';

describe(useGameCards.name, () => {
  describe('when called', () => {
    let cardsFixture: apiModels.CardArrayV1;
    let gameCardFixture: GameCard[];
    let renderResult: RenderHookResult<UseGameCardsResult, unknown>;

    beforeAll(() => {
      cardsFixture = [
        {
          kind: 'wildDraw4',
        },
      ];

      gameCardFixture = [
        {
          card: { kind: 'wildDraw4' },
          index: 0,
          isSelected: false,
        },
      ];
      renderResult = renderHook(() => useGameCards(cardsFixture));
    });

    it('should return expected result', () => {
      const expected: UseGameCardsResult = {
        cards: gameCardFixture,
        deleteAllSelectedCard: expect.any(Function) as unknown as () => void,
        hasNext: false,
        hasPrevious: false,
        selectedCards: [],
        setNext: expect.any(Function) as unknown as () => void,
        setPrevious: expect.any(Function) as unknown as () => void,
        switchCardSelection: expect.any(Function) as unknown as (
          index: number,
        ) => void,
      };

      expect(renderResult.result.current).toStrictEqual(expected);
    });
  });

  describe('having more than ten cards', () => {
    let cardsFixture: apiModels.CardArrayV1;
    let gameCardFixture: GameCard[];

    beforeAll(() => {
      cardsFixture = new Array<apiModels.CardV1>(11).fill({
        kind: 'wildDraw4',
      });

      gameCardFixture = [
        { card: { kind: 'wildDraw4' }, index: 0, isSelected: false },
        { card: { kind: 'wildDraw4' }, index: 1, isSelected: false },
        { card: { kind: 'wildDraw4' }, index: 2, isSelected: false },
        { card: { kind: 'wildDraw4' }, index: 3, isSelected: false },
        { card: { kind: 'wildDraw4' }, index: 4, isSelected: false },
        { card: { kind: 'wildDraw4' }, index: 5, isSelected: false },
        { card: { kind: 'wildDraw4' }, index: 6, isSelected: false },
        { card: { kind: 'wildDraw4' }, index: 7, isSelected: false },
        { card: { kind: 'wildDraw4' }, index: 8, isSelected: false },
        { card: { kind: 'wildDraw4' }, index: 9, isSelected: false },
      ];
    });

    describe('when called', () => {
      let renderResult: RenderHookResult<UseGameCardsResult, unknown>;

      beforeAll(() => {
        renderResult = renderHook(() => useGameCards(cardsFixture));
      });

      it('should return expected result', () => {
        const expected: UseGameCardsResult = {
          cards: gameCardFixture,
          deleteAllSelectedCard: expect.any(Function) as unknown as () => void,
          hasNext: true,
          hasPrevious: false,
          selectedCards: [],
          setNext: expect.any(Function) as unknown as () => void,
          setPrevious: expect.any(Function) as unknown as () => void,
          switchCardSelection: expect.any(Function) as unknown as (
            index: number,
          ) => void,
        };

        expect(renderResult.result.current).toStrictEqual(expected);
      });
    });

    describe('when called, and setNext() is called', () => {
      let renderResult: RenderHookResult<UseGameCardsResult, unknown>;

      beforeAll(() => {
        renderResult = renderHook(() => useGameCards(cardsFixture));

        act(() => {
          renderResult.result.current.setNext();
        });
      });

      it('should return expected result', () => {
        const expected: UseGameCardsResult = {
          cards: [
            {
              card: { kind: 'wildDraw4' },
              index: 10,
              isSelected: false,
            },
          ],
          deleteAllSelectedCard: expect.any(Function) as unknown as () => void,
          hasNext: false,
          hasPrevious: true,
          selectedCards: [],
          setNext: expect.any(Function) as unknown as () => void,
          setPrevious: expect.any(Function) as unknown as () => void,
          switchCardSelection: expect.any(Function) as unknown as (
            index: number,
          ) => void,
        };

        expect(renderResult.result.current).toStrictEqual(expected);
      });
    });

    describe('when called, and switchCardSelection() is called and a deselected card is selected', () => {
      let renderResult: RenderHookResult<UseGameCardsResult, unknown>;

      beforeAll(() => {
        renderResult = renderHook(() => useGameCards(cardsFixture));

        act(() => {
          renderResult.result.current.switchCardSelection(9);
        });

        gameCardFixture = [
          { card: { kind: 'wildDraw4' }, index: 0, isSelected: false },
          { card: { kind: 'wildDraw4' }, index: 1, isSelected: false },
          { card: { kind: 'wildDraw4' }, index: 2, isSelected: false },
          { card: { kind: 'wildDraw4' }, index: 3, isSelected: false },
          { card: { kind: 'wildDraw4' }, index: 4, isSelected: false },
          { card: { kind: 'wildDraw4' }, index: 5, isSelected: false },
          { card: { kind: 'wildDraw4' }, index: 6, isSelected: false },
          { card: { kind: 'wildDraw4' }, index: 7, isSelected: false },
          { card: { kind: 'wildDraw4' }, index: 8, isSelected: false },
          { card: { kind: 'wildDraw4' }, index: 9, isSelected: true },
        ];
      });

      it('should return expected result', () => {
        const expected: UseGameCardsResult = {
          cards: gameCardFixture,
          deleteAllSelectedCard: expect.any(Function) as unknown as () => void,
          hasNext: true,
          hasPrevious: false,
          selectedCards: [9],
          setNext: expect.any(Function) as unknown as () => void,
          setPrevious: expect.any(Function) as unknown as () => void,
          switchCardSelection: expect.any(Function) as unknown as (
            index: number,
          ) => void,
        };

        expect(renderResult.result.current).toStrictEqual(expected);
      });
    });

    describe('when called, and switchCardSelection() is called and a selected card is deselected', () => {
      let renderResult: RenderHookResult<UseGameCardsResult, unknown>;
      let renderResultInTheMiddle: UseGameCardsResult;
      let gameCardResultInTheMiddle: GameCard[];

      beforeAll(() => {
        renderResult = renderHook(() => useGameCards(cardsFixture));

        act(() => {
          renderResult.result.current.switchCardSelection(9);
        });

        renderResultInTheMiddle = renderResult.result.current;
        gameCardResultInTheMiddle = renderResult.result.current.cards;

        act(() => {
          renderResult.result.current.switchCardSelection(9);
        });

        gameCardFixture = [
          { card: { kind: 'wildDraw4' }, index: 0, isSelected: false },
          { card: { kind: 'wildDraw4' }, index: 1, isSelected: false },
          { card: { kind: 'wildDraw4' }, index: 2, isSelected: false },
          { card: { kind: 'wildDraw4' }, index: 3, isSelected: false },
          { card: { kind: 'wildDraw4' }, index: 4, isSelected: false },
          { card: { kind: 'wildDraw4' }, index: 5, isSelected: false },
          { card: { kind: 'wildDraw4' }, index: 6, isSelected: false },
          { card: { kind: 'wildDraw4' }, index: 7, isSelected: false },
          { card: { kind: 'wildDraw4' }, index: 8, isSelected: false },
          { card: { kind: 'wildDraw4' }, index: 9, isSelected: false },
        ];
      });

      it('should return deselected cards but one of them selected', () => {
        const expected: UseGameCardsResult = {
          cards: gameCardResultInTheMiddle,
          deleteAllSelectedCard: expect.any(Function) as unknown as () => void,
          hasNext: true,
          hasPrevious: false,
          selectedCards: [9],
          setNext: expect.any(Function) as unknown as () => void,
          setPrevious: expect.any(Function) as unknown as () => void,
          switchCardSelection: expect.any(Function) as unknown as (
            index: number,
          ) => void,
        };

        expect(renderResultInTheMiddle).toStrictEqual(expected);
      });

      it('should return all deselected cards', () => {
        const expected: UseGameCardsResult = {
          cards: gameCardFixture,
          deleteAllSelectedCard: expect.any(Function) as unknown as () => void,
          hasNext: true,
          hasPrevious: false,
          selectedCards: [],
          setNext: expect.any(Function) as unknown as () => void,
          setPrevious: expect.any(Function) as unknown as () => void,
          switchCardSelection: expect.any(Function) as unknown as (
            index: number,
          ) => void,
        };

        expect(renderResult.result.current).toStrictEqual(expected);
      });
    });
  });
});
