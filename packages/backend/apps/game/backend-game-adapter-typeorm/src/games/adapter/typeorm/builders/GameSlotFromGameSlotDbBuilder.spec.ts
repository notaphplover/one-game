import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder } from '@cornie-js/backend-common';
import { Card } from '@cornie-js/backend-game-domain/cards';
import { CardFixtures } from '@cornie-js/backend-game-domain/cards/fixtures';
import {
  ActiveGameSlot,
  NonStartedGameSlot,
} from '@cornie-js/backend-game-domain/games';

import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { GameSlotDbFixtures } from '../fixtures/GameSlotDbFixtures';
import { GameSlotDb } from '../models/GameSlotDb';
import { GameSlotFromGameSlotDbBuilder } from './GameSlotFromGameSlotDbBuilder';

describe(GameSlotFromGameSlotDbBuilder.name, () => {
  let cardBuilderMock: jest.Mocked<Builder<Card, [CardDb]>>;

  let gameSlotFromGameSlotDbBuilder: GameSlotFromGameSlotDbBuilder;

  beforeAll(() => {
    cardBuilderMock = {
      build: jest.fn(),
    };

    gameSlotFromGameSlotDbBuilder = new GameSlotFromGameSlotDbBuilder(
      cardBuilderMock,
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
        let cardFixture: Card;

        let result: unknown;

        beforeAll(() => {
          cardFixture = CardFixtures.any;

          cardBuilderMock.build.mockReturnValueOnce(cardFixture);

          result = gameSlotFromGameSlotDbBuilder.build(activeGameSlotDbFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call cardBuilder.build()', () => {
          expect(cardBuilderMock.build).toHaveBeenCalledTimes(1);
          expect(cardBuilderMock.build).toHaveBeenCalledWith(
            expect.any(Number),
          );
        });

        it('should return a GameSlot', () => {
          const expected: ActiveGameSlot = {
            cards: [cardFixture],
            position: activeGameSlotDbFixture.position,
            userId: activeGameSlotDbFixture.userId,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});