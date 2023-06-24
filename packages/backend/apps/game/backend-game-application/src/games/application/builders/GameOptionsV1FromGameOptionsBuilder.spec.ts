import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { GameOptions } from '@cornie-js/backend-game-domain/games';
import { GameOptionsFixtures } from '@cornie-js/backend-game-domain/games/fixtures';

import { GameOptionsV1FromGameOptionsBuilder } from './GameOptionsV1FromGameOptionsBuilder';

describe(GameOptionsV1FromGameOptionsBuilder.name, () => {
  let gameOptionsV1FromGameOptionsBuilder: GameOptionsV1FromGameOptionsBuilder;

  beforeAll(() => {
    gameOptionsV1FromGameOptionsBuilder =
      new GameOptionsV1FromGameOptionsBuilder();
  });

  describe('.build()', () => {
    let gameOptionsFixture: GameOptions;

    beforeAll(() => {
      gameOptionsFixture = GameOptionsFixtures.any;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = gameOptionsV1FromGameOptionsBuilder.build(gameOptionsFixture);
      });

      it('should return a GameOptionsCreateQuery', () => {
        const expected: apiModels.GameOptionsV1 = {
          chainDraw2Draw2Cards: gameOptionsFixture.chainDraw2Draw2Cards,
          chainDraw2Draw4Cards: gameOptionsFixture.chainDraw2Draw4Cards,
          chainDraw4Draw2Cards: gameOptionsFixture.chainDraw4Draw2Cards,
          chainDraw4Draw4Cards: gameOptionsFixture.chainDraw4Draw4Cards,
          playCardIsMandatory: gameOptionsFixture.playCardIsMandatory,
          playMultipleSameCards: gameOptionsFixture.playMultipleSameCards,
          playWildDraw4IfNoOtherAlternative:
            gameOptionsFixture.playWildDraw4IfNoOtherAlternative,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
