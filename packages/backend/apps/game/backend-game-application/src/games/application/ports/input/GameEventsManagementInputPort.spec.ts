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
  let messageEventFromStringifiedGameMessageEventV1BuilderMock: jest.Mocked<
    Builder<MessageEvent, [string]>
  >;
  let messageEventFromStringifiedGameMessageEventV2BuilderMock: jest.Mocked<
    Builder<MessageEvent, [string]>
  >;

  beforeAll(() => {
    gameEventsSubscriptionOutputPortMock = {
      publishV1: jest.fn(),
      publishV2: jest.fn(),
      subscribeV1: jest.fn(),
      subscribeV2: jest.fn(),
    };
    messageEventFromStringifiedGameMessageEventV1BuilderMock = {
      build: jest.fn(),
    };
    messageEventFromStringifiedGameMessageEventV2BuilderMock = {
      build: jest.fn(),
    };

    gameEventsManagementInputPort = new GameEventsManagementInputPort(
      gameEventsSubscriptionOutputPortMock,
      messageEventFromStringifiedGameMessageEventV1BuilderMock,
      messageEventFromStringifiedGameMessageEventV2BuilderMock,
    );
  });

  describe('.subscribeV1', () => {
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

        gameEventsSubscriptionOutputPortMock.subscribeV1.mockResolvedValueOnce(
          sseTeardownExecutorFixture,
        );

        result = await gameEventsManagementInputPort.subscribeV1(
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
          gameEventsSubscriptionOutputPortMock.subscribeV1,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameEventsSubscriptionOutputPortMock.subscribeV1,
        ).toHaveBeenCalledWith(gameIdFixture, expectedPublisher);
      });

      it('should resolve SseTeardownExecutor', () => {
        expect(result).toBe(sseTeardownExecutorFixture);
      });
    });
  });

  describe('.subscribeV2', () => {
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

        gameEventsSubscriptionOutputPortMock.subscribeV2.mockResolvedValueOnce(
          sseTeardownExecutorFixture,
        );

        result = await gameEventsManagementInputPort.subscribeV2(
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
          gameEventsSubscriptionOutputPortMock.subscribeV2,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameEventsSubscriptionOutputPortMock.subscribeV2,
        ).toHaveBeenCalledWith(gameIdFixture, expectedPublisher);
      });

      it('should resolve SseTeardownExecutor', () => {
        expect(result).toBe(sseTeardownExecutorFixture);
      });
    });
  });
});
