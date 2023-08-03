import { beforeAll, describe, expect, it } from '@jest/globals';

import { Game } from '../entities/Game';
import { ActiveGameFixtures } from '../fixtures/ActiveGameFixtures';
import { NonStartedGameFixtures } from '../fixtures/NonStartedGameFixtures';
import { GameCanHoldOnlyOneMoreGameSlotSpec } from './GameCanHoldOnlyOneMoreGameSlotSpec';

describe(GameCanHoldOnlyOneMoreGameSlotSpec.name, () => {
  let gameCanHoldOnlyOneMoreGameSlotSpec: GameCanHoldOnlyOneMoreGameSlotSpec;

  beforeAll(() => {
    gameCanHoldOnlyOneMoreGameSlotSpec =
      new GameCanHoldOnlyOneMoreGameSlotSpec();
  });

  describe('.isSatisfiedBy', () => {
    describe.each<[string, Game, boolean]>([
      [
        'a NonStartedGame with one free slot',
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
          result = gameCanHoldOnlyOneMoreGameSlotSpec.isSatisfiedBy(game);
        });

        it(`should return ${expectedResult.toString()}`, () => {
          expect(result).toBe(expectedResult);
        });
      });
    });
  });
});
