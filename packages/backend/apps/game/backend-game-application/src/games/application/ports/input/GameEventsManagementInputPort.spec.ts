import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { SsePublisher, SseTeardownExecutor } from '@cornie-js/backend-http';

import { GameEventsSubscriptionOutputPort } from '../output/GameEventsSubscriptionOutputPort';
import { GameEventsManagementInputPort } from './GameEventsManagementInputPort';

describe(GameEventsManagementInputPort.name, () => {
  let gameEventsSubscriptionOutputPortMock: jest.Mocked<GameEventsSubscriptionOutputPort>;

  let gameEventsManagementInputPort: GameEventsManagementInputPort;

  beforeAll(() => {
    gameEventsSubscriptionOutputPortMock = {
      subscribe: jest.fn(),
    };

    gameEventsManagementInputPort = new GameEventsManagementInputPort(
      gameEventsSubscriptionOutputPortMock,
    );
  });

  describe('.subscribe', () => {
    let gameIdFixture: string;
    let ssePublisherFixture: SsePublisher;

    beforeAll(() => {
      gameIdFixture = 'game-id-fixture';
      ssePublisherFixture = Symbol() as unknown as SsePublisher;
    });

    describe('when called', () => {
      let sseTeardownExecutorFixture: SseTeardownExecutor;
      let result: unknown;

      beforeAll(async () => {
        sseTeardownExecutorFixture = Symbol() as unknown as SseTeardownExecutor;

        gameEventsSubscriptionOutputPortMock.subscribe.mockResolvedValueOnce(
          sseTeardownExecutorFixture,
        );

        result = await gameEventsManagementInputPort.subscribe(
          gameIdFixture,
          ssePublisherFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameEventsSubscriptionOutputPort.subscribe()', () => {
        expect(
          gameEventsSubscriptionOutputPortMock.subscribe,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameEventsSubscriptionOutputPortMock.subscribe,
        ).toHaveBeenCalledWith(gameIdFixture, ssePublisherFixture);
      });

      it('should resolve SseTeardownExecutor', () => {
        expect(result).toBe(sseTeardownExecutorFixture);
      });
    });
  });
});
