import { beforeAll, describe, expect, it } from '@jest/globals';

import { GameFindQueryFixtures } from '../fixtures/GameFindQueryFixtures';
import { GameFindQuery } from '../query/GameFindQuery';
import { GamesCanBeFoundByUserSpec } from './GamesCanBeFoundByUserSpec';

describe(GamesCanBeFoundByUserSpec.name, () => {
  let gamesCanBeFoundByUserSpec: GamesCanBeFoundByUserSpec;

  beforeAll(() => {
    gamesCanBeFoundByUserSpec = new GamesCanBeFoundByUserSpec();
  });

  describe.each<[string, GameFindQuery, boolean]>([
    ['with isPublic true', GameFindQueryFixtures.withIsPublicTrue, true],
    ['with isPublic false', GameFindQueryFixtures.withIsPublicFalse, false],
    ['with no isPublic', GameFindQueryFixtures.withNoIsPublic, false],
  ])(
    'having a GameFindQuery %s',
    (
      _: string,
      gameFindQueryFixture: GameFindQuery,
      expectedResult: boolean,
    ) => {
      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result =
            gamesCanBeFoundByUserSpec.isSatisfiedBy(gameFindQueryFixture);
        });

        it('should return expected result', () => {
          expect(result).toBe(expectedResult);
        });
      });
    },
  );
});
