import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { AppError, Builder, Publisher } from '@cornie-js/backend-common';
import {
  Game,
  GameEventsCanBeObservedSpec,
} from '@cornie-js/backend-game-domain/games';
import { ActiveGameFixtures } from '@cornie-js/backend-game-domain/games/fixtures';
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
  let gameEventsCanBeObservedSpecMock: jest.Mocked<GameEventsCanBeObservedSpec>;
  let gameEventsSubscriptionOutputPortMock: jest.Mocked<GameEventsSubscriptionOutputPort>;
  let gameMessageEventFromStringBuilderMock: jest.Mocked<
    Builder<GameMessageEvent, [string]>
  >;

  let gameEventsManagementInputPort: GameEventsManagementInputPort;
  let messageEventFromGameMessageEventV2BuilderMock: jest.Mocked<
    Builder<MessageEvent, [GameMessageEvent]>
  >;

  beforeAll(() => {
    gameEventsCanBeObservedSpecMock = {
      isSatisfiedBy: jest.fn(),
    } as Partial<
      jest.Mocked<GameEventsCanBeObservedSpec>
    > as jest.Mocked<GameEventsCanBeObservedSpec>;
    gameEventsSubscriptionOutputPortMock = {
      publishV2: jest.fn(),
      subscribeV2: jest.fn(),
    };
    gameMessageEventFromStringBuilderMock = {
      build: jest.fn(),
    };
    messageEventFromGameMessageEventV2BuilderMock = {
      build: jest.fn(),
    };

    gameEventsManagementInputPort = new GameEventsManagementInputPort(
      gameEventsCanBeObservedSpecMock,
      gameEventsSubscriptionOutputPortMock,
      gameMessageEventFromStringBuilderMock,
      messageEventFromGameMessageEventV2BuilderMock,
    );
  });

  describe('.subscribeV2', () => {
    let gameFixture: Game;
    let ssePublisherMock: jest.Mocked<SsePublisher>;

    beforeAll(() => {
      gameFixture = ActiveGameFixtures.any;
      ssePublisherMock = {
        conplete: jest.fn(),
        publish: jest.fn(),
      } as Partial<jest.Mocked<SsePublisher>> as jest.Mocked<SsePublisher>;
    });

    describe('when called, and gameEventsCanBeObservedSpec.isSatisfiedBy() returns false', () => {
      let result: unknown;

      beforeAll(async () => {
        gameEventsCanBeObservedSpecMock.isSatisfiedBy.mockReturnValueOnce(
          false,
        );

        try {
          await gameEventsManagementInputPort.subscribeV2(
            gameFixture,
            ssePublisherMock,
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameEventsCanBeObservedSpec.isSatisfiedBy()', () => {
        expect(
          gameEventsCanBeObservedSpecMock.isSatisfiedBy,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameEventsCanBeObservedSpecMock.isSatisfiedBy,
        ).toHaveBeenCalledWith(gameFixture);
      });

      it('should throw an AppError', () => {
        expect(result).toBeInstanceOf(AppError);
      });
    });

    describe('when called, and gameEventsCanBeObservedSpec.isSatisfiedBy() returns true and gameMessageEventFromStringBuilder.build() returns GameMessageEvent with active game', () => {
      let gameMessageEventFixture: GameMessageEvent;
      let sseTeardownExecutorFixture: SseTeardownExecutor;
      let result: unknown;

      beforeAll(async () => {
        gameMessageEventFixture =
          GameUpdatedMessageEventFixtures.withGameActive;
        sseTeardownExecutorFixture = Symbol() as unknown as SseTeardownExecutor;

        gameEventsCanBeObservedSpecMock.isSatisfiedBy.mockReturnValueOnce(true);
        gameMessageEventFromStringBuilderMock.build.mockReturnValueOnce(
          gameMessageEventFixture,
        );

        gameEventsSubscriptionOutputPortMock.subscribeV2.mockResolvedValueOnce(
          sseTeardownExecutorFixture,
        );

        result = await gameEventsManagementInputPort.subscribeV2(
          gameFixture,
          ssePublisherMock,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameEventsCanBeObservedSpec.isSatisfiedBy()', () => {
        expect(
          gameEventsCanBeObservedSpecMock.isSatisfiedBy,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameEventsCanBeObservedSpecMock.isSatisfiedBy,
        ).toHaveBeenCalledWith(gameFixture);
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
        ).toHaveBeenCalledWith(gameFixture.id, expectedPublisher);
      });

      it('should resolve SseTeardownExecutor', () => {
        expect(result).toBe(sseTeardownExecutorFixture);
      });
    });
  });
});
