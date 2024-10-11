import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder } from '@cornie-js/backend-common';
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
import { GameSetQueryTypeOrmFromGameUpdateQueryBuilder } from './GameSetQueryTypeOrmFromGameUpdateQueryBuilder';

describe(GameSetQueryTypeOrmFromGameUpdateQueryBuilder.name, () => {
  let cardColorDbBuilderMock: jest.Mocked<Builder<CardColorDb, [CardColor]>>;
  let cardDbBuilderMock: jest.Mocked<Builder<CardDb, [Card]>>;
  let gameCardSpecArrayDbFromGameCardSpecArrayBuilderMock: jest.Mocked<
    Builder<string, [GameCardSpec[]]>
  >;
  let gameDirectionDbFromGameDirectionBuilderMock: jest.Mocked<
    Builder<GameDirectionDb, [GameDirection]>
  >;
  let gameStatusDbFromGameStatusBuilderMock: jest.Mocked<
    Builder<GameStatusDb, [GameStatus]>
  >;

  let gameSetQueryTypeOrmFromGameUpdateQueryBuilder: GameSetQueryTypeOrmFromGameUpdateQueryBuilder;

  beforeAll(() => {
    cardColorDbBuilderMock = {
      build: jest.fn(),
    };
    cardDbBuilderMock = {
      build: jest.fn(),
    };
    gameCardSpecArrayDbFromGameCardSpecArrayBuilderMock = {
      build: jest.fn(),
    };
    gameDirectionDbFromGameDirectionBuilderMock = {
      build: jest.fn(),
    };
    gameStatusDbFromGameStatusBuilderMock = {
      build: jest.fn(),
    };

    gameSetQueryTypeOrmFromGameUpdateQueryBuilder =
      new GameSetQueryTypeOrmFromGameUpdateQueryBuilder(
        cardColorDbBuilderMock,
        cardDbBuilderMock,
        gameCardSpecArrayDbFromGameCardSpecArrayBuilderMock,
        gameDirectionDbFromGameDirectionBuilderMock,
        gameStatusDbFromGameStatusBuilderMock,
      );
  });

  describe('.build', () => {
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

          result = gameSetQueryTypeOrmFromGameUpdateQueryBuilder.build(
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
          gameDirectionDbFromGameDirectionBuilderMock.build.mockReturnValueOnce(
            gameDirectionDbFixture,
          );

          result = gameSetQueryTypeOrmFromGameUpdateQueryBuilder.build(
            gameUpdateQueryFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call gameDirectionToGameDirectionDbBuilder.build()', () => {
          expect(
            gameDirectionDbFromGameDirectionBuilderMock.build,
          ).toHaveBeenCalledTimes(1);
          expect(
            gameDirectionDbFromGameDirectionBuilderMock.build,
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
          result = gameSetQueryTypeOrmFromGameUpdateQueryBuilder.build(
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

    describe('having a GameUpdateQuery with currentTurnCardsDrawn', () => {
      let gameUpdateQueryFixture: GameUpdateQuery;

      beforeAll(() => {
        gameUpdateQueryFixture =
          GameUpdateQueryFixtures.withCurrentTurnCardsDrawn;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameSetQueryTypeOrmFromGameUpdateQueryBuilder.build(
            gameUpdateQueryFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a QueryDeepPartialEntity<GameDb>', () => {
          const expectedProperties: Partial<QueryDeepPartialEntity<GameDb>> = {
            currentTurnCardsDrawn:
              gameUpdateQueryFixture.currentTurnCardsDrawn as boolean,
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
          result = gameSetQueryTypeOrmFromGameUpdateQueryBuilder.build(
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

    describe('having a GameUpdateQuery with currentTurnSingleCardDraw', () => {
      let gameUpdateQueryFixture: GameUpdateQuery;

      beforeAll(() => {
        gameUpdateQueryFixture =
          GameUpdateQueryFixtures.currentTurnSingleCardDraw;
      });

      describe('when called', () => {
        let cardDbFixture: CardDb;

        let result: unknown;

        beforeAll(() => {
          cardDbFixture = 0x0039;

          cardDbBuilderMock.build.mockReturnValueOnce(cardDbFixture);

          result = gameSetQueryTypeOrmFromGameUpdateQueryBuilder.build(
            gameUpdateQueryFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call cardDbBuilder.build()', () => {
          expect(cardDbBuilderMock.build).toHaveBeenCalledTimes(1);
          expect(cardDbBuilderMock.build).toHaveBeenCalledWith(
            gameUpdateQueryFixture.currentTurnSingleCardDraw,
          );
        });

        it('should return a QueryDeepPartialEntity<GameDb>', () => {
          const expectedProperties: Partial<QueryDeepPartialEntity<GameDb>> = {
            currentTurnSingleCardDraw: cardDbFixture,
          };

          expect(result).toStrictEqual(
            expect.objectContaining(expectedProperties),
          );
        });
      });
    });

    describe('having a GameUpdateQuery with currentTurnSingleCardDraw null', () => {
      let gameUpdateQueryFixture: GameUpdateQuery;

      beforeAll(() => {
        gameUpdateQueryFixture =
          GameUpdateQueryFixtures.currentTurnSingleCardDrawNull;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameSetQueryTypeOrmFromGameUpdateQueryBuilder.build(
            gameUpdateQueryFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should not call cardDbBuilder.build()', () => {
          expect(cardDbBuilderMock.build).not.toHaveBeenCalled();
        });

        it('should return a QueryDeepPartialEntity<GameDb>', () => {
          const expectedProperties: Partial<QueryDeepPartialEntity<GameDb>> = {
            currentTurnSingleCardDraw: null,
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
          gameCardSpecArrayDbFromGameCardSpecArrayBuilderMock.build.mockReturnValueOnce(
            gameSpecCardsDbStringifiedFixture,
          );

          result = gameSetQueryTypeOrmFromGameUpdateQueryBuilder.build(
            gameUpdateQueryFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call gameCardSpecArrayDbFromGameCardSpecArrayBuilder.build()', () => {
          expect(
            gameCardSpecArrayDbFromGameCardSpecArrayBuilderMock.build,
          ).toHaveBeenCalledTimes(1);
          expect(
            gameCardSpecArrayDbFromGameCardSpecArrayBuilderMock.build,
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
          gameCardSpecArrayDbFromGameCardSpecArrayBuilderMock.build.mockReturnValueOnce(
            gameSpecCardsDbStringifiedFixture,
          );

          result = gameSetQueryTypeOrmFromGameUpdateQueryBuilder.build(
            gameUpdateQueryFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call gameCardSpecArrayToGameCardSpecArrayDbBuilder.build()', () => {
          expect(
            gameCardSpecArrayDbFromGameCardSpecArrayBuilderMock.build,
          ).toHaveBeenCalledTimes(1);
          expect(
            gameCardSpecArrayDbFromGameCardSpecArrayBuilderMock.build,
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
          result = gameSetQueryTypeOrmFromGameUpdateQueryBuilder.build(
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

    describe('having a GameUpdateQuery with withLastGameActionId null', () => {
      let gameUpdateQueryFixture: GameUpdateQuery;

      beforeAll(() => {
        gameUpdateQueryFixture =
          GameUpdateQueryFixtures.withLastGameActionIdNull;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameSetQueryTypeOrmFromGameUpdateQueryBuilder.build(
            gameUpdateQueryFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a QueryDeepPartialEntity<GameDb>', () => {
          const expectedProperties: Partial<QueryDeepPartialEntity<GameDb>> = {
            lastGameAction: null,
          };

          expect(result).toStrictEqual(
            expect.objectContaining(expectedProperties),
          );
        });
      });
    });

    describe('having a GameUpdateQuery with withLastGameActionId string', () => {
      let gameUpdateQueryFixture: GameUpdateQuery;

      beforeAll(() => {
        gameUpdateQueryFixture =
          GameUpdateQueryFixtures.withLastGameActionIdString;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameSetQueryTypeOrmFromGameUpdateQueryBuilder.build(
            gameUpdateQueryFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a QueryDeepPartialEntity<GameDb>', () => {
          const expectedProperties: Partial<QueryDeepPartialEntity<GameDb>> = {
            lastGameAction: {
              id: gameUpdateQueryFixture.lastGameActionId as string,
            },
          };

          expect(result).toStrictEqual(
            expect.objectContaining(expectedProperties),
          );
        });
      });
    });

    describe('having a GameUpdateQuery with skipCount', () => {
      let gameUpdateQueryFixture: GameUpdateQuery;

      beforeAll(() => {
        gameUpdateQueryFixture = GameUpdateQueryFixtures.withSkipCount;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameSetQueryTypeOrmFromGameUpdateQueryBuilder.build(
            gameUpdateQueryFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a QueryDeepPartialEntity<GameDb>', () => {
          const expectedProperties: Partial<QueryDeepPartialEntity<GameDb>> = {
            skipCount: gameUpdateQueryFixture.skipCount as number,
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

          gameStatusDbFromGameStatusBuilderMock.build.mockReturnValueOnce(
            gameStatusDbFixture,
          );

          result = gameSetQueryTypeOrmFromGameUpdateQueryBuilder.build(
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

    describe('having a GameUpdateQuery with turn', () => {
      let gameUpdateQueryFixture: GameUpdateQuery;

      beforeAll(() => {
        gameUpdateQueryFixture = GameUpdateQueryFixtures.withTurn;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameSetQueryTypeOrmFromGameUpdateQueryBuilder.build(
            gameUpdateQueryFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a QueryDeepPartialEntity<GameDb>', () => {
          const expectedProperties: Partial<QueryDeepPartialEntity<GameDb>> = {
            turn: gameUpdateQueryFixture.turn as number,
          };

          expect(result).toStrictEqual(
            expect.objectContaining(expectedProperties),
          );
        });
      });
    });

    describe('having a GameUpdateQuery with turnExpiresAt', () => {
      let gameUpdateQueryFixture: GameUpdateQuery;

      beforeAll(() => {
        gameUpdateQueryFixture = GameUpdateQueryFixtures.withTurnExpiresAt;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameSetQueryTypeOrmFromGameUpdateQueryBuilder.build(
            gameUpdateQueryFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a QueryDeepPartialEntity<GameDb>', () => {
          const expectedProperties: Partial<QueryDeepPartialEntity<GameDb>> = {
            turnExpiresAt: gameUpdateQueryFixture.turnExpiresAt as Date,
          };

          expect(result).toStrictEqual(
            expect.objectContaining(expectedProperties),
          );
        });
      });
    });
  });
});
