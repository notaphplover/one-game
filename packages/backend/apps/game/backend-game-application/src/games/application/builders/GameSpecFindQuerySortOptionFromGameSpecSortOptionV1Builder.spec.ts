import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { GameSpecFindQuerySortOption } from '@cornie-js/backend-game-domain/games';

import { GameSpecFindQuerySortOptionFromGameSpecSortOptionV1Builder } from './GameSpecFindQuerySortOptionFromGameSpecSortOptionV1Builder';

describe(
  GameSpecFindQuerySortOptionFromGameSpecSortOptionV1Builder.name,
  () => {
    let gameSpecFindQuerySortOptionFromGameSpecSortOptionV1Builder: GameSpecFindQuerySortOptionFromGameSpecSortOptionV1Builder;

    beforeAll(() => {
      gameSpecFindQuerySortOptionFromGameSpecSortOptionV1Builder =
        new GameSpecFindQuerySortOptionFromGameSpecSortOptionV1Builder();
    });

    describe.each<
      [apiModels.GameSpecSortOptionV1, GameSpecFindQuerySortOption]
    >([['gameIds', GameSpecFindQuerySortOption.gameIds]])(
      'having a GameSpecSortOptionV1 "%s"',
      (
        gameSpecSortOptionV1Fixture: apiModels.GameSpecSortOptionV1,
        expected: GameSpecFindQuerySortOption,
      ) => {
        describe('when called', () => {
          let result: unknown;

          beforeAll(() => {
            result =
              gameSpecFindQuerySortOptionFromGameSpecSortOptionV1Builder.build(
                gameSpecSortOptionV1Fixture,
              );
          });

          it('should return GameSpecFindQuerySortOption', () => {
            expect(result).toBe(expected);
          });
        });
      },
    );
  },
);
