import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { Game } from '@cornie-js/backend-game-domain/games';

import { NonStartedGameV1Fixtures } from '../fixtures';
import { GameUpdatedMessageEventFixtures } from '../fixtures/GameUpdatedMessageEventFixtures';
import { GameMessageEvent } from '../models/GameMessageEvent';
import { GameMessageEventV1FromGameMessageEventBuilder } from './GameMessageEventV1FromGameMessageEventBuilder';

describe(GameMessageEventV1FromGameMessageEventBuilder, () => {
  let gameV1FromGameBuilderMock: jest.Mocked<Builder<apiModels.GameV1, [Game]>>;

  let gameMessageEventV1FromGameMessageEventBuilder: GameMessageEventV1FromGameMessageEventBuilder;

  beforeAll(() => {
    gameV1FromGameBuilderMock = {
      build: jest.fn(),
    };

    gameMessageEventV1FromGameMessageEventBuilder =
      new GameMessageEventV1FromGameMessageEventBuilder(
        gameV1FromGameBuilderMock,
      );
  });

  describe('when called', () => {
    let gameV1Fixture: apiModels.GameV1;
    let gameMessageEventFixture: GameMessageEvent;

    let result: unknown;

    beforeAll(() => {
      gameV1Fixture = NonStartedGameV1Fixtures.any;
      gameMessageEventFixture = GameUpdatedMessageEventFixtures.any;

      gameV1FromGameBuilderMock.build.mockReturnValueOnce(gameV1Fixture);

      result = gameMessageEventV1FromGameMessageEventBuilder.build(
        gameMessageEventFixture,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call gameV1FromGameBuilder.build()', () => {
      expect(gameV1FromGameBuilderMock.build).toHaveBeenCalledTimes(1);
      expect(gameV1FromGameBuilderMock.build).toHaveBeenCalledWith(
        gameMessageEventFixture.game,
      );
    });

    it('should retuen a GameMessageEventV1', () => {
      const expected: apiModels.GameMessageEventV1 = {
        game: gameV1Fixture,
        kind: 'game-updated',
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
