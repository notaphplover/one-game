import { models as apiModels } from '@cornie-js/api-models';
import { useState } from 'react';

export interface UseGameCardsResult {
  cards: GameCard[];
  deleteAllSelectedCard: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  selectedCards: GameSelectedCard[];
  setNext: () => void;
  setPrevious: () => void;
  switchCardSelection: (index: number) => void;
}

export interface GameCard {
  card: apiModels.CardV1;
  index: number;
  isSelected: boolean;
}

export interface GameSelectedCard {
  card: apiModels.CardV1;
  index: number;
}

const PAGE_SIZE: number = 10;

export const useGameCards = (
  cards: apiModels.CardArrayV1,
): UseGameCardsResult => {
  const [page, setPage]: [
    number,
    React.Dispatch<React.SetStateAction<number>>,
  ] = useState(0);

  const [selectedCards, setSelectedCards] = useState<GameSelectedCard[]>([]);

  const cardsSlice: apiModels.CardV1[] = cards.slice(
    PAGE_SIZE * page,
    PAGE_SIZE * (page + 1),
  );

  const hasNext: boolean = cards.length > PAGE_SIZE * (page + 1);
  const hasPrevious: boolean = page > 0;

  const gameCardSlice: GameCard[] = buildCardGameSlices();

  function buildCardGameSlices(): GameCard[] {
    const gameSlice: GameCard[] = [];
    cardsSlice.forEach((card: apiModels.CardV1, index: number): void => {
      const cardIndex: number = page * PAGE_SIZE + index;

      gameSlice.push({
        card: card,
        index: cardIndex,
        isSelected: selectedCards.some(
          (gameSelectedCard: GameSelectedCard): boolean =>
            gameSelectedCard.index === cardIndex,
        ),
      });
    });

    return gameSlice;
  }

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

  function isSelectedCard(index: number): boolean {
    return selectedCards.some(
      (gameSelectedCard: GameSelectedCard): boolean =>
        gameSelectedCard.index === index,
    );
  }

  function addSelectedCard(index: number): void {
    const card: apiModels.CardV1 | undefined = cards[index];

    if (card !== undefined) {
      setSelectedCards([...selectedCards, { card, index }]);
    }
  }

  function deleteSelectedCard(index: number): void {
    const filteredSelectedCard = selectedCards.filter(
      (gameSelectedCard: GameSelectedCard): boolean =>
        gameSelectedCard.index !== index,
    );
    setSelectedCards(filteredSelectedCard);
  }

  function switchCardSelection(index: number): void {
    if (isSelectedCard(index)) {
      deleteSelectedCard(index);
    } else {
      addSelectedCard(index);
    }
  }

  function deleteAllSelectedCard(): void {
    setSelectedCards([]);
  }

  return {
    cards: gameCardSlice,
    deleteAllSelectedCard,
    hasNext,
    hasPrevious,
    selectedCards,
    setNext,
    setPrevious,
    switchCardSelection,
  };
};
