import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { MessageEvent } from '@cornie-js/backend-http';

import { GameMessageEventV1Fixtures } from '../fixtures/GameMessageEventV1Fixtures';
import { GameUpdatedMessageEventFixtures } from '../fixtures/GameUpdatedMessageEventFixtures';
import { GameMessageEvent } from '../models/GameMessageEvent';
import { MessageEventFromStringifiedGameMessageEventV1Builder } from './MessageEventFromStringifiedGameMessageEventV1Builder';

describe(MessageEventFromStringifiedGameMessageEventV1Builder.name, () => {
  let gameMessageEventV1FromGameMessageEventBuilderMock: jest.Mocked<
    Builder<apiModels.GameMessageEventV1, [GameMessageEvent]>
  >;

  let messageEventFromStringifiedGameMessageEventBuilder: MessageEventFromStringifiedGameMessageEventV1Builder;

  beforeAll(() => {
    gameMessageEventV1FromGameMessageEventBuilderMock = {
      build: jest.fn(),
    };

    messageEventFromStringifiedGameMessageEventBuilder =
      new MessageEventFromStringifiedGameMessageEventV1Builder(
        gameMessageEventV1FromGameMessageEventBuilderMock,
      );
  });

  describe('.build', () => {
    let gameMessageEventFixture: GameMessageEvent;
    let stringifiedGameMessageEventFixture: string;

    beforeAll(() => {
      gameMessageEventFixture = GameUpdatedMessageEventFixtures.any;
      stringifiedGameMessageEventFixture = JSON.stringify(
        gameMessageEventFixture,
      );
    });

    describe('when called', () => {
      let gameMessageEventV1Fixture: apiModels.GameMessageEventV1;

      let result: unknown;

      beforeAll(() => {
        gameMessageEventV1Fixture = GameMessageEventV1Fixtures.any;
        gameMessageEventV1FromGameMessageEventBuilderMock.build.mockReturnValueOnce(
          gameMessageEventV1Fixture,
        );

        result = messageEventFromStringifiedGameMessageEventBuilder.build(
          stringifiedGameMessageEventFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameMessageEventV1FromGameMessageEventBuilder.build()', () => {
        expect(
          gameMessageEventV1FromGameMessageEventBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameMessageEventV1FromGameMessageEventBuilderMock.build,
        ).toHaveBeenCalledWith(gameMessageEventFixture);
      });

      it('should return a MessageEvent', () => {
        const expected: MessageEvent = {
          data: JSON.stringify(gameMessageEventV1Fixture),
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
