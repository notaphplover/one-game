import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { GameOptionsCreateQuery } from '@cornie-js/backend-game-domain/games';

import { GameOptionsCreateQueryContextFixtures } from '../fixtures/GameOptionsCreateQueryContextFixtures';
import { GameOptionsV1Fixtures } from '../fixtures/GameOptionsV1Fixtures';
import { GameOptionsCreateQueryContext } from '../models/GameOptionsCreateQueryContext';
import { GameOptionsCreateQueryFromGameOptionsV1Builder } from './GameOptionsCreateQueryFromGameOptionsV1Builder';

describe(GameOptionsCreateQueryFromGameOptionsV1Builder.name, () => {
  let gameOptionsCreateQueryFromGameOptionsV1Builder: GameOptionsCreateQueryFromGameOptionsV1Builder;

  beforeAll(() => {
    gameOptionsCreateQueryFromGameOptionsV1Builder =
      new GameOptionsCreateQueryFromGameOptionsV1Builder();
  });

  describe('.build()', () => {
    let gameOptionsV1Fixture: apiModels.GameOptionsV1;
    let gameOptionsCreateQueryContextFixture: GameOptionsCreateQueryContext;

    beforeAll(() => {
      gameOptionsV1Fixture = GameOptionsV1Fixtures.any;
      gameOptionsCreateQueryContextFixture =
        GameOptionsCreateQueryContextFixtures.any;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = gameOptionsCreateQueryFromGameOptionsV1Builder.build(
          gameOptionsV1Fixture,
          gameOptionsCreateQueryContextFixture,
        );
      });

      it('should return a GameOptionsCreateQuery', () => {
        const expected: GameOptionsCreateQuery = {
          chainDraw2Draw2Cards: gameOptionsV1Fixture.chainDraw2Draw2Cards,
          chainDraw2Draw4Cards: gameOptionsV1Fixture.chainDraw2Draw4Cards,
          chainDraw4Draw2Cards: gameOptionsV1Fixture.chainDraw4Draw2Cards,
          chainDraw4Draw4Cards: gameOptionsV1Fixture.chainDraw4Draw4Cards,
          gameId: gameOptionsCreateQueryContextFixture.gameId,
          id: gameOptionsCreateQueryContextFixture.uuid,
          playCardIsMandatory: gameOptionsV1Fixture.playCardIsMandatory,
          playMultipleSameCards: gameOptionsV1Fixture.playMultipleSameCards,
          playWildDraw4IfNoOtherAlternative:
            gameOptionsV1Fixture.playWildDraw4IfNoOtherAlternative,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
