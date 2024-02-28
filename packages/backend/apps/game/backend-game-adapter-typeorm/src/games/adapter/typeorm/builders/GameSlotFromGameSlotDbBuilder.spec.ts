import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder } from '@cornie-js/backend-common';
import { Card } from '@cornie-js/backend-game-domain/cards';
import { CardFixtures } from '@cornie-js/backend-game-domain/cards/fixtures';
import {
  ActiveGameSlot,
  NonStartedGameSlot,
} from '@cornie-js/backend-game-domain/games';

import { GameSlotDbFixtures } from '../fixtures/GameSlotDbFixtures';
import { GameSlotDb } from '../models/GameSlotDb';
import { GameSlotFromGameSlotDbBuilder } from './GameSlotFromGameSlotDbBuilder';

describe(GameSlotFromGameSlotDbBuilder.name, () => {
  let cardArrayFromCardDbStringifiedArrayBuilderMock: jest.Mocked<
    Builder<Card[], [string]>
  >;

  let gameSlotFromGameSlotDbBuilder: GameSlotFromGameSlotDbBuilder;

  beforeAll(() => {
    cardArrayFromCardDbStringifiedArrayBuilderMock = {
      build: jest.fn(),
    };

    gameSlotFromGameSlotDbBuilder = new GameSlotFromGameSlotDbBuilder(
      cardArrayFromCardDbStringifiedArrayBuilderMock,
    );
  });

  describe('.build', () => {
    describe('having a NonActiveGameSlotDb', () => {
      let nonActiveGameSlotDbFixture: GameSlotDb;

      beforeAll(() => {
        nonActiveGameSlotDbFixture = GameSlotDbFixtures.nonStarted;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameSlotFromGameSlotDbBuilder.build(
            nonActiveGameSlotDbFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a GameSlot', () => {
          const expected: NonStartedGameSlot = {
            position: nonActiveGameSlotDbFixture.position,
            userId: nonActiveGameSlotDbFixture.userId,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having an activeGameSlotDb', () => {
      let activeGameSlotDbFixture: GameSlotDb;

      beforeAll(() => {
        activeGameSlotDbFixture = GameSlotDbFixtures.activeWithOneCard;
      });

      describe('when called', () => {
        let cardsFixture: Card[];

        let result: unknown;

        beforeAll(() => {
          cardsFixture = [CardFixtures.any];

          cardArrayFromCardDbStringifiedArrayBuilderMock.build.mockReturnValueOnce(
            cardsFixture,
          );

          result = gameSlotFromGameSlotDbBuilder.build(activeGameSlotDbFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call cardArrayFromCardDbStringifiedArrayBuilder.build()', () => {
          expect(
            cardArrayFromCardDbStringifiedArrayBuilderMock.build,
          ).toHaveBeenCalledTimes(1);
          expect(
            cardArrayFromCardDbStringifiedArrayBuilderMock.build,
          ).toHaveBeenCalledWith(activeGameSlotDbFixture.cards);
        });

        it('should return a GameSlot', () => {
          const expected: ActiveGameSlot = {
            cards: cardsFixture,
            position: activeGameSlotDbFixture.position,
            userId: activeGameSlotDbFixture.userId,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
