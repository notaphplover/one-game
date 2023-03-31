import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder, Converter } from '@one-game-js/backend-common';

import { CardColorDb } from '../../../../cards/adapter/typeorm/models/CardColorDb';
import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { CardFixtures } from '../../../../cards/domain/fixtures/CardFixtures';
import { Card } from '../../../../cards/domain/models/Card';
import { CardColor } from '../../../../cards/domain/models/CardColor';
import { NonStartedGameSlotFixtures } from '../../../domain/fixtures/NonStartedGameSlotFixtures';
import { ActiveGameSlot } from '../../../domain/models/ActiveGameSlot';
import { NonStartedGame } from '../../../domain/models/NonStartedGame';
import { NonStartedGameSlot } from '../../../domain/models/NonStartedGameSlot';
import { GameDbFixtures } from '../fixtures/GameDbFixtures';
import { GameCardSpecDb } from '../models/GameCardSpecDb';
import { GameDb } from '../models/GameDb';
import { GameSlotDb } from '../models/GameSlotDb';
import { GameDbToGameConverter } from './GameDbToGameConverter';

describe(GameDbToGameConverter.name, () => {
  let cardBuilderMock: jest.Mocked<Builder<Card, [CardDb]>>;
  let cardColorBuilder: jest.Mocked<Builder<CardColor, [CardColorDb]>>;
  let gameSlotDbToGameSlotConverterMock: jest.Mocked<
    Converter<GameSlotDb, ActiveGameSlot | NonStartedGameSlot>
  >;

  let gameDbToGameConverter: GameDbToGameConverter;

  beforeAll(() => {
    cardBuilderMock = {
      build: jest.fn(),
    };

    cardColorBuilder = {
      build: jest.fn(),
    };

    gameSlotDbToGameSlotConverterMock = {
      convert: jest.fn(),
    };

    gameDbToGameConverter = new GameDbToGameConverter(
      cardBuilderMock,
      cardColorBuilder,
      gameSlotDbToGameSlotConverterMock,
    );
  });

  describe('having a non started GameDb', () => {
    let gameCardSpecDbFixture: GameCardSpecDb;
    let gameDbFixture: GameDb;

    beforeAll(() => {
      gameDbFixture = GameDbFixtures.withActiveFalseAndGameSlotsOne;

      [gameCardSpecDbFixture] = JSON.parse(gameDbFixture.specs) as [
        GameCardSpecDb,
      ];
    });

    describe('when called', () => {
      let cardFixture: Card;
      let gameSlotFixture: NonStartedGameSlot;

      let result: unknown;

      beforeAll(() => {
        cardFixture = CardFixtures.any;
        gameSlotFixture = NonStartedGameSlotFixtures.any;

        cardBuilderMock.build.mockReturnValue(cardFixture);
        gameSlotDbToGameSlotConverterMock.convert.mockReturnValue(
          gameSlotFixture,
        );

        result = gameDbToGameConverter.convert(gameDbFixture);
      });

      afterAll(() => {
        cardBuilderMock.build.mockReset();
        gameSlotDbToGameSlotConverterMock.convert.mockReset();

        jest.clearAllMocks();
      });

      it('should call cardBuilder.build()', () => {
        expect(cardBuilderMock.build).toHaveBeenCalledTimes(1);
      });

      it('should return a NonStartedGame', () => {
        const expected: Partial<NonStartedGame> = {
          active: false,
          id: gameDbFixture.id,
          slots: [gameSlotFixture],
          spec: [
            {
              amount: gameCardSpecDbFixture.amount,
              card: cardFixture,
            },
          ],
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
