import { beforeAll, describe, expect, it } from '@jest/globals';

import { Game } from '../entities/Game';
import { ActiveGameFixtures } from '../fixtures/ActiveGameFixtures';
import { GameSpecFixtures } from '../fixtures/GameSpecFixtures';
import { NonStartedGameFixtures } from '../fixtures/NonStartedGameFixtures';
import { GameSpec } from '../valueObjects/GameSpec';
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
        NonStartedGameFixtures.withGameSlotsSlotsZero,
        true,
      ],
      [
        'a NonStartedGame with no free slots',
        NonStartedGameFixtures.withGameSlotsOne,
        false,
      ],
      ['an ActiveGame', ActiveGameFixtures.any, false],
    ])('having %s', (_: string, game: Game, expectedResult: boolean) => {
      let gameSpecFixture: GameSpec;

      beforeAll(() => {
        gameSpecFixture = GameSpecFixtures.withGameSlotsAmountOne;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameCanHoldMoreGameSlotsSpec.isSatisfiedBy(
            game,
            gameSpecFixture,
          );
        });

        it(`should return ${expectedResult.toString()}`, () => {
          expect(result).toBe(expectedResult);
        });
      });
    });
  });
});
