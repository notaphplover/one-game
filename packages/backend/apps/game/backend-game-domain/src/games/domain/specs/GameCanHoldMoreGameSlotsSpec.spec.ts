import { beforeAll, describe, expect, it } from '@jest/globals';

import { Game } from '../entities/Game';
import { ActiveGameFixtures } from '../fixtures/ActiveGameFixtures';
import { NonStartedGameFixtures } from '../fixtures/NonStartedGameFixtures';
import { GameCanHoldMoreGameSlotsSpec } from './GameCanHoldMoreGameSlotsSpec';

describe(GameCanHoldMoreGameSlotsSpec.name, () => {
  let gameCanHoldMoreGameSlotsSpec: GameCanHoldMoreGameSlotsSpec;

  beforeAll(() => {
    gameCanHoldMoreGameSlotsSpec = new GameCanHoldMoreGameSlotsSpec();
  });

  describe('.isSatisfiedBy', () => {
    describe.each<[string, Game, boolean]>([
      [
        'a NonStartedGame with free slots',
        NonStartedGameFixtures.withGameSlotsAmountOneAndSlotsZero,
        true,
      ],
      [
        'a NonStartedGame with no free slots',
        NonStartedGameFixtures.withGameSlotsAmountOneAndSlotsOne,
        false,
      ],
      ['an ActiveGame', ActiveGameFixtures.any, false],
    ])('having %s', (_: string, game: Game, expectedResult: boolean) => {
      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameCanHoldMoreGameSlotsSpec.isSatisfiedBy(game);
        });

        it(`should return ${expectedResult.toString()}`, () => {
          expect(result).toBe(expectedResult);
        });
      });
    });
  });
});
