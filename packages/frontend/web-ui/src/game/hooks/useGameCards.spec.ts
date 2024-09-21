import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { renderHook, RenderHookResult } from '@testing-library/react';
import { act } from 'react';

import { useGameCards, UseGameCardsResult } from './useGameCards';

describe(useGameCards.name, () => {
  describe('when called', () => {
    let cardsFixture: apiModels.CardArrayV1;

    let renderResult: RenderHookResult<UseGameCardsResult, unknown>;

    beforeAll(() => {
      cardsFixture = [
        {
          kind: 'wildDraw4',
        },
      ];

      renderResult = renderHook(() => useGameCards(cardsFixture));
    });

    it('should return expected result', () => {
      const expected: UseGameCardsResult = {
        cards: cardsFixture,
        hasNext: false,
        hasPrevious: false,
        setNext: expect.any(Function) as unknown as () => void,
        setPrevious: expect.any(Function) as unknown as () => void,
      };

      expect(renderResult.result.current).toStrictEqual(expected);
    });
  });

  describe('having more than ten cards', () => {
    let cardsFixture: apiModels.CardArrayV1;

    beforeAll(() => {
      cardsFixture = new Array<apiModels.CardV1>(11).fill({
        kind: 'wildDraw4',
      });
    });

    describe('when called', () => {
      let renderResult: RenderHookResult<UseGameCardsResult, unknown>;

      beforeAll(() => {
        renderResult = renderHook(() => useGameCards(cardsFixture));
      });

      it('should return expected result', () => {
        const expected: UseGameCardsResult = {
          cards: new Array<apiModels.CardV1>(10).fill({
            kind: 'wildDraw4',
          }),
          hasNext: true,
          hasPrevious: false,
          setNext: expect.any(Function) as unknown as () => void,
          setPrevious: expect.any(Function) as unknown as () => void,
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
              kind: 'wildDraw4',
            },
          ],
          hasNext: false,
          hasPrevious: true,
          setNext: expect.any(Function) as unknown as () => void,
          setPrevious: expect.any(Function) as unknown as () => void,
        };

        expect(renderResult.result.current).toStrictEqual(expected);
      });
    });
  });
});
