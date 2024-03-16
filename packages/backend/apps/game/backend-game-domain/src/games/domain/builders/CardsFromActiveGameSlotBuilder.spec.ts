import { beforeAll, describe, expect, it } from '@jest/globals';

import { AppError, AppErrorKind } from '@cornie-js/backend-common';

import { ActiveGameSlotFixtures } from '../fixtures/ActiveGameSlotFixtures';
import { ActiveGameSlot } from '../valueObjects/ActiveGameSlot';
import { CardsFromActiveGameSlotBuilder } from './CardsFromActiveGameSlotBuilder';

describe(CardsFromActiveGameSlotBuilder.name, () => {
  let cardsFromActiveGameSlotBuilder: CardsFromActiveGameSlotBuilder;

  beforeAll(() => {
    cardsFromActiveGameSlotBuilder = new CardsFromActiveGameSlotBuilder();
  });

  describe('.build', () => {
    describe('having an ActiveGameSlot and non existing indexes', () => {
      let activeGameSlot: ActiveGameSlot;
      let cardIndexes: number[];

      beforeAll(() => {
        activeGameSlot = ActiveGameSlotFixtures.withCardsOne;
        cardIndexes = [-1];
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          try {
            cardsFromActiveGameSlotBuilder.build(activeGameSlot, cardIndexes);
          } catch (error: unknown) {
            result = error;
          }
        });

        it('should throw an AppError', () => {
          const expectedErrorProperties: Partial<AppError> = {
            kind: AppErrorKind.unknown,
            message:
              'An unexpected error happened while attempting to update game',
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedErrorProperties),
          );
        });
      });
    });

    describe('having an ActiveGameSlot and existing indexes', () => {
      let activeGameSlot: ActiveGameSlot;
      let cardIndexes: number[];

      beforeAll(() => {
        activeGameSlot = ActiveGameSlotFixtures.withCardsOne;
        cardIndexes = [0];
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = cardsFromActiveGameSlotBuilder.build(
            activeGameSlot,
            cardIndexes,
          );
        });

        it('should return Card[]', () => {
          expect(result).toStrictEqual([activeGameSlot.cards[0]]);
        });
      });
    });
  });
});
