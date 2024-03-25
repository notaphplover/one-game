import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { GameAction } from '@cornie-js/backend-game-domain/gameActions';
import { GameActionFixtures } from '@cornie-js/backend-game-domain/gameActions/fixtures';
import { MessageEvent } from '@cornie-js/backend-http';

import { GameEventV2Fixtures } from '../../../games/application/fixtures/GameEventV2Fixtures';
import { MessageEventFromGameActionBuilder } from './MessageEventFromGameActionBuilder';

describe(MessageEventFromGameActionBuilder.name, () => {
  let gameEventV2FromGameActionBuilderMock: jest.Mocked<
    Builder<[string | null, apiModels.GameEventV2], [GameAction]>
  >;

  let messageEventFromGameActionBuilder: MessageEventFromGameActionBuilder;

  beforeAll(() => {
    gameEventV2FromGameActionBuilderMock = {
      build: jest.fn(),
    };

    messageEventFromGameActionBuilder = new MessageEventFromGameActionBuilder(
      gameEventV2FromGameActionBuilderMock,
    );
  });

  describe('.build', () => {
    let gameActionFixture: GameAction;

    beforeAll(() => {
      gameActionFixture = GameActionFixtures.any;
    });

    describe('when called, and gameEventV2FromGameActionBuilder.build() returns string id', () => {
      let idFixture: string;
      let gameEventV2Fixture: apiModels.GameEventV2;

      let result: unknown;

      beforeAll(async () => {
        idFixture = 'id-fixture';
        gameEventV2Fixture = GameEventV2Fixtures.any;

        gameEventV2FromGameActionBuilderMock.build.mockReturnValueOnce([
          idFixture,
          gameEventV2Fixture,
        ]);

        result = messageEventFromGameActionBuilder.build(gameActionFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameEventV2FromGameActionBuilder.build()', () => {
        expect(
          gameEventV2FromGameActionBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(gameEventV2FromGameActionBuilderMock.build).toHaveBeenCalledWith(
          gameActionFixture,
        );
      });

      it('should return MessageEvent', () => {
        const expected: MessageEvent = {
          data: JSON.stringify(gameEventV2Fixture),
          id: idFixture,
        };

        expect(result).toStrictEqual(expected);
      });
    });

    describe('when called, and gameEventV2FromGameActionBuilder.build() returns null id', () => {
      let gameEventV2Fixture: apiModels.GameEventV2;

      let result: unknown;

      beforeAll(async () => {
        gameEventV2Fixture = GameEventV2Fixtures.any;

        gameEventV2FromGameActionBuilderMock.build.mockReturnValueOnce([
          null,
          gameEventV2Fixture,
        ]);

        result = messageEventFromGameActionBuilder.build(gameActionFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameEventV2FromGameActionBuilder.build()', () => {
        expect(
          gameEventV2FromGameActionBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(gameEventV2FromGameActionBuilderMock.build).toHaveBeenCalledWith(
          gameActionFixture,
        );
      });

      it('should return MessageEvent', () => {
        const expected: MessageEvent = {
          data: JSON.stringify(gameEventV2Fixture),
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
