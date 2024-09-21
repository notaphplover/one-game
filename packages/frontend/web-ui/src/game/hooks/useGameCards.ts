import { models as apiModels } from '@cornie-js/api-models';
import { useState } from 'react';

export interface UseGameCardsResult {
  cards: apiModels.CardArrayV1;
  hasNext: boolean;
  hasPrevious: boolean;
  setNext: () => void;
  setPrevious: () => void;
}

const PAGE_SIZE: number = 10;

export const useGameCards = (
  cards: apiModels.CardArrayV1,
): UseGameCardsResult => {
  const [page, setPage]: [
    number,
    React.Dispatch<React.SetStateAction<number>>,
  ] = useState(0);

  const cardsSlice: apiModels.CardV1[] = cards.slice(
    PAGE_SIZE * page,
    PAGE_SIZE * (page + 1),
  );

  const hasNext: boolean = cards.length > PAGE_SIZE * (page + 1);
  const hasPrevious: boolean = page > 0;

  function setNext(): void {
    if (hasNext) {
      setPage(page + 1);
    }
  }

  function setPrevious(): void {
    if (hasPrevious) {
      setPage(page - 1);
    }
  }

  return {
    cards: cardsSlice,
    hasNext,
    hasPrevious,
    setNext,
    setPrevious,
  };
};
