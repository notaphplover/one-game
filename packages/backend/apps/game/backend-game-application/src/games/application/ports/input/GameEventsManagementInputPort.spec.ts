import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder, Publisher } from '@cornie-js/backend-common';
import {
  MessageEvent,
  SsePublisher,
  SseTeardownExecutor,
} from '@cornie-js/backend-http';

import { GameEventsSubscriptionOutputPort } from '../output/GameEventsSubscriptionOutputPort';
import { GameEventsManagementInputPort } from './GameEventsManagementInputPort';

describe(GameEventsManagementInputPort.name, () => {
  let gameEventsSubscriptionOutputPortMock: jest.Mocked<GameEventsSubscriptionOutputPort>;

  let gameEventsManagementInputPort: GameEventsManagementInputPort;
  let messageEventFromStringifiedGameMessageEventBuilderMock: jest.Mocked<
    Builder<MessageEvent, [string]>
  >;

  beforeAll(() => {
    gameEventsSubscriptionOutputPortMock = {
      publish: jest.fn(),
      subscribe: jest.fn(),
    };
    messageEventFromStringifiedGameMessageEventBuilderMock = {
      build: jest.fn(),
    };

    gameEventsManagementInputPort = new GameEventsManagementInputPort(
      gameEventsSubscriptionOutputPortMock,
      messageEventFromStringifiedGameMessageEventBuilderMock,
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
        const expectedPublisher: Publisher<string> = {
          publish: expect.any(Function) as unknown as (value: string) => void,
        };

        expect(
          gameEventsSubscriptionOutputPortMock.subscribe,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameEventsSubscriptionOutputPortMock.subscribe,
        ).toHaveBeenCalledWith(gameIdFixture, expectedPublisher);
      });

      it('should resolve SseTeardownExecutor', () => {
        expect(result).toBe(sseTeardownExecutorFixture);
      });
    });
  });
});
