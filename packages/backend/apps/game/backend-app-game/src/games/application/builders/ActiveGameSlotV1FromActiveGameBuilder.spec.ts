import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { ActiveGameSlot } from '@cornie-js/backend-app-game-domain/games/domain';
import { ActiveGameSlotFixtures } from '@cornie-js/backend-app-game-fixtures/games/domain';

import { ActiveGameSlotV1FromActiveGameSlotBuilder } from './ActiveGameSlotV1FromActiveGameSlotBuilder';

describe(ActiveGameSlotV1FromActiveGameSlotBuilder.name, () => {
  let activeGameSlotV1FromActiveGameSlotBuilder: ActiveGameSlotV1FromActiveGameSlotBuilder;

  beforeAll(() => {
    activeGameSlotV1FromActiveGameSlotBuilder =
      new ActiveGameSlotV1FromActiveGameSlotBuilder();
  });

  describe('having a ActiveGameSlot', () => {
    let activeGameSlotFixture: ActiveGameSlot;

    beforeAll(() => {
      activeGameSlotFixture = ActiveGameSlotFixtures.any;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = activeGameSlotV1FromActiveGameSlotBuilder.build(
          activeGameSlotFixture,
        );
      });

      it('should return a ActiveGameSlotV1', () => {
        const expected: apiModels.ActiveGameSlotV1 = {
          cardsAmount: activeGameSlotFixture.cards.length,
          userId: activeGameSlotFixture.userId,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
