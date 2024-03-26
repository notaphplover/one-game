import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { MessageEvent } from '@cornie-js/backend-http';

import { GameEventV2Fixtures } from '../fixtures/GameEventV2Fixtures';
import { GameUpdatedMessageEventFixtures } from '../fixtures/GameUpdatedMessageEventFixtures';
import { GameMessageEvent } from '../models/GameMessageEvent';
import { MessageEventV2FromGameMessageEventBuilder } from './MessageEventV2FromGameMessageEventBuilder';

describe(MessageEventV2FromGameMessageEventBuilder.name, () => {
  let gameEventV2FromGameMessageEventBuilderMock: jest.Mocked<
    Builder<[string | null, apiModels.GameEventV2], [GameMessageEvent]>
  >;

  let messageEventFromStringifiedGameMessageEventV2Builder: MessageEventV2FromGameMessageEventBuilder;

  beforeAll(() => {
    gameEventV2FromGameMessageEventBuilderMock = {
      build: jest.fn(),
    };

    messageEventFromStringifiedGameMessageEventV2Builder =
      new MessageEventV2FromGameMessageEventBuilder(
        gameEventV2FromGameMessageEventBuilderMock,
      );
  });

  describe('.build', () => {
    let gameMessageEventFixture: GameMessageEvent;

    beforeAll(() => {
      gameMessageEventFixture = GameUpdatedMessageEventFixtures.any;
    });

    describe('when called, and gameEventV2FromGameMessageEventBuilder.build() returns null id', () => {
      let gameEventV2Fixture: apiModels.GameEventV2;

      let result: unknown;

      beforeAll(() => {
        gameEventV2Fixture = GameEventV2Fixtures.any;
        gameEventV2FromGameMessageEventBuilderMock.build.mockReturnValueOnce([
          null,
          gameEventV2Fixture,
        ]);

        result = messageEventFromStringifiedGameMessageEventV2Builder.build(
          gameMessageEventFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameEventV2FromGameMessageEventBuilder.build()', () => {
        expect(
          gameEventV2FromGameMessageEventBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameEventV2FromGameMessageEventBuilderMock.build,
        ).toHaveBeenCalledWith(gameMessageEventFixture);
      });

      it('should return a MessageEvent', () => {
        const expected: MessageEvent = {
          data: JSON.stringify(gameEventV2Fixture),
        };

        expect(result).toStrictEqual(expected);
      });
    });

    describe('when called, and gameEventV2FromGameMessageEventBuilder.build() returns string id', () => {
      let gameEventV2Fixture: apiModels.GameEventV2;
      let idFixture: string;

      let result: unknown;

      beforeAll(() => {
        gameEventV2Fixture = GameEventV2Fixtures.any;
        idFixture = 'id-fixture';

        gameEventV2FromGameMessageEventBuilderMock.build.mockReturnValueOnce([
          idFixture,
          gameEventV2Fixture,
        ]);

        result = messageEventFromStringifiedGameMessageEventV2Builder.build(
          gameMessageEventFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameEventV2FromGameMessageEventBuilder.build()', () => {
        expect(
          gameEventV2FromGameMessageEventBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameEventV2FromGameMessageEventBuilderMock.build,
        ).toHaveBeenCalledWith(gameMessageEventFixture);
      });

      it('should return a MessageEvent', () => {
        const expected: MessageEvent = {
          data: JSON.stringify(gameEventV2Fixture),
          id: idFixture,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
