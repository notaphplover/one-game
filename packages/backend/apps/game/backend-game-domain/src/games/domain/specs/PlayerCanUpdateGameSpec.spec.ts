import { beforeAll, describe, expect, it } from '@jest/globals';

import { ActiveGameFixtures } from '../fixtures';
import { ActiveGame } from '../models/ActiveGame';
import { ActiveGameSlot } from '../models/ActiveGameSlot';
import { PlayerCanUpdateGameSpec } from './PlayerCanUpdateGameSpec';

describe(PlayerCanUpdateGameSpec.name, () => {
  let playerCanUpdateGameSpec: PlayerCanUpdateGameSpec;

  beforeAll(() => {
    playerCanUpdateGameSpec = new PlayerCanUpdateGameSpec();
  });

  describe('.isSatisfiedBy', () => {
    describe.each<[string, ActiveGame, string, number, boolean]>([
      [
        'a game, a user id and an unexisting game slot index',
        ActiveGameFixtures.withSlotsOne,
        'user-id',
        -1,
        false,
      ],
      [
        'a game, an invalid user id and an existing game slot index',
        ActiveGameFixtures.withSlotsOne,
        Symbol() as unknown as string,
        0,
        false,
      ],
      [
        'a game, an invalid user id and an existing non playing game slot index',
        ActiveGameFixtures.withSlotsTwoAndCurrentPlayingSlotZero,
        (
          ActiveGameFixtures.withSlotsTwoAndCurrentPlayingSlotZero.state
            .slots[0] as ActiveGameSlot
        ).userId,
        1,
        false,
      ],
      [
        'a game, a valid user id and an existing playing game slot index',
        ActiveGameFixtures.withSlotsOne,
        (ActiveGameFixtures.withSlotsOne.state.slots[0] as ActiveGameSlot)
          .userId,
        0,
        true,
      ],
    ])(
      'having %s',
      (
        _: string,
        gameFixture: ActiveGame,
        userIdFixture: string,
        gameSlotIndexFixture: number,
        expectedResult: boolean,
      ) => {
        describe('when called', () => {
          let result: unknown;

          beforeAll(() => {
            result = playerCanUpdateGameSpec.isSatisfiedBy(
              gameFixture,
              userIdFixture,
              gameSlotIndexFixture,
            );
          });

          it(`should return ${expectedResult.toString()}`, () => {
            expect(result).toBe(expectedResult);
          });
        });
      },
    );
  });
});
