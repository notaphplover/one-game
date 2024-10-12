import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./cloneGame');

import { models as apiModels } from '@cornie-js/api-models';

import { cloneGame } from './cloneGame';
import { handleGameMessageEvents } from './handleGameMessageEvents';

describe(handleGameMessageEvents.name, () => {
  describe('having an empty messageEventsQueue', () => {
    let gameFixture: apiModels.ActiveGameV1;
    let messageEventsQueueFixture: [];
    let onCardsChangeMock: jest.Mock<(gameSlotIndex: number) => void>;
    let onTurnChangeMock: jest.Mock<(gameSlotIndex: number) => void>;

    beforeAll(() => {
      gameFixture = {
        id: 'game-id',
        isPublic: false,
        state: {
          currentCard: {
            kind: 'wild',
          },
          currentColor: 'blue',
          currentDirection: 'antiClockwise',
          currentPlayingSlotIndex: 0,
          currentTurnCardsDrawn: true,
          currentTurnCardsPlayed: true,
          drawCount: 0,
          lastEventId: 'event-id-fixture',
          slots: [],
          status: 'active',
          turnExpiresAt: '2020-01-01T00:00:00.000Z',
        },
      };

      messageEventsQueueFixture = [];

      onCardsChangeMock = jest.fn();
      onTurnChangeMock = jest.fn();
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        (cloneGame as jest.Mock<typeof cloneGame>).mockReturnValueOnce(
          gameFixture,
        );

        result = handleGameMessageEvents(
          gameFixture,
          messageEventsQueueFixture,
          onCardsChangeMock,
          onTurnChangeMock,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call cloneGame', () => {
        expect(cloneGame).toHaveBeenCalledTimes(1);
        expect(cloneGame).toHaveBeenCalledWith(gameFixture);
      });

      it('should return game', () => {
        expect(result).toBe(gameFixture);
      });
    });
  });

  describe('having a game with currentTurnCardsDrawn false and non-zero drawCount and messageEventsQueue with a cards drawn message event', () => {
    let buildGameFixture: () => apiModels.ActiveGameV1;
    let messageEventsQueueFixture: [[string, apiModels.CardsDrawnGameEventV2]];
    let onCardsChangeMock: jest.Mock<(gameSlotIndex: number) => void>;
    let onTurnChangeMock: jest.Mock<(gameSlotIndex: number) => void>;

    beforeAll(() => {
      buildGameFixture = () => ({
        id: 'game-id',
        isPublic: false,
        state: {
          currentCard: {
            kind: 'wild',
          },
          currentColor: 'blue',
          currentDirection: 'antiClockwise',
          currentPlayingSlotIndex: 0,
          currentTurnCardsDrawn: false,
          currentTurnCardsPlayed: true,
          drawCount: 2,
          lastEventId: 'event-id-fixture',
          slots: [
            {
              cardsAmount: 1,
              userId: 'user-id-fixture',
            },
          ],
          status: 'active',
          turnExpiresAt: '2020-01-01T00:00:00.000Z',
        },
      });

      messageEventsQueueFixture = [
        [
          'message-event-id-fixture',
          {
            currentPlayingSlotIndex: 0,
            drawAmount: 2,
            kind: 'cardsDrawn',
            position: 3,
          },
        ],
      ];

      onCardsChangeMock = jest.fn();
      onTurnChangeMock = jest.fn();
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        (cloneGame as jest.Mock<typeof cloneGame>).mockReturnValueOnce(
          buildGameFixture(),
        );

        result = handleGameMessageEvents(
          buildGameFixture(),
          messageEventsQueueFixture,
          onCardsChangeMock,
          onTurnChangeMock,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call cloneGame', () => {
        expect(cloneGame).toHaveBeenCalledTimes(1);
        expect(cloneGame).toHaveBeenCalledWith(buildGameFixture());
      });

      it('should call onCardsChange()', () => {
        const [[, cardsDrawnGameEventV2]] = messageEventsQueueFixture;

        expect(onCardsChangeMock).toHaveBeenCalledTimes(1);
        expect(onCardsChangeMock).toHaveBeenCalledWith(
          cardsDrawnGameEventV2.currentPlayingSlotIndex,
        );
      });

      it('should return game', () => {
        const gameFixture: apiModels.ActiveGameV1 = buildGameFixture();
        const [gameSlotFixture] = gameFixture.state.slots as [
          apiModels.ActiveGameSlotV1,
        ];
        const [[eventId, cardsDrawnGameEventV2]] = messageEventsQueueFixture;

        const expected: apiModels.ActiveGameV1 = {
          ...gameFixture,
          state: {
            ...gameFixture.state,
            currentTurnCardsDrawn: true,
            drawCount: 0,
            lastEventId: eventId,
            slots: [
              {
                cardsAmount:
                  gameSlotFixture.cardsAmount +
                  cardsDrawnGameEventV2.drawAmount,
                userId: gameSlotFixture.userId,
              },
            ],
          },
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a game, with a cards played message event with null current values', () => {
    let buildGameFixture: () => apiModels.ActiveGameV1;
    let messageEventsQueueFixture: [[string, apiModels.CardsPlayedGameEventV2]];
    let onCardsChangeMock: jest.Mock<(gameSlotIndex: number) => void>;
    let onTurnChangeMock: jest.Mock<(gameSlotIndex: number) => void>;

    beforeAll(() => {
      buildGameFixture = () => ({
        id: 'game-id',
        isPublic: false,
        state: {
          currentCard: {
            kind: 'wild',
          },
          currentColor: 'blue',
          currentDirection: 'antiClockwise',
          currentPlayingSlotIndex: 0,
          currentTurnCardsDrawn: true,
          currentTurnCardsPlayed: false,
          drawCount: 0,
          lastEventId: 'event-id-fixture',
          slots: [
            {
              cardsAmount: 3,
              userId: 'user-id-fixture',
            },
          ],
          status: 'active',
          turnExpiresAt: '2020-01-01T00:00:00.000Z',
        },
      });

      messageEventsQueueFixture = [
        [
          'message-event-id-fixture',
          {
            cards: [
              {
                kind: 'wildDraw4',
              },
            ],
            currentCard: null,
            currentColor: null,
            currentDirection: null,
            currentPlayingSlotIndex: 0,
            drawCount: null,
            kind: 'cardsPlayed',
            position: 3,
          },
        ],
      ];

      onCardsChangeMock = jest.fn();
      onTurnChangeMock = jest.fn();
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        (cloneGame as jest.Mock<typeof cloneGame>).mockReturnValueOnce(
          buildGameFixture(),
        );

        result = handleGameMessageEvents(
          buildGameFixture(),
          messageEventsQueueFixture,
          onCardsChangeMock,
          onTurnChangeMock,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call cloneGame', () => {
        expect(cloneGame).toHaveBeenCalledTimes(1);
        expect(cloneGame).toHaveBeenCalledWith(buildGameFixture());
      });

      it('should call onCardsChange()', () => {
        const [[, cardsPlayedGameEventV2]] = messageEventsQueueFixture;

        expect(onCardsChangeMock).toHaveBeenCalledTimes(1);
        expect(onCardsChangeMock).toHaveBeenCalledWith(
          cardsPlayedGameEventV2.currentPlayingSlotIndex,
        );
      });

      it('should return game', () => {
        const gameFixture: apiModels.ActiveGameV1 = buildGameFixture();
        const [gameSlotFixture] = gameFixture.state.slots as [
          apiModels.ActiveGameSlotV1,
        ];
        const [[, cardsPlayedGameEventV2]] = messageEventsQueueFixture;

        const expected: apiModels.FinishedGameV1 = {
          ...gameFixture,
          state: {
            slots: [
              {
                cardsAmount:
                  gameSlotFixture.cardsAmount -
                  cardsPlayedGameEventV2.cards.length,
                userId: gameSlotFixture.userId,
              },
            ],
            status: 'finished',
          },
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a game with currentTurnCardsPlayed false and messageEventsQueue with a cards played message event with non null current values', () => {
    let buildGameFixture: () => apiModels.ActiveGameV1;
    let messageEventsQueueFixture: [[string, apiModels.CardsPlayedGameEventV2]];
    let onCardsChangeMock: jest.Mock<(gameSlotIndex: number) => void>;
    let onTurnChangeMock: jest.Mock<(gameSlotIndex: number) => void>;

    beforeAll(() => {
      buildGameFixture = () => ({
        id: 'game-id',
        isPublic: false,
        state: {
          currentCard: {
            kind: 'wild',
          },
          currentColor: 'blue',
          currentDirection: 'antiClockwise',
          currentPlayingSlotIndex: 0,
          currentTurnCardsDrawn: true,
          currentTurnCardsPlayed: false,
          drawCount: 0,
          lastEventId: 'event-id-fixture',
          slots: [
            {
              cardsAmount: 3,
              userId: 'user-id-fixture',
            },
          ],
          status: 'active',
          turnExpiresAt: '2020-01-01T00:00:00.000Z',
        },
      });

      messageEventsQueueFixture = [
        [
          'message-event-id-fixture',
          {
            cards: [
              {
                kind: 'wildDraw4',
              },
            ],
            currentCard: {
              kind: 'wildDraw4',
            },
            currentColor: 'green',
            currentDirection: 'clockwise',
            currentPlayingSlotIndex: 0,
            drawCount: 0,
            kind: 'cardsPlayed',
            position: 3,
          },
        ],
      ];

      onCardsChangeMock = jest.fn();
      onTurnChangeMock = jest.fn();
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        (cloneGame as jest.Mock<typeof cloneGame>).mockReturnValueOnce(
          buildGameFixture(),
        );

        result = handleGameMessageEvents(
          buildGameFixture(),
          messageEventsQueueFixture,
          onCardsChangeMock,
          onTurnChangeMock,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call cloneGame', () => {
        expect(cloneGame).toHaveBeenCalledTimes(1);
        expect(cloneGame).toHaveBeenCalledWith(buildGameFixture());
      });

      it('should call onCardsChange()', () => {
        const [[, cardsPlayedGameEventV2]] = messageEventsQueueFixture;

        expect(onCardsChangeMock).toHaveBeenCalledTimes(1);
        expect(onCardsChangeMock).toHaveBeenCalledWith(
          cardsPlayedGameEventV2.currentPlayingSlotIndex,
        );
      });

      it('should return game', () => {
        const gameFixture: apiModels.ActiveGameV1 = buildGameFixture();
        const [gameSlotFixture] = gameFixture.state.slots as [
          apiModels.ActiveGameSlotV1,
        ];
        const [[eventId, cardsPlayedGameEventV2]] = messageEventsQueueFixture;

        const expected: apiModels.ActiveGameV1 = {
          ...gameFixture,
          state: {
            ...gameFixture.state,
            currentCard: cardsPlayedGameEventV2.currentCard as apiModels.CardV1,
            currentColor:
              cardsPlayedGameEventV2.currentColor as apiModels.CardColorV1,
            currentDirection:
              cardsPlayedGameEventV2.currentDirection as apiModels.GameDirectionV1,
            currentTurnCardsPlayed: true,
            drawCount: cardsPlayedGameEventV2.drawCount as number,
            lastEventId: eventId,
            slots: [
              {
                cardsAmount:
                  gameSlotFixture.cardsAmount -
                  cardsPlayedGameEventV2.cards.length,
                userId: gameSlotFixture.userId,
              },
            ],
          },
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a game, with a turn passed message event with null nextPlayingSlotIndex', () => {
    let buildGameFixture: () => apiModels.ActiveGameV1;
    let messageEventsQueueFixture: [[string, apiModels.TurnPassedGameEventV2]];
    let onCardsChangeMock: jest.Mock<(gameSlotIndex: number) => void>;
    let onTurnChangeMock: jest.Mock<(gameSlotIndex: number) => void>;

    beforeAll(() => {
      buildGameFixture = () => ({
        id: 'game-id',
        isPublic: false,
        state: {
          currentCard: {
            kind: 'wild',
          },
          currentColor: 'blue',
          currentDirection: 'antiClockwise',
          currentPlayingSlotIndex: 0,
          currentTurnCardsDrawn: true,
          currentTurnCardsPlayed: true,
          drawCount: 0,
          lastEventId: 'event-id-fixture',
          slots: [
            {
              cardsAmount: 3,
              userId: 'user-id-fixture',
            },
          ],
          status: 'active',
          turnExpiresAt: '2020-01-01T00:00:00.000Z',
        },
      });

      messageEventsQueueFixture = [
        [
          'message-event-id-fixture',
          {
            currentPlayingSlotIndex: 0,
            kind: 'turnPassed',
            nextPlayingSlotIndex: null,
            position: 3,
          },
        ],
      ];

      onCardsChangeMock = jest.fn();
      onTurnChangeMock = jest.fn();
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        (cloneGame as jest.Mock<typeof cloneGame>).mockReturnValueOnce(
          buildGameFixture(),
        );

        result = handleGameMessageEvents(
          buildGameFixture(),
          messageEventsQueueFixture,
          onCardsChangeMock,
          onTurnChangeMock,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call cloneGame', () => {
        expect(cloneGame).toHaveBeenCalledTimes(1);
        expect(cloneGame).toHaveBeenCalledWith(buildGameFixture());
      });

      it('should return game', () => {
        const gameFixture: apiModels.ActiveGameV1 = buildGameFixture();
        const [gameSlotFixture] = gameFixture.state.slots as [
          apiModels.ActiveGameSlotV1,
        ];

        const expected: apiModels.FinishedGameV1 = {
          ...gameFixture,
          state: {
            slots: [
              {
                cardsAmount: gameSlotFixture.cardsAmount,
                userId: gameSlotFixture.userId,
              },
            ],
            status: 'finished',
          },
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a game, with a turn passed message event with non null nextPlayingSlotIndex', () => {
    let buildGameFixture: () => apiModels.ActiveGameV1;
    let messageEventsQueueFixture: [[string, apiModels.TurnPassedGameEventV2]];
    let onCardsChangeMock: jest.Mock<(gameSlotIndex: number) => void>;
    let onTurnChangeMock: jest.Mock<(gameSlotIndex: number) => void>;

    beforeAll(() => {
      buildGameFixture = () => ({
        id: 'game-id',
        isPublic: false,
        state: {
          currentCard: {
            kind: 'wild',
          },
          currentColor: 'blue',
          currentDirection: 'antiClockwise',
          currentPlayingSlotIndex: 0,
          currentTurnCardsDrawn: true,
          currentTurnCardsPlayed: true,
          drawCount: 0,
          lastEventId: 'event-id-fixture',
          slots: [
            {
              cardsAmount: 3,
              userId: 'user-id-fixture',
            },
          ],
          status: 'active',
          turnExpiresAt: '2020-01-01T00:00:00.000Z',
        },
      });

      messageEventsQueueFixture = [
        [
          'message-event-id-fixture',
          {
            currentPlayingSlotIndex: 0,
            kind: 'turnPassed',
            nextPlayingSlotIndex: 1,
            position: 3,
          },
        ],
      ];

      onCardsChangeMock = jest.fn();
      onTurnChangeMock = jest.fn();
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        (cloneGame as jest.Mock<typeof cloneGame>).mockReturnValueOnce(
          buildGameFixture(),
        );

        result = handleGameMessageEvents(
          buildGameFixture(),
          messageEventsQueueFixture,
          onCardsChangeMock,
          onTurnChangeMock,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call cloneGame', () => {
        expect(cloneGame).toHaveBeenCalledTimes(1);
        expect(cloneGame).toHaveBeenCalledWith(buildGameFixture());
      });

      it('should call onTurnChange()', () => {
        const [[, messageEventFixture]] = messageEventsQueueFixture;

        expect(onTurnChangeMock).toHaveBeenCalledTimes(1);
        expect(onTurnChangeMock).toHaveBeenCalledWith(
          messageEventFixture.nextPlayingSlotIndex,
        );
      });

      it('should return game', () => {
        const gameFixture: apiModels.ActiveGameV1 = buildGameFixture();

        const [[eventId, turnPassedGameEventV2]] = messageEventsQueueFixture;

        const expected: apiModels.ActiveGameV1 = {
          ...gameFixture,
          state: {
            ...gameFixture.state,
            currentPlayingSlotIndex:
              turnPassedGameEventV2.nextPlayingSlotIndex as number,
            lastEventId: eventId,
          },
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
