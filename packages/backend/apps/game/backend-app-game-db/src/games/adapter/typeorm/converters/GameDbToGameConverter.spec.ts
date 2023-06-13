import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import {
  Card,
  CardColor,
} from '@cornie-js/backend-app-game-domain/cards/domain';
import {
  ActiveGame,
  ActiveGameSlot,
  GameDirection,
  NonStartedGame,
  NonStartedGameSlot,
} from '@cornie-js/backend-app-game-domain/games/domain';
import { CardFixtures } from '@cornie-js/backend-app-game-fixtures/cards/domain';
import {
  ActiveGameSlotFixtures,
  NonStartedGameSlotFixtures,
} from '@cornie-js/backend-app-game-fixtures/games/domain';
import { Builder, Converter } from '@cornie-js/backend-common';

import { CardColorDb } from '../../../../cards/adapter/typeorm/models/CardColorDb';
import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { GameDbFixtures } from '../fixtures/GameDbFixtures';
import { GameCardSpecDb } from '../models/GameCardSpecDb';
import { GameDb } from '../models/GameDb';
import { GameDirectionDb } from '../models/GameDirectionDb';
import { GameSlotDb } from '../models/GameSlotDb';
import { GameDbToGameConverter } from './GameDbToGameConverter';

describe(GameDbToGameConverter.name, () => {
  let cardBuilderMock: jest.Mocked<Builder<Card, [CardDb]>>;
  let cardColorBuilderMock: jest.Mocked<Builder<CardColor, [CardColorDb]>>;
  let gameDirectionDbToGameDirectionConverterMock: jest.Mocked<
    Converter<GameDirectionDb, GameDirection>
  >;
  let gameSlotDbToGameSlotConverterMock: jest.Mocked<
    Converter<GameSlotDb, ActiveGameSlot | NonStartedGameSlot>
  >;

  let gameDbToGameConverter: GameDbToGameConverter;

  beforeAll(() => {
    cardBuilderMock = {
      build: jest.fn(),
    };

    cardColorBuilderMock = {
      build: jest.fn(),
    };

    gameDirectionDbToGameDirectionConverterMock = {
      convert: jest.fn(),
    };

    gameSlotDbToGameSlotConverterMock = {
      convert: jest.fn(),
    };

    gameDbToGameConverter = new GameDbToGameConverter(
      cardBuilderMock,
      cardColorBuilderMock,
      gameDirectionDbToGameDirectionConverterMock,
      gameSlotDbToGameSlotConverterMock,
    );
  });

  describe('having a non started GameDb', () => {
    let gameCardSpecDbFixture: GameCardSpecDb;
    let gameDbFixture: GameDb;

    beforeAll(() => {
      gameDbFixture = GameDbFixtures.withActiveFalseAndGameSlotsOne;

      [gameCardSpecDbFixture] = JSON.parse(gameDbFixture.spec) as [
        GameCardSpecDb,
      ];
    });

    describe('when called', () => {
      let cardFixture: Card;
      let gameSlotFixture: NonStartedGameSlot;

      let result: unknown;

      beforeAll(() => {
        cardFixture = CardFixtures.any;
        gameSlotFixture = NonStartedGameSlotFixtures.withPositionZero;

        cardBuilderMock.build.mockReturnValueOnce(cardFixture);
        gameSlotDbToGameSlotConverterMock.convert.mockReturnValue(
          gameSlotFixture,
        );

        result = gameDbToGameConverter.convert(gameDbFixture);
      });

      afterAll(() => {
        gameSlotDbToGameSlotConverterMock.convert.mockReset();

        jest.clearAllMocks();
      });

      it('should call cardBuilder.build()', () => {
        expect(cardBuilderMock.build).toHaveBeenCalledTimes(1);
      });

      it('should call gameSlotDbToGameSlotConverterMock.convert()', () => {
        expect(gameSlotDbToGameSlotConverterMock.convert).toHaveBeenCalledTimes(
          gameDbFixture.gameSlotsDb.length,
        );

        for (const [i, gameSlotDb] of gameDbFixture.gameSlotsDb.entries()) {
          expect(
            gameSlotDbToGameSlotConverterMock.convert,
          ).toHaveBeenNthCalledWith(i + 1, gameSlotDb);
        }
      });

      it('should return a NonStartedGame', () => {
        const expected: Partial<NonStartedGame> = {
          gameSlotsAmount: gameDbFixture.gameSlotsAmount,
          id: gameDbFixture.id,
          spec: {
            cards: [
              {
                amount: gameCardSpecDbFixture.amount,
                card: cardFixture,
              },
            ],
          },
          state: {
            active: false,
            slots: [gameSlotFixture],
          },
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a non started GameDb with two slots', () => {
    let gameCardSpecDbFixture: GameCardSpecDb;
    let gameDbFixture: GameDb;

    beforeAll(() => {
      gameDbFixture = GameDbFixtures.withActiveFalseAndGameSlotsTwo;

      [gameCardSpecDbFixture] = JSON.parse(gameDbFixture.spec) as [
        GameCardSpecDb,
      ];
    });

    describe('when called', () => {
      let cardFixture: Card;
      let firstGameSlotFixture: NonStartedGameSlot;
      let secondGameSlotFixture: NonStartedGameSlot;

      let result: unknown;

      beforeAll(() => {
        cardFixture = CardFixtures.any;
        firstGameSlotFixture = NonStartedGameSlotFixtures.withPositionZero;
        secondGameSlotFixture = NonStartedGameSlotFixtures.withPositionZero;

        cardBuilderMock.build.mockReturnValueOnce(cardFixture);
        gameSlotDbToGameSlotConverterMock.convert
          .mockReturnValueOnce(secondGameSlotFixture)
          .mockReturnValueOnce(firstGameSlotFixture);

        result = gameDbToGameConverter.convert(gameDbFixture);
      });

      afterAll(() => {
        gameSlotDbToGameSlotConverterMock.convert.mockReset();

        jest.clearAllMocks();
      });

      it('should call cardBuilder.build()', () => {
        expect(cardBuilderMock.build).toHaveBeenCalledTimes(1);
      });

      it('should call gameSlotDbToGameSlotConverterMock.convert()', () => {
        expect(gameSlotDbToGameSlotConverterMock.convert).toHaveBeenCalledTimes(
          gameDbFixture.gameSlotsDb.length,
        );

        for (const [i, gameSlotDb] of gameDbFixture.gameSlotsDb.entries()) {
          expect(
            gameSlotDbToGameSlotConverterMock.convert,
          ).toHaveBeenNthCalledWith(i + 1, gameSlotDb);
        }
      });

      it('should return a NonStartedGame with sorted game slots', () => {
        const expected: Partial<NonStartedGame> = {
          gameSlotsAmount: gameDbFixture.gameSlotsAmount,
          id: gameDbFixture.id,
          spec: {
            cards: [
              {
                amount: gameCardSpecDbFixture.amount,
                card: cardFixture,
              },
            ],
          },
          state: {
            active: false,
            slots: [firstGameSlotFixture, secondGameSlotFixture],
          },
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a started GameDb', () => {
    let gameCardSpecDbFixture: GameCardSpecDb;
    let gameDeckCardDbFixture: GameCardSpecDb;
    let gameDbFixture: GameDb;

    beforeAll(() => {
      gameDbFixture = GameDbFixtures.withActiveTrueAndGameSlotsOne;

      [gameCardSpecDbFixture] = JSON.parse(gameDbFixture.spec) as [
        GameCardSpecDb,
      ];

      [gameDeckCardDbFixture] = JSON.parse(gameDbFixture.deck) as [
        GameCardSpecDb,
      ];
    });

    describe('when called', () => {
      let cardColorFixture: CardColor;
      let cardFixture: Card;
      let gameDirectionFixture: GameDirection;
      let gameSlotFixture: ActiveGameSlot;

      let result: unknown;

      beforeAll(() => {
        cardColorFixture = CardColor.blue;
        cardFixture = CardFixtures.any;
        gameDirectionFixture = GameDirection.clockwise;
        gameSlotFixture = ActiveGameSlotFixtures.withPositionZero;

        cardBuilderMock.build.mockReturnValue(cardFixture);
        cardColorBuilderMock.build.mockReturnValue(cardColorFixture);
        gameDirectionDbToGameDirectionConverterMock.convert.mockReturnValueOnce(
          gameDirectionFixture,
        );
        gameSlotDbToGameSlotConverterMock.convert.mockReturnValue(
          gameSlotFixture,
        );

        result = gameDbToGameConverter.convert(gameDbFixture);
      });

      afterAll(() => {
        cardBuilderMock.build.mockReset();
        cardColorBuilderMock.build.mockReset();
        gameSlotDbToGameSlotConverterMock.convert.mockReset();

        jest.clearAllMocks();
      });

      it('should call gameSlotDbToGameSlotConverterMock.convert()', () => {
        expect(gameSlotDbToGameSlotConverterMock.convert).toHaveBeenCalledTimes(
          gameDbFixture.gameSlotsDb.length,
        );

        for (const [i, gameSlotDb] of gameDbFixture.gameSlotsDb.entries()) {
          expect(
            gameSlotDbToGameSlotConverterMock.convert,
          ).toHaveBeenNthCalledWith(i + 1, gameSlotDb);
        }
      });

      it('should call cardBuilder.build()', () => {
        expect(cardBuilderMock.build).toHaveBeenCalled();
      });

      it('should call cardColorBuilder.build()', () => {
        expect(cardColorBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(cardColorBuilderMock.build).toHaveBeenCalledWith(
          gameDbFixture.currentColor,
        );
      });

      it('should return an ActiveGame', () => {
        const expected: Partial<ActiveGame> = {
          gameSlotsAmount: gameDbFixture.gameSlotsAmount,
          id: gameDbFixture.id,
          spec: {
            cards: [
              {
                amount: gameCardSpecDbFixture.amount,
                card: cardFixture,
              },
            ],
          },
          state: {
            active: true,
            currentCard: cardFixture,
            currentColor: cardColorFixture,
            currentDirection: gameDirectionFixture,
            currentPlayingSlotIndex:
              gameDbFixture.currentPlayingSlotIndex as number,
            deck: [
              {
                amount: gameDeckCardDbFixture.amount,
                card: cardFixture,
              },
            ],
            drawCount: gameDbFixture.drawCount as number,
            slots: [gameSlotFixture],
          },
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
