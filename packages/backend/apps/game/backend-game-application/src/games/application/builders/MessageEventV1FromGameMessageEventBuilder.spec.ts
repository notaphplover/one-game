import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { MessageEvent } from '@cornie-js/backend-http';

import { GameMessageEventV1Fixtures } from '../fixtures/GameMessageEventV1Fixtures';
import { GameUpdatedMessageEventFixtures } from '../fixtures/GameUpdatedMessageEventFixtures';
import { GameMessageEvent } from '../models/GameMessageEvent';
import { MessageEventV1FromGameMessageEventBuilder } from './MessageEventV1FromGameMessageEventBuilder';

describe(MessageEventV1FromGameMessageEventBuilder.name, () => {
  let gameMessageEventV1FromGameMessageEventBuilderMock: jest.Mocked<
    Builder<[string | null, apiModels.GameMessageEventV1], [GameMessageEvent]>
  >;

  let messageEventFromStringifiedGameMessageEventBuilder: MessageEventV1FromGameMessageEventBuilder;

  beforeAll(() => {
    gameMessageEventV1FromGameMessageEventBuilderMock = {
      build: jest.fn(),
    };

    messageEventFromStringifiedGameMessageEventBuilder =
      new MessageEventV1FromGameMessageEventBuilder(
        gameMessageEventV1FromGameMessageEventBuilderMock,
      );
  });

  describe('.build', () => {
    let gameMessageEventFixture: GameMessageEvent;

    beforeAll(() => {
      gameMessageEventFixture = GameUpdatedMessageEventFixtures.any;
    });

    describe('when called, and gameMessageEventV1FromGameMessageEventBuilder.build() returns null id', () => {
      let gameMessageEventV1Fixture: apiModels.GameMessageEventV1;

      let result: unknown;

      beforeAll(() => {
        gameMessageEventV1Fixture = GameMessageEventV1Fixtures.any;
        gameMessageEventV1FromGameMessageEventBuilderMock.build.mockReturnValueOnce(
          [null, gameMessageEventV1Fixture],
        );

        result = messageEventFromStringifiedGameMessageEventBuilder.build(
          gameMessageEventFixture,
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

    describe('when called, and gameMessageEventV1FromGameMessageEventBuilder.build() returns string id', () => {
      let gameMessageEventV1Fixture: apiModels.GameMessageEventV1;
      let idFixture: string;

      let result: unknown;

      beforeAll(() => {
        gameMessageEventV1Fixture = GameMessageEventV1Fixtures.any;
        idFixture = 'id-fixture';

        gameMessageEventV1FromGameMessageEventBuilderMock.build.mockReturnValueOnce(
          [idFixture, gameMessageEventV1Fixture],
        );

        result = messageEventFromStringifiedGameMessageEventBuilder.build(
          gameMessageEventFixture,
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
          id: idFixture,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
