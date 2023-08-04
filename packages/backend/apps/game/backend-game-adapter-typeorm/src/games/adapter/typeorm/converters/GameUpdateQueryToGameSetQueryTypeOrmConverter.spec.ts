import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder, Converter } from '@cornie-js/backend-common';
import { Card, CardColor } from '@cornie-js/backend-game-domain/cards';
import {
  GameCardSpec,
  GameDirection,
  GameStatus,
  GameUpdateQuery,
} from '@cornie-js/backend-game-domain/games';
import { GameUpdateQueryFixtures } from '@cornie-js/backend-game-domain/games/fixtures';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { CardColorDb } from '../../../../cards/adapter/typeorm/models/CardColorDb';
import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { GameDb } from '../models/GameDb';
import { GameDirectionDb } from '../models/GameDirectionDb';
import { GameStatusDb } from '../models/GameStatusDb';
import { GameUpdateQueryToGameSetQueryTypeOrmConverter } from './GameUpdateQueryToGameSetQueryTypeOrmConverter';

describe(GameUpdateQueryToGameSetQueryTypeOrmConverter.name, () => {
  let cardColorDbBuilderMock: jest.Mocked<Builder<CardColorDb, [CardColor]>>;
  let cardDbBuilderMock: jest.Mocked<Builder<CardDb, [Card]>>;
  let gameCardSpecArrayToGameCardSpecArrayDbConverterMock: jest.Mocked<
    Converter<GameCardSpec[], string>
  >;
  let gameDirectionToGameDirectionDbConverterMock: jest.Mocked<
    Converter<GameDirection, GameDirectionDb>
  >;
  let gameStatusToGameStatusDbConverterMock: jest.Mocked<
    Converter<GameStatus, GameStatusDb>
  >;

  let gameUpdateQueryToGameSetQueryTypeOrmConverter: GameUpdateQueryToGameSetQueryTypeOrmConverter;

  beforeAll(() => {
    cardColorDbBuilderMock = {
      build: jest.fn(),
    };
    cardDbBuilderMock = {
      build: jest.fn(),
    };
    gameCardSpecArrayToGameCardSpecArrayDbConverterMock = {
      convert: jest.fn(),
    };
    gameDirectionToGameDirectionDbConverterMock = {
      convert: jest.fn(),
    };
    gameStatusToGameStatusDbConverterMock = {
      convert: jest.fn(),
    };

    gameUpdateQueryToGameSetQueryTypeOrmConverter =
      new GameUpdateQueryToGameSetQueryTypeOrmConverter(
        cardColorDbBuilderMock,
        cardDbBuilderMock,
        gameCardSpecArrayToGameCardSpecArrayDbConverterMock,
        gameDirectionToGameDirectionDbConverterMock,
        gameStatusToGameStatusDbConverterMock,
      );
  });

  describe('.convert', () => {
    describe('having a GameUpdateQuery with currentCard', () => {
      let gameUpdateQueryFixture: GameUpdateQuery;

      beforeAll(() => {
        gameUpdateQueryFixture = GameUpdateQueryFixtures.withCurrentCard;
      });

      describe('when called', () => {
        let cardDbFixture: CardDb;
        let result: unknown;

        beforeAll(() => {
          cardDbFixture = 0x0039;
          cardDbBuilderMock.build.mockReturnValueOnce(cardDbFixture);

          result = gameUpdateQueryToGameSetQueryTypeOrmConverter.convert(
            gameUpdateQueryFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call cardDbBuilder.build()', () => {
          expect(cardDbBuilderMock.build).toHaveBeenCalledTimes(1);
          expect(cardDbBuilderMock.build).toHaveBeenCalledWith(
            gameUpdateQueryFixture.currentCard,
          );
        });

        it('should return a QueryDeepPartialEntity<GameDb>', () => {
          const expectedProperties: Partial<QueryDeepPartialEntity<GameDb>> = {
            currentCard: cardDbFixture,
          };

          expect(result).toStrictEqual(
            expect.objectContaining(expectedProperties),
          );
        });
      });
    });

    describe('having a GameUpdateQuery with currentDirection', () => {
      let gameUpdateQueryFixture: GameUpdateQuery;

      beforeAll(() => {
        gameUpdateQueryFixture = GameUpdateQueryFixtures.withCurrentDirection;
      });

      describe('when called', () => {
        let gameDirectionDbFixture: GameDirectionDb;
        let result: unknown;

        beforeAll(() => {
          gameDirectionDbFixture = GameDirectionDb.antiClockwise;
          gameDirectionToGameDirectionDbConverterMock.convert.mockReturnValueOnce(
            gameDirectionDbFixture,
          );

          result = gameUpdateQueryToGameSetQueryTypeOrmConverter.convert(
            gameUpdateQueryFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call gameDirectionToGameDirectionDbConverter.convert()', () => {
          expect(
            gameDirectionToGameDirectionDbConverterMock.convert,
          ).toHaveBeenCalledTimes(1);
          expect(
            gameDirectionToGameDirectionDbConverterMock.convert,
          ).toHaveBeenCalledWith(gameUpdateQueryFixture.currentDirection);
        });

        it('should return a QueryDeepPartialEntity<GameDb>', () => {
          const expectedProperties: Partial<QueryDeepPartialEntity<GameDb>> = {
            currentDirection: gameDirectionDbFixture,
          };

          expect(result).toStrictEqual(
            expect.objectContaining(expectedProperties),
          );
        });
      });
    });

    describe('having a GameUpdateQuery with currentCurrentPlayingSlotIndex', () => {
      let gameUpdateQueryFixture: GameUpdateQuery;

      beforeAll(() => {
        gameUpdateQueryFixture =
          GameUpdateQueryFixtures.withCurrentPlayingSlotIndex;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameUpdateQueryToGameSetQueryTypeOrmConverter.convert(
            gameUpdateQueryFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a QueryDeepPartialEntity<GameDb>', () => {
          const expectedProperties: Partial<QueryDeepPartialEntity<GameDb>> = {
            currentPlayingSlotIndex:
              gameUpdateQueryFixture.currentPlayingSlotIndex as number,
          };

          expect(result).toStrictEqual(
            expect.objectContaining(expectedProperties),
          );
        });
      });
    });

    describe('having a GameUpdateQuery with currentTurnCardsPlayed', () => {
      let gameUpdateQueryFixture: GameUpdateQuery;

      beforeAll(() => {
        gameUpdateQueryFixture =
          GameUpdateQueryFixtures.withCurrentTurnCardsPlayed;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameUpdateQueryToGameSetQueryTypeOrmConverter.convert(
            gameUpdateQueryFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a QueryDeepPartialEntity<GameDb>', () => {
          const expectedProperties: Partial<QueryDeepPartialEntity<GameDb>> = {
            currentTurnCardsPlayed:
              gameUpdateQueryFixture.currentTurnCardsPlayed as boolean,
          };

          expect(result).toStrictEqual(
            expect.objectContaining(expectedProperties),
          );
        });
      });
    });

    describe('having a GameUpdateQuery with deck', () => {
      let gameUpdateQueryFixture: GameUpdateQuery;

      beforeAll(() => {
        gameUpdateQueryFixture = GameUpdateQueryFixtures.withDeck;
      });

      describe('when called', () => {
        let gameSpecCardsDbStringifiedFixture: string;
        let result: unknown;

        beforeAll(() => {
          gameSpecCardsDbStringifiedFixture = 'deck-fixture';
          gameCardSpecArrayToGameCardSpecArrayDbConverterMock.convert.mockReturnValueOnce(
            gameSpecCardsDbStringifiedFixture,
          );

          result = gameUpdateQueryToGameSetQueryTypeOrmConverter.convert(
            gameUpdateQueryFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call gameCardSpecArrayToGameCardSpecArrayDbConverter.convert()', () => {
          expect(
            gameCardSpecArrayToGameCardSpecArrayDbConverterMock.convert,
          ).toHaveBeenCalledTimes(1);
          expect(
            gameCardSpecArrayToGameCardSpecArrayDbConverterMock.convert,
          ).toHaveBeenCalledWith(gameUpdateQueryFixture.deck);
        });

        it('should return a QueryDeepPartialEntity<GameDb>', () => {
          const expectedProperties: Partial<QueryDeepPartialEntity<GameDb>> = {
            deck: gameSpecCardsDbStringifiedFixture,
          };

          expect(result).toStrictEqual(
            expect.objectContaining(expectedProperties),
          );
        });
      });
    });

    describe('having a GameUpdateQuery with discardPile', () => {
      let gameUpdateQueryFixture: GameUpdateQuery;

      beforeAll(() => {
        gameUpdateQueryFixture = GameUpdateQueryFixtures.withDiscardPile;
      });

      describe('when called', () => {
        let gameSpecCardsDbStringifiedFixture: string;
        let result: unknown;

        beforeAll(() => {
          gameSpecCardsDbStringifiedFixture = 'discard-pile-fixture';
          gameCardSpecArrayToGameCardSpecArrayDbConverterMock.convert.mockReturnValueOnce(
            gameSpecCardsDbStringifiedFixture,
          );

          result = gameUpdateQueryToGameSetQueryTypeOrmConverter.convert(
            gameUpdateQueryFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call gameCardSpecArrayToGameCardSpecArrayDbConverter.convert()', () => {
          expect(
            gameCardSpecArrayToGameCardSpecArrayDbConverterMock.convert,
          ).toHaveBeenCalledTimes(1);
          expect(
            gameCardSpecArrayToGameCardSpecArrayDbConverterMock.convert,
          ).toHaveBeenCalledWith(gameUpdateQueryFixture.discardPile);
        });

        it('should return a QueryDeepPartialEntity<GameDb>', () => {
          const expectedProperties: Partial<QueryDeepPartialEntity<GameDb>> = {
            discardPile: gameSpecCardsDbStringifiedFixture,
          };

          expect(result).toStrictEqual(
            expect.objectContaining(expectedProperties),
          );
        });
      });
    });

    describe('having a GameUpdateQuery with drawCount', () => {
      let gameUpdateQueryFixture: GameUpdateQuery;

      beforeAll(() => {
        gameUpdateQueryFixture = GameUpdateQueryFixtures.withDrawCount;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameUpdateQueryToGameSetQueryTypeOrmConverter.convert(
            gameUpdateQueryFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a QueryDeepPartialEntity<GameDb>', () => {
          const expectedProperties: Partial<QueryDeepPartialEntity<GameDb>> = {
            drawCount: gameUpdateQueryFixture.drawCount as number,
          };

          expect(result).toStrictEqual(
            expect.objectContaining(expectedProperties),
          );
        });
      });
    });

    describe('having a GameUpdateQuery with status', () => {
      let gameUpdateQueryFixture: GameUpdateQuery;

      beforeAll(() => {
        gameUpdateQueryFixture = GameUpdateQueryFixtures.withStatusActive;
      });

      describe('when called', () => {
        let gameStatusDbFixture: GameStatusDb;

        let result: unknown;

        beforeAll(() => {
          gameStatusDbFixture = GameStatusDb.active;

          gameStatusToGameStatusDbConverterMock.convert.mockReturnValueOnce(
            gameStatusDbFixture,
          );

          result = gameUpdateQueryToGameSetQueryTypeOrmConverter.convert(
            gameUpdateQueryFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a QueryDeepPartialEntity<GameDb>', () => {
          const expectedProperties: Partial<QueryDeepPartialEntity<GameDb>> = {
            status: gameStatusDbFixture,
          };

          expect(result).toStrictEqual(
            expect.objectContaining(expectedProperties),
          );
        });
      });
    });
  });
});
