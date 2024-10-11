import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder } from '@cornie-js/backend-common';
import { Card, CardColor } from '@cornie-js/backend-game-domain/cards';
import { CardFixtures } from '@cornie-js/backend-game-domain/cards/fixtures';
import {
  ActiveGame,
  ActiveGameSlot,
  FinishedGame,
  FinishedGameSlot,
  GameCardSpec,
  GameDirection,
  GameStatus,
  NonStartedGame,
  NonStartedGameSlot,
} from '@cornie-js/backend-game-domain/games';
import {
  ActiveGameSlotFixtures,
  FinishedGameSlotFixtures,
  GameCardSpecFixtures,
  NonStartedGameSlotFixtures,
} from '@cornie-js/backend-game-domain/games/fixtures';

import { CardColorDb } from '../../../../cards/adapter/typeorm/models/CardColorDb';
import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { GameDbFixtures } from '../fixtures/GameDbFixtures';
import { GameDb } from '../models/GameDb';
import { GameDirectionDb } from '../models/GameDirectionDb';
import { GameSlotDb } from '../models/GameSlotDb';
import { GameFromGameDbBuilder } from './GameFromGameDbBuilder';

describe(GameFromGameDbBuilder.name, () => {
  let cardBuilderMock: jest.Mocked<Builder<Card, [CardDb]>>;
  let cardColorBuilderMock: jest.Mocked<Builder<CardColor, [CardColorDb]>>;
  let gameCardSpecArrayFromGameCardSpecArrayDbBuilderMock: jest.Mocked<
    Builder<GameCardSpec[], [string]>
  >;
  let gameDirectionFromGameDirectionDbBuilderMock: jest.Mocked<
    Builder<GameDirection, [GameDirectionDb]>
  >;
  let gameSlotFromGameSlotDbBuilderMock: jest.Mocked<
    Builder<
      ActiveGameSlot | FinishedGameSlot | NonStartedGameSlot,
      [GameSlotDb]
    >
  >;

  let gameFromGameDbBuilder: GameFromGameDbBuilder;

  beforeAll(() => {
    cardBuilderMock = {
      build: jest.fn(),
    };
    cardColorBuilderMock = {
      build: jest.fn(),
    };
    gameCardSpecArrayFromGameCardSpecArrayDbBuilderMock = {
      build: jest.fn(),
    };
    gameDirectionFromGameDirectionDbBuilderMock = {
      build: jest.fn(),
    };
    gameSlotFromGameSlotDbBuilderMock = {
      build: jest.fn(),
    };

    gameFromGameDbBuilder = new GameFromGameDbBuilder(
      cardBuilderMock,
      cardColorBuilderMock,
      gameCardSpecArrayFromGameCardSpecArrayDbBuilderMock,
      gameDirectionFromGameDirectionDbBuilderMock,
      gameSlotFromGameSlotDbBuilderMock,
    );
  });

  describe('having a non started GameDb', () => {
    let gameDbFixture: GameDb;

    beforeAll(() => {
      gameDbFixture = GameDbFixtures.withStatusNonStartedAndGameSlotsOne;
    });

    describe('when called', () => {
      let cardFixture: Card;
      let gameSlotFixture: NonStartedGameSlot;

      let result: unknown;

      beforeAll(() => {
        cardFixture = CardFixtures.any;
        gameSlotFixture = NonStartedGameSlotFixtures.withPositionZero;

        cardBuilderMock.build.mockReturnValueOnce(cardFixture);
        gameSlotFromGameSlotDbBuilderMock.build.mockReturnValue(
          gameSlotFixture,
        );

        result = gameFromGameDbBuilder.build(gameDbFixture);
      });

      afterAll(() => {
        gameSlotFromGameSlotDbBuilderMock.build.mockReset();

        jest.clearAllMocks();
      });

      it('should call gameSlotFromGameSlotDbBuilderMock.build()', () => {
        expect(gameSlotFromGameSlotDbBuilderMock.build).toHaveBeenCalledTimes(
          gameDbFixture.gameSlotsDb.length,
        );

        for (const [i, gameSlotDb] of gameDbFixture.gameSlotsDb.entries()) {
          expect(
            gameSlotFromGameSlotDbBuilderMock.build,
          ).toHaveBeenNthCalledWith(i + 1, gameSlotDb);
        }
      });

      it('should return a NonStartedGame', () => {
        const expected: NonStartedGame = {
          id: gameDbFixture.id,
          isPublic: gameDbFixture.isPublic,
          name: gameDbFixture.name,
          state: {
            slots: [gameSlotFixture],
            status: GameStatus.nonStarted,
          },
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a non started GameDb with two slots', () => {
    let gameDbFixture: GameDb;

    beforeAll(() => {
      gameDbFixture = GameDbFixtures.withStatusNonStartedAndGameSlotsTwo;
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
        gameSlotFromGameSlotDbBuilderMock.build
          .mockReturnValueOnce(secondGameSlotFixture)
          .mockReturnValueOnce(firstGameSlotFixture);

        result = gameFromGameDbBuilder.build(gameDbFixture);
      });

      afterAll(() => {
        gameSlotFromGameSlotDbBuilderMock.build.mockReset();

        jest.clearAllMocks();
      });

      it('should call gameSlotFromGameSlotDbBuilderMock.build()', () => {
        expect(gameSlotFromGameSlotDbBuilderMock.build).toHaveBeenCalledTimes(
          gameDbFixture.gameSlotsDb.length,
        );

        for (const [i, gameSlotDb] of gameDbFixture.gameSlotsDb.entries()) {
          expect(
            gameSlotFromGameSlotDbBuilderMock.build,
          ).toHaveBeenNthCalledWith(i + 1, gameSlotDb);
        }
      });

      it('should return a NonStartedGame with sorted game slots', () => {
        const expected: NonStartedGame = {
          id: gameDbFixture.id,
          isPublic: gameDbFixture.isPublic,
          name: gameDbFixture.name,
          state: {
            slots: [firstGameSlotFixture, secondGameSlotFixture],
            status: GameStatus.nonStarted,
          },
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a finished GameDb with two slots', () => {
    let gameDbFixture: GameDb;

    beforeAll(() => {
      gameDbFixture = GameDbFixtures.withStatusFinishedAndGameSlotsTwo;
    });

    describe('when called', () => {
      let cardFixture: Card;
      let firstGameSlotFixture: FinishedGameSlot;
      let secondGameSlotFixture: FinishedGameSlot;

      let result: unknown;

      beforeAll(() => {
        cardFixture = CardFixtures.any;
        firstGameSlotFixture = FinishedGameSlotFixtures.withPositionZero;
        secondGameSlotFixture = FinishedGameSlotFixtures.withPositionZero;

        cardBuilderMock.build.mockReturnValueOnce(cardFixture);
        gameSlotFromGameSlotDbBuilderMock.build
          .mockReturnValueOnce(secondGameSlotFixture)
          .mockReturnValueOnce(firstGameSlotFixture);

        result = gameFromGameDbBuilder.build(gameDbFixture);
      });

      afterAll(() => {
        gameSlotFromGameSlotDbBuilderMock.build.mockReset();

        jest.clearAllMocks();
      });

      it('should call gameSlotFromGameSlotDbBuilderMock.build()', () => {
        expect(gameSlotFromGameSlotDbBuilderMock.build).toHaveBeenCalledTimes(
          gameDbFixture.gameSlotsDb.length,
        );

        for (const [i, gameSlotDb] of gameDbFixture.gameSlotsDb.entries()) {
          expect(
            gameSlotFromGameSlotDbBuilderMock.build,
          ).toHaveBeenNthCalledWith(i + 1, gameSlotDb);
        }
      });

      it('should return a FinishedGame with sorted game slots', () => {
        const expected: FinishedGame = {
          id: gameDbFixture.id,
          isPublic: gameDbFixture.isPublic,
          name: gameDbFixture.name,
          state: {
            slots: [firstGameSlotFixture, secondGameSlotFixture],
            status: GameStatus.finished,
          },
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having an active GameDb with null currentTurnSingleCardDraw', () => {
    let gameCardSpecArrayFixture: GameCardSpec[];
    let gameDbFixture: GameDb;

    beforeAll(() => {
      gameCardSpecArrayFixture = [GameCardSpecFixtures.any];
      gameDbFixture =
        GameDbFixtures.withStatusActiveAndGameSlotsOneAndCurrentTurnSingleCardDrawNull;
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
        gameCardSpecArrayFromGameCardSpecArrayDbBuilderMock.build
          .mockReturnValueOnce(gameCardSpecArrayFixture)
          .mockReturnValueOnce(gameCardSpecArrayFixture);
        gameDirectionFromGameDirectionDbBuilderMock.build.mockReturnValueOnce(
          gameDirectionFixture,
        );
        gameSlotFromGameSlotDbBuilderMock.build.mockReturnValue(
          gameSlotFixture,
        );

        result = gameFromGameDbBuilder.build(gameDbFixture);
      });

      afterAll(() => {
        cardBuilderMock.build.mockReset();
        cardColorBuilderMock.build.mockReset();
        gameSlotFromGameSlotDbBuilderMock.build.mockReset();

        jest.clearAllMocks();
      });

      it('should call gameSlotFromGameSlotDbBuilderMock.build()', () => {
        expect(gameSlotFromGameSlotDbBuilderMock.build).toHaveBeenCalledTimes(
          gameDbFixture.gameSlotsDb.length,
        );

        for (const [i, gameSlotDb] of gameDbFixture.gameSlotsDb.entries()) {
          expect(
            gameSlotFromGameSlotDbBuilderMock.build,
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

      it('should call gameCardSpecArrayFromGameCardSpecArrayDbBuilder.build()', () => {
        expect(
          gameCardSpecArrayFromGameCardSpecArrayDbBuilderMock.build,
        ).toHaveBeenCalledTimes(2);
        expect(
          gameCardSpecArrayFromGameCardSpecArrayDbBuilderMock.build,
        ).toHaveBeenNthCalledWith(1, gameDbFixture.deck);
        expect(
          gameCardSpecArrayFromGameCardSpecArrayDbBuilderMock.build,
        ).toHaveBeenNthCalledWith(2, gameDbFixture.discardPile);
      });

      it('should return an ActiveGame', () => {
        const expected: ActiveGame = {
          id: gameDbFixture.id,
          isPublic: gameDbFixture.isPublic,
          name: gameDbFixture.name,
          state: {
            currentCard: cardFixture,
            currentColor: cardColorFixture,
            currentDirection: gameDirectionFixture,
            currentPlayingSlotIndex:
              gameDbFixture.currentPlayingSlotIndex as number,
            currentTurnCardsDrawn:
              gameDbFixture.currentTurnCardsDrawn as boolean,
            currentTurnCardsPlayed:
              gameDbFixture.currentTurnCardsPlayed as boolean,
            currentTurnSingleCardDraw: undefined,
            deck: gameCardSpecArrayFixture,
            discardPile: gameCardSpecArrayFixture,
            drawCount: gameDbFixture.drawCount as number,
            lastGameActionId: gameDbFixture.lastGameActionId,
            skipCount: gameDbFixture.skipCount as number,
            slots: [gameSlotFixture],
            status: GameStatus.active,
            turn: gameDbFixture.turn as number,
            turnExpiresAt: gameDbFixture.turnExpiresAt as Date,
          },
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a started GameDb with currentTurnSingleCardDraw', () => {
    let gameCardSpecArrayFixture: GameCardSpec[];
    let gameDbFixture: GameDb;

    beforeAll(() => {
      gameCardSpecArrayFixture = [GameCardSpecFixtures.any];
      gameDbFixture =
        GameDbFixtures.withStatusActiveAndGameSlotsOneAndCurrentTurnSingleCardDraw;
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
        gameCardSpecArrayFromGameCardSpecArrayDbBuilderMock.build
          .mockReturnValueOnce(gameCardSpecArrayFixture)
          .mockReturnValueOnce(gameCardSpecArrayFixture);
        gameDirectionFromGameDirectionDbBuilderMock.build.mockReturnValueOnce(
          gameDirectionFixture,
        );
        gameSlotFromGameSlotDbBuilderMock.build.mockReturnValue(
          gameSlotFixture,
        );

        result = gameFromGameDbBuilder.build(gameDbFixture);
      });

      afterAll(() => {
        cardBuilderMock.build.mockReset();
        cardColorBuilderMock.build.mockReset();
        gameSlotFromGameSlotDbBuilderMock.build.mockReset();

        jest.clearAllMocks();
      });

      it('should call gameSlotFromGameSlotDbBuilderMock.build()', () => {
        expect(gameSlotFromGameSlotDbBuilderMock.build).toHaveBeenCalledTimes(
          gameDbFixture.gameSlotsDb.length,
        );

        for (const [i, gameSlotDb] of gameDbFixture.gameSlotsDb.entries()) {
          expect(
            gameSlotFromGameSlotDbBuilderMock.build,
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

      it('should call gameCardSpecArrayFromGameCardSpecArrayDbBuilder.build()', () => {
        expect(
          gameCardSpecArrayFromGameCardSpecArrayDbBuilderMock.build,
        ).toHaveBeenCalledTimes(2);
        expect(
          gameCardSpecArrayFromGameCardSpecArrayDbBuilderMock.build,
        ).toHaveBeenNthCalledWith(1, gameDbFixture.deck);
        expect(
          gameCardSpecArrayFromGameCardSpecArrayDbBuilderMock.build,
        ).toHaveBeenNthCalledWith(2, gameDbFixture.discardPile);
      });

      it('should return an ActiveGame', () => {
        const expected: ActiveGame = {
          id: gameDbFixture.id,
          isPublic: gameDbFixture.isPublic,
          name: gameDbFixture.name,
          state: {
            currentCard: cardFixture,
            currentColor: cardColorFixture,
            currentDirection: gameDirectionFixture,
            currentPlayingSlotIndex:
              gameDbFixture.currentPlayingSlotIndex as number,
            currentTurnCardsDrawn:
              gameDbFixture.currentTurnCardsDrawn as boolean,
            currentTurnCardsPlayed:
              gameDbFixture.currentTurnCardsPlayed as boolean,
            currentTurnSingleCardDraw: cardFixture,
            deck: gameCardSpecArrayFixture,
            discardPile: gameCardSpecArrayFixture,
            drawCount: gameDbFixture.drawCount as number,
            lastGameActionId: gameDbFixture.lastGameActionId,
            skipCount: gameDbFixture.skipCount as number,
            slots: [gameSlotFixture],
            status: GameStatus.active,
            turn: gameDbFixture.turn as number,
            turnExpiresAt: gameDbFixture.turnExpiresAt as Date,
          },
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
