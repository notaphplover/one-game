import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import {
  GameManagementInputPort,
  GamePersistenceOutputPort,
  GameTurnEndSignalMessage,
} from '@cornie-js/backend-game-application/games';
import {
  ActiveGame,
  FinishedGame,
  GameFindQuery,
} from '@cornie-js/backend-game-domain/games';
import {
  ActiveGameFixtures,
  FinishedGameFixtures,
} from '@cornie-js/backend-game-domain/games/fixtures';
import { Consumer, Message } from 'pulsar-client';

import { GameTurnEndSignalMessageConsumer } from './GameTurnEndSignalMessageConsumer';

describe(GameTurnEndSignalMessageConsumer.name, () => {
  let consumerMock: jest.Mocked<Consumer>;
  let gameManagementInputPortMock: jest.Mocked<GameManagementInputPort>;
  let gamePersistenceOutputPortMock: jest.Mocked<GamePersistenceOutputPort>;

  let gameTurnEndSignalMessageConsumer: GameTurnEndSignalMessageConsumer;

  beforeAll(() => {
    consumerMock = {
      acknowledge: jest.fn(),
      isConnected: jest.fn(),
      negativeAcknowledge: jest.fn(),
      receive: jest.fn(),
    } as Partial<jest.Mocked<Consumer>> as jest.Mocked<Consumer>;
    gameManagementInputPortMock = {
      updateGameWithAutoPlay: jest.fn(),
    } as Partial<
      jest.Mocked<GameManagementInputPort>
    > as jest.Mocked<GameManagementInputPort>;
    gamePersistenceOutputPortMock = {
      findOne: jest.fn(),
    } as Partial<
      jest.Mocked<GamePersistenceOutputPort>
    > as jest.Mocked<GamePersistenceOutputPort>;

    gameTurnEndSignalMessageConsumer = new GameTurnEndSignalMessageConsumer(
      consumerMock,
      gameManagementInputPortMock,
      gamePersistenceOutputPortMock,
    );
  });

  describe('.handleMessages', () => {
    describe('when called, and consumer.isConnected() returns true and consumer.receive() returns a GameTurnEndSignalMessage and gamePersistenceOutputPort.findOne() returns undefined', () => {
      let gameTurnEndSignalMessageFixture: GameTurnEndSignalMessage;
      let messageMock: jest.Mocked<Message>;

      let result: unknown;

      beforeAll(async () => {
        gameTurnEndSignalMessageFixture = {
          gameId: 'game-id-fixture',
          turn: 1,
        };
        messageMock = {
          getData: jest
            .fn()
            .mockReturnValueOnce(
              Buffer.from(JSON.stringify(gameTurnEndSignalMessageFixture)),
            ),
        } as Partial<jest.Mocked<Message>> as jest.Mocked<Message>;

        consumerMock.isConnected
          .mockReturnValueOnce(true)
          .mockReturnValueOnce(false);

        consumerMock.receive.mockResolvedValueOnce(messageMock);

        gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(undefined);

        consumerMock.acknowledge.mockResolvedValueOnce(null);

        result = await gameTurnEndSignalMessageConsumer.handleMessages();
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gamePersistenceOutputPort.findOne()', () => {
        const expected: GameFindQuery = {
          id: gameTurnEndSignalMessageFixture.gameId,
        };

        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(1);
        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          expected,
        );
      });

      it('should not call gameManagementInputPort.updateGameWithAutoPlay()', () => {
        expect(
          gameManagementInputPortMock.updateGameWithAutoPlay,
        ).not.toHaveBeenCalled();
      });

      it('should call consumer.acknowledge()', () => {
        expect(consumerMock.acknowledge).toHaveBeenCalledTimes(1);
        expect(consumerMock.acknowledge).toHaveBeenCalledWith(messageMock);
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called, and consumer.isConnected() returns true and consumer.receive() returns a GameTurnEndSignalMessage and gamePersistenceOutputPort.findOne() returns a non ActiveGame', () => {
      let gameFixture: FinishedGame;
      let gameTurnEndSignalMessageFixture: GameTurnEndSignalMessage;
      let messageMock: jest.Mocked<Message>;

      let result: unknown;

      beforeAll(async () => {
        gameFixture = FinishedGameFixtures.any;
        gameTurnEndSignalMessageFixture = {
          gameId: 'game-id-fixture',
          turn: 1,
        };
        messageMock = {
          getData: jest
            .fn()
            .mockReturnValueOnce(
              Buffer.from(JSON.stringify(gameTurnEndSignalMessageFixture)),
            ),
        } as Partial<jest.Mocked<Message>> as jest.Mocked<Message>;

        consumerMock.isConnected
          .mockReturnValueOnce(true)
          .mockReturnValueOnce(false);

        consumerMock.receive.mockResolvedValueOnce(messageMock);

        gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          gameFixture,
        );

        consumerMock.acknowledge.mockResolvedValueOnce(null);

        result = await gameTurnEndSignalMessageConsumer.handleMessages();
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gamePersistenceOutputPort.findOne()', () => {
        const expected: GameFindQuery = {
          id: gameTurnEndSignalMessageFixture.gameId,
        };

        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(1);
        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          expected,
        );
      });

      it('should not call gameManagementInputPort.updateGameWithAutoPlay()', () => {
        expect(
          gameManagementInputPortMock.updateGameWithAutoPlay,
        ).not.toHaveBeenCalled();
      });

      it('should call consumer.acknowledge()', () => {
        expect(consumerMock.acknowledge).toHaveBeenCalledTimes(1);
        expect(consumerMock.acknowledge).toHaveBeenCalledWith(messageMock);
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called, and consumer.isConnected() returns true and consumer.receive() returns a GameTurnEndSignalMessage and gamePersistenceOutputPort.findOne() returns an ActiveGame with turn distinct than message', () => {
      let gameFixture: ActiveGame;
      let gameTurnEndSignalMessageFixture: GameTurnEndSignalMessage;
      let messageMock: jest.Mocked<Message>;

      let result: unknown;

      beforeAll(async () => {
        gameFixture = ActiveGameFixtures.any;
        gameTurnEndSignalMessageFixture = {
          gameId: 'game-id-fixture',
          turn: gameFixture.state.turn - 1,
        };
        messageMock = {
          getData: jest
            .fn()
            .mockReturnValueOnce(
              Buffer.from(JSON.stringify(gameTurnEndSignalMessageFixture)),
            ),
        } as Partial<jest.Mocked<Message>> as jest.Mocked<Message>;

        consumerMock.isConnected
          .mockReturnValueOnce(true)
          .mockReturnValueOnce(false);

        consumerMock.receive.mockResolvedValueOnce(messageMock);

        gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          gameFixture,
        );

        consumerMock.acknowledge.mockResolvedValueOnce(null);

        result = await gameTurnEndSignalMessageConsumer.handleMessages();
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gamePersistenceOutputPort.findOne()', () => {
        const expected: GameFindQuery = {
          id: gameTurnEndSignalMessageFixture.gameId,
        };

        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(1);
        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          expected,
        );
      });

      it('should not call gameManagementInputPort.updateGameWithAutoPlay()', () => {
        expect(
          gameManagementInputPortMock.updateGameWithAutoPlay,
        ).not.toHaveBeenCalled();
      });

      it('should call consumer.acknowledge()', () => {
        expect(consumerMock.acknowledge).toHaveBeenCalledTimes(1);
        expect(consumerMock.acknowledge).toHaveBeenCalledWith(messageMock);
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called, and consumer.isConnected() returns true and consumer.receive() returns a GameTurnEndSignalMessage and gamePersistenceOutputPort.findOne() returns an ActiveGame with turn equals to message', () => {
      let gameFixture: ActiveGame;
      let gameTurnEndSignalMessageFixture: GameTurnEndSignalMessage;
      let messageMock: jest.Mocked<Message>;

      let result: unknown;

      beforeAll(async () => {
        gameFixture = ActiveGameFixtures.any;
        gameTurnEndSignalMessageFixture = {
          gameId: 'game-id-fixture',
          turn: gameFixture.state.turn,
        };
        messageMock = {
          getData: jest
            .fn()
            .mockReturnValueOnce(
              Buffer.from(JSON.stringify(gameTurnEndSignalMessageFixture)),
            ),
        } as Partial<jest.Mocked<Message>> as jest.Mocked<Message>;

        consumerMock.isConnected
          .mockReturnValueOnce(true)
          .mockReturnValueOnce(false);

        consumerMock.receive.mockResolvedValueOnce(messageMock);

        gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          gameFixture,
        );

        consumerMock.acknowledge.mockResolvedValueOnce(null);

        result = await gameTurnEndSignalMessageConsumer.handleMessages();
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gamePersistenceOutputPort.findOne()', () => {
        const expected: GameFindQuery = {
          id: gameTurnEndSignalMessageFixture.gameId,
        };

        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(1);
        expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          expected,
        );
      });

      it('should call gameManagementInputPort.updateGameWithAutoPlay()', () => {
        expect(
          gameManagementInputPortMock.updateGameWithAutoPlay,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameManagementInputPortMock.updateGameWithAutoPlay,
        ).toHaveBeenCalledWith(gameTurnEndSignalMessageFixture.gameId);
      });

      it('should call consumer.acknowledge()', () => {
        expect(consumerMock.acknowledge).toHaveBeenCalledTimes(1);
        expect(consumerMock.acknowledge).toHaveBeenCalledWith(messageMock);
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
