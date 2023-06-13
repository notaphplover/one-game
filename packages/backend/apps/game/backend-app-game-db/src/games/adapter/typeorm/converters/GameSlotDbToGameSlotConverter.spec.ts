import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Card } from '@cornie-js/backend-app-game-domain/cards/domain';
import {
  ActiveGameSlot,
  NonStartedGameSlot,
} from '@cornie-js/backend-app-game-domain/games/domain';
import { CardFixtures } from '@cornie-js/backend-app-game-fixtures/cards/domain';
import { Builder } from '@cornie-js/backend-common';

import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { GameSlotDbFixtures } from '../fixtures/GameSlotDbFixtures';
import { GameSlotDb } from '../models/GameSlotDb';
import { GameSlotDbToGameSlotConverter } from './GameSlotDbToGameSlotConverter';

describe(GameSlotDbToGameSlotConverter.name, () => {
  let cardBuilderMock: jest.Mocked<Builder<Card, [CardDb]>>;

  let gameSlotDbToGameSlotConverter: GameSlotDbToGameSlotConverter;

  beforeAll(() => {
    cardBuilderMock = {
      build: jest.fn(),
    };

    gameSlotDbToGameSlotConverter = new GameSlotDbToGameSlotConverter(
      cardBuilderMock,
    );
  });

  describe('.convert', () => {
    describe('having a NonActiveGameSlotDb', () => {
      let nonActiveGameSlotDbFixture: GameSlotDb;

      beforeAll(() => {
        nonActiveGameSlotDbFixture = GameSlotDbFixtures.nonActive;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameSlotDbToGameSlotConverter.convert(
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

          result = gameSlotDbToGameSlotConverter.convert(
            activeGameSlotDbFixture,
          );
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
