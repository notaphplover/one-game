import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { GameAction } from '@cornie-js/backend-game-domain/gameActions';

import { GameEventV2Fixtures } from '../fixtures/GameEventV2Fixtures';
import { GameUpdatedMessageEventFixtures } from '../fixtures/GameUpdatedMessageEventFixtures';
import { GameMessageEvent } from '../models/GameMessageEvent';
import { GameEventV2FromGameMessageEventBuilder } from './GameEventV2FromGameMessageEventBuilder';

describe(GameEventV2FromGameMessageEventBuilder.name, () => {
  let gameEventV2FromGameActionBuilderMock: jest.Mocked<
    Builder<[string | null, apiModels.GameEventV2], [GameAction]>
  >;

  let gameEventV2FromGameMessageEventBuilder: GameEventV2FromGameMessageEventBuilder;

  beforeAll(() => {
    gameEventV2FromGameActionBuilderMock = {
      build: jest.fn(),
    };

    gameEventV2FromGameMessageEventBuilder =
      new GameEventV2FromGameMessageEventBuilder(
        gameEventV2FromGameActionBuilderMock,
      );
  });

  describe('.build', () => {
    describe('having a GameUpdatedMessageEvent', () => {
      let gameMessageEventFixture: GameMessageEvent;

      beforeAll(() => {
        gameMessageEventFixture = GameUpdatedMessageEventFixtures.any;
      });

      describe('when called', () => {
        let eventIdFixture: string | null;
        let gameEventV2Fixture: apiModels.GameEventV2;

        let result: unknown;

        beforeAll(() => {
          eventIdFixture = 'event-id';
          gameEventV2Fixture = GameEventV2Fixtures.any;

          gameEventV2FromGameActionBuilderMock.build.mockReturnValueOnce([
            eventIdFixture,
            gameEventV2Fixture,
          ]);

          result = gameEventV2FromGameMessageEventBuilder.build(
            gameMessageEventFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call gameEventV2FromGameActionBuilder.build()', () => {
          expect(
            gameEventV2FromGameActionBuilderMock.build,
          ).toHaveBeenCalledTimes(1);
          expect(
            gameEventV2FromGameActionBuilderMock.build,
          ).toHaveBeenCalledWith(gameMessageEventFixture.gameAction);
        });

        it('should return GameEventV2', () => {
          const expected: [string | null, apiModels.GameEventV2] = [
            eventIdFixture,
            gameEventV2Fixture,
          ];

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
