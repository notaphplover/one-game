import { beforeAll, describe, expect, it } from '@jest/globals';

import { GameOptions } from '@cornie-js/backend-game-domain/games';

import { GameOptionsDbFixtures } from '../fixtures/GameOptionsDbFixtures';
import { GameOptionsDb } from '../models/GameOptionsDb';
import { GameOptionsDbToGameOptionsTypeOrmConverter } from './GameOptionsDbToGameOptionsTypeOrmConverter';

describe(GameOptionsDbToGameOptionsTypeOrmConverter.name, () => {
  let gameOptionsDbToGameOptionsConverter: GameOptionsDbToGameOptionsTypeOrmConverter;

  beforeAll(() => {
    gameOptionsDbToGameOptionsConverter =
      new GameOptionsDbToGameOptionsTypeOrmConverter();
  });

  describe('.convert', () => {
    let gameOptionsDbFixture: GameOptionsDb;

    beforeAll(() => {
      gameOptionsDbFixture = GameOptionsDbFixtures.any;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result =
          gameOptionsDbToGameOptionsConverter.convert(gameOptionsDbFixture);
      });

      it('should return GameOptions', () => {
        const expected: GameOptions = {
          chainDraw2Draw2Cards: gameOptionsDbFixture.chainDraw2Draw2Cards,
          chainDraw2Draw4Cards: gameOptionsDbFixture.chainDraw2Draw4Cards,
          chainDraw4Draw2Cards: gameOptionsDbFixture.chainDraw4Draw2Cards,
          chainDraw4Draw4Cards: gameOptionsDbFixture.chainDraw4Draw4Cards,
          gameId: gameOptionsDbFixture.gameId,
          id: gameOptionsDbFixture.id,
          playCardIsMandatory: gameOptionsDbFixture.playCardIsMandatory,
          playMultipleSameCards: gameOptionsDbFixture.playMultipleSameCards,
          playWildDraw4IfNoOtherAlternative:
            gameOptionsDbFixture.playWildDraw4IfNoOtherAlternative,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
