import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { GameSlotCreateV1Fixtures } from '@cornie-js/backend-app-game-fixtures/games/application';
import { GameSlotCreateQuery } from '@cornie-js/backend-app-game-models/games/domain';

import { GameSlotCreateQueryContextFixtures } from '../fixtures/GameSlotCreateQueryContextFixtures';
import { GameSlotCreateQueryContext } from '../models/GameSlotCreateQueryContext';
import { GameSlotCreateQueryFromGameSlotCreateQueryV1Builder } from './GameSlotCreateQueryFromGameSlotCreateQueryV1Builder';

describe(GameSlotCreateQueryFromGameSlotCreateQueryV1Builder.name, () => {
  let gameSlotCreateQueryFromGameSlotCreateQueryV1Builder: GameSlotCreateQueryFromGameSlotCreateQueryV1Builder;

  beforeAll(() => {
    gameSlotCreateQueryFromGameSlotCreateQueryV1Builder =
      new GameSlotCreateQueryFromGameSlotCreateQueryV1Builder();
  });

  describe('.build', () => {
    let gameSlotCreateQueryV1Fixture: apiModels.GameIdSlotCreateQueryV1;
    let gameSlotCreateQueryContextFixture: GameSlotCreateQueryContext;

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        gameSlotCreateQueryV1Fixture = GameSlotCreateV1Fixtures.any;
        gameSlotCreateQueryContextFixture =
          GameSlotCreateQueryContextFixtures.any;

        result = gameSlotCreateQueryFromGameSlotCreateQueryV1Builder.build(
          gameSlotCreateQueryV1Fixture,
          gameSlotCreateQueryContextFixture,
        );
      });

      it('should return a GameSlotCreateQuery', () => {
        const expected: GameSlotCreateQuery = {
          gameId: gameSlotCreateQueryContextFixture.game.id,
          id: gameSlotCreateQueryContextFixture.uuid,
          position: gameSlotCreateQueryContextFixture.game.state.slots.length,
          userId: gameSlotCreateQueryV1Fixture.userId,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
