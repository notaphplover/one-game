import { beforeAll, describe, expect, it } from '@jest/globals';

import { CardColor } from '@cornie-js/backend-app-game-domain/cards/domain';

import { CardColorDb } from '../models/CardColorDb';
import { CardColorDbBuilder } from './CardColorDbBuilder';

describe(CardColorDbBuilder.name, () => {
  let cardColorDbBuilder: CardColorDbBuilder;

  beforeAll(() => {
    cardColorDbBuilder = new CardColorDbBuilder();
  });

  describe('.build', () => {
    describe.each<[string, CardColor, CardColorDb]>([
      ['blue', CardColor.blue, 0x0000],
      ['green', CardColor.green, 0x0010],
      ['red', CardColor.red, 0x0020],
      ['yellow', CardColor.yellow, 0x0030],
    ])(
      'having a card (%s)',
      (_: string, cardColor: CardColor, cardColorDb: CardColorDb) => {
        describe('when called', () => {
          let result: unknown;

          beforeAll(() => {
            result = cardColorDbBuilder.build(cardColor);
          });

          it('should return a CardDb', () => {
            expect(result).toBe(cardColorDb);
          });
        });
      },
    );
  });
});
