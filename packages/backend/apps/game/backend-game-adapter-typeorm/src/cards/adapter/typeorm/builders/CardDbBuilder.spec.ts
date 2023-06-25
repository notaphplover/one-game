import { beforeAll, describe, expect, it } from '@jest/globals';

import {
  Card,
  CardColor,
  CardKind,
} from '@cornie-js/backend-game-domain/cards';

import { CardDb } from '../models/CardDb';
import { CardDbBuilder } from './CardDbBuilder';

describe(CardDbBuilder.name, () => {
  let cardDbBuilder: CardDbBuilder;

  beforeAll(() => {
    cardDbBuilder = new CardDbBuilder();
  });

  describe('.build', () => {
    describe.each<[string, Card, CardDb]>([
      [
        'red 7',
        {
          color: CardColor.red,
          kind: CardKind.normal,
          number: 7,
        },
        0x0027,
      ],
      [
        'blue skip',
        {
          color: CardColor.blue,
          kind: CardKind.skip,
        },
        0x0042,
      ],
      [
        'green draw',
        {
          color: CardColor.green,
          kind: CardKind.draw,
        },
        0x0050,
      ],
      [
        'yellow reverse',
        {
          color: CardColor.yellow,
          kind: CardKind.reverse,
        },
        0x0071,
      ],
      [
        'wild',
        {
          kind: CardKind.wild,
        },
        0x0101,
      ],
      [
        'wild draw 4',
        {
          kind: CardKind.wildDraw4,
        },
        0x0102,
      ],
    ])('having a card (%s)', (_: string, card: Card, cardDb: CardDb) => {
      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = cardDbBuilder.build(card);
        });

        it('should return a CardDb', () => {
          expect(result).toBe(cardDb);
        });
      });
    });
  });
});
