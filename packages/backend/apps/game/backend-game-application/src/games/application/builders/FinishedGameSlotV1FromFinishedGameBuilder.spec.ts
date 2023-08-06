import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { FinishedGameSlot } from '@cornie-js/backend-game-domain/games';
import { FinishedGameSlotFixtures } from '@cornie-js/backend-game-domain/games/fixtures';

import { FinishedGameSlotV1FromFinishedGameSlotBuilder } from './FinishedGameSlotV1FromFinishedGameSlotBuilder';

describe(FinishedGameSlotV1FromFinishedGameSlotBuilder.name, () => {
  let finishedGameSlotV1FromFinishedGameSlotBuilder: FinishedGameSlotV1FromFinishedGameSlotBuilder;

  beforeAll(() => {
    finishedGameSlotV1FromFinishedGameSlotBuilder =
      new FinishedGameSlotV1FromFinishedGameSlotBuilder();
  });

  describe('having a FinishedGameSlot', () => {
    let finishedGameSlotFixture: FinishedGameSlot;

    beforeAll(() => {
      finishedGameSlotFixture = FinishedGameSlotFixtures.any;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = finishedGameSlotV1FromFinishedGameSlotBuilder.build(
          finishedGameSlotFixture,
        );
      });

      it('should return a FinishedGameSlotV1', () => {
        const expected: apiModels.FinishedGameSlotV1 = {
          cardsAmount: finishedGameSlotFixture.cards.length,
          userId: finishedGameSlotFixture.userId,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
