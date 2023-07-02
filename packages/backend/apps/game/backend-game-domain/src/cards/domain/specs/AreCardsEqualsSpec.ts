import { Spec } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

import { BaseCard } from '../models/BaseCard';
import { Card } from '../models/Card';
import { CardColor } from '../models/CardColor';
import { CardKind } from '../models/CardKind';
import { ColoredCard } from '../models/ColoredCard';
import { NormalCard } from '../models/NormalCard';

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

  #areSameColoredCards<TCard extends Card & ColoredCard>(
    color: CardColor,
    cards: TCard[],
  ): boolean {
    return cards.every((card: TCard): boolean => card.color === color);
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
