import { Spec } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

import { BaseCard } from '../valueObjects/BaseCard';
import { Card } from '../valueObjects/Card';
import { CardColor } from '../valueObjects/CardColor';
import { CardKind } from '../valueObjects/CardKind';
import { ColoredCard } from '../valueObjects/ColoredCard';
import { NormalCard } from '../valueObjects/NormalCard';

@Injectable()
export class AreCardsEqualsSpec implements Spec<Card[]> {
  public isSatisfiedBy(...cards: Card[]): boolean {
    const lastCard: Card | undefined = cards.pop();

    if (lastCard === undefined) {
      return true;
    }

    const otherCards: Card[] = cards;

    switch (lastCard.kind) {
      case CardKind.wild:
      case CardKind.wildDraw4:
        return this.#areCardsOfKind(lastCard.kind, otherCards);
      case CardKind.draw:
      case CardKind.reverse:
      case CardKind.skip:
        return (
          this.#areCardsOfKind(lastCard.kind, otherCards) &&
          this.#areSameColoredCards(lastCard.color, otherCards)
        );
      case CardKind.normal:
        return (
          this.#areCardsOfKind(lastCard.kind, otherCards) &&
          this.#areSameNormalCards(lastCard.color, lastCard.number, otherCards)
        );
    }
  }

  #areCardsOfKind<TKind extends CardKind>(
    cardKind: TKind,
    cards: Card[],
  ): cards is (Card & BaseCard<TKind>)[] {
    return cards.every((card: Card): boolean => card.kind === cardKind);
  }

  #areSameColoredCards(
    color: CardColor,
    cards: (Card & ColoredCard)[],
  ): boolean {
    return cards.every(
      (card: Card & ColoredCard): boolean => card.color === color,
    );
  }

  #areSameNormalCards(
    color: CardColor,
    number: number,
    cards: NormalCard[],
  ): boolean {
    return (
      this.#areSameColoredCards(color, cards) &&
      cards.every((card: NormalCard): boolean => card.number === number)
    );
  }
}
