import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder, Publisher } from '@cornie-js/backend-common';
import {
  MessageEvent,
  SsePublisher,
  SseTeardownExecutor,
} from '@cornie-js/backend-http';

import { GameUpdatedMessageEventFixtures } from '../../fixtures/GameUpdatedMessageEventFixtures';
import { GameMessageEvent } from '../../models/GameMessageEvent';
import { GameEventsSubscriptionOutputPort } from '../output/GameEventsSubscriptionOutputPort';
import { GameEventsManagementInputPort } from './GameEventsManagementInputPort';

describe(GameEventsManagementInputPort.name, () => {
  let gameEventsSubscriptionOutputPortMock: jest.Mocked<GameEventsSubscriptionOutputPort>;
  let gameMessageEventFromStringBuilderMock: jest.Mocked<
    Builder<GameMessageEvent, [string]>
  >;

  let gameEventsManagementInputPort: GameEventsManagementInputPort;
  let messageEventFromGameMessageEventV1BuilderMock: jest.Mocked<
    Builder<MessageEvent, [GameMessageEvent]>
  >;
  let messageEventFromGameMessageEventV2BuilderMock: jest.Mocked<
    Builder<MessageEvent, [GameMessageEvent]>
  >;

  beforeAll(() => {
    gameEventsSubscriptionOutputPortMock = {
      publishV1: jest.fn(),
      publishV2: jest.fn(),
      subscribeV1: jest.fn(),
      subscribeV2: jest.fn(),
    };
    gameMessageEventFromStringBuilderMock = {
      build: jest.fn(),
    };
    messageEventFromGameMessageEventV1BuilderMock = {
      build: jest.fn(),
    };
    messageEventFromGameMessageEventV2BuilderMock = {
      build: jest.fn(),
    };

    gameEventsManagementInputPort = new GameEventsManagementInputPort(
      gameEventsSubscriptionOutputPortMock,
      gameMessageEventFromStringBuilderMock,
      messageEventFromGameMessageEventV1BuilderMock,
      messageEventFromGameMessageEventV2BuilderMock,
    );
  });

  describe('.subscribeV1', () => {
    let gameIdFixture: string;
    let ssePublisherMock: jest.Mocked<SsePublisher>;

    beforeAll(() => {
      gameIdFixture = 'game-id-fixture';
      ssePublisherMock = {
        conplete: jest.fn(),
        publish: jest.fn(),
      } as Partial<jest.Mocked<SsePublisher>> as jest.Mocked<SsePublisher>;
    });

    describe('when called, and gameMessageEventFromStringBuilder.build() returns GameMessageEvent with active game', () => {
      let gameMessageEventFixture: GameMessageEvent;
      let sseTeardownExecutorFixture: SseTeardownExecutor;
      let result: unknown;

      beforeAll(async () => {
        gameMessageEventFixture =
          GameUpdatedMessageEventFixtures.withGameActive;
        sseTeardownExecutorFixture = Symbol() as unknown as SseTeardownExecutor;

        gameMessageEventFromStringBuilderMock.build.mockReturnValueOnce(
          gameMessageEventFixture,
        );

        gameEventsSubscriptionOutputPortMock.subscribeV1.mockResolvedValueOnce(
          sseTeardownExecutorFixture,
        );

        result = await gameEventsManagementInputPort.subscribeV1(
          gameIdFixture,
          ssePublisherMock,
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
    let ssePublisherMock: jest.Mocked<SsePublisher>;

    beforeAll(() => {
      gameIdFixture = 'game-id-fixture';
      ssePublisherMock = {
        conplete: jest.fn(),
        publish: jest.fn(),
      } as Partial<jest.Mocked<SsePublisher>> as jest.Mocked<SsePublisher>;
    });

    describe('when called, and gameMessageEventFromStringBuilder.build() returns GameMessageEvent with active game', () => {
      let gameMessageEventFixture: GameMessageEvent;
      let sseTeardownExecutorFixture: SseTeardownExecutor;
      let result: unknown;

      beforeAll(async () => {
        gameMessageEventFixture =
          GameUpdatedMessageEventFixtures.withGameActive;
        sseTeardownExecutorFixture = Symbol() as unknown as SseTeardownExecutor;

        gameMessageEventFromStringBuilderMock.build.mockReturnValueOnce(
          gameMessageEventFixture,
        );

        gameEventsSubscriptionOutputPortMock.subscribeV2.mockResolvedValueOnce(
          sseTeardownExecutorFixture,
        );

        result = await gameEventsManagementInputPort.subscribeV2(
          gameIdFixture,
          ssePublisherMock,
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
