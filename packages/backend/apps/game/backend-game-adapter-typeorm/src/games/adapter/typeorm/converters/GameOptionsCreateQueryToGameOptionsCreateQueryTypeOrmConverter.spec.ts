import { beforeAll, describe, expect, it } from '@jest/globals';

import { GameOptionsCreateQuery } from '@cornie-js/backend-game-domain/games';
import { GameOptionsCreateQueryFixtures } from '@cornie-js/backend-game-domain/games/fixtures';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { GameOptionsDb } from '../models/GameOptionsDb';
import { GameOptionsCreateQueryToGameOptionsCreateQueryTypeOrmConverter } from './GameOptionsCreateQueryToGameOptionsCreateQueryTypeOrmConverter';

describe(
  GameOptionsCreateQueryToGameOptionsCreateQueryTypeOrmConverter.name,
  () => {
    let gameOptionsCreateQueryToGameOptionsTypeOrmConverter: GameOptionsCreateQueryToGameOptionsCreateQueryTypeOrmConverter;

    beforeAll(() => {
      gameOptionsCreateQueryToGameOptionsTypeOrmConverter =
        new GameOptionsCreateQueryToGameOptionsCreateQueryTypeOrmConverter();
    });

    describe('.convert', () => {
      let gameOptionsCreateQueryFixture: GameOptionsCreateQuery;

      beforeAll(() => {
        gameOptionsCreateQueryFixture = GameOptionsCreateQueryFixtures.any;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameOptionsCreateQueryToGameOptionsTypeOrmConverter.convert(
            gameOptionsCreateQueryFixture,
          );
        });

        it('should return a GameOptionsCreateQueryTypeOrm', () => {
          const expected: QueryDeepPartialEntity<GameOptionsDb> = {
            chainDraw2Draw2Cards:
              gameOptionsCreateQueryFixture.chainDraw2Draw2Cards,
            chainDraw2Draw4Cards:
              gameOptionsCreateQueryFixture.chainDraw2Draw4Cards,
            chainDraw4Draw2Cards:
              gameOptionsCreateQueryFixture.chainDraw4Draw2Cards,
            chainDraw4Draw4Cards:
              gameOptionsCreateQueryFixture.chainDraw4Draw4Cards,
            game: { id: gameOptionsCreateQueryFixture.gameId },
            id: gameOptionsCreateQueryFixture.id,
            playCardIsMandatory:
              gameOptionsCreateQueryFixture.playCardIsMandatory,
            playMultipleSameCards:
              gameOptionsCreateQueryFixture.playMultipleSameCards,
            playWildDraw4IfNoOtherAlternative:
              gameOptionsCreateQueryFixture.playWildDraw4IfNoOtherAlternative,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  },
);
