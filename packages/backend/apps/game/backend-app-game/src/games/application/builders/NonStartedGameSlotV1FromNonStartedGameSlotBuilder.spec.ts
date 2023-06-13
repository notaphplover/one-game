import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { NonStartedGameSlot } from '@cornie-js/backend-app-game-domain/games/domain';
import { NonStartedGameSlotFixtures } from '@cornie-js/backend-app-game-fixtures/games/domain';

import { NonStartedGameSlotV1FromNonStartedGameSlotBuilder } from './NonStartedGameSlotV1FromNonStartedGameSlotBuilder';

describe(NonStartedGameSlotV1FromNonStartedGameSlotBuilder.name, () => {
  let nonStartedGameSlotV1FromNonStartedGameSlotBuilder: NonStartedGameSlotV1FromNonStartedGameSlotBuilder;

  beforeAll(() => {
    nonStartedGameSlotV1FromNonStartedGameSlotBuilder =
      new NonStartedGameSlotV1FromNonStartedGameSlotBuilder();
  });

  describe('having a NonStartedGameSlot', () => {
    let nonStartedGameSlotFixture: NonStartedGameSlot;

    beforeAll(() => {
      nonStartedGameSlotFixture = NonStartedGameSlotFixtures.any;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = nonStartedGameSlotV1FromNonStartedGameSlotBuilder.build(
          nonStartedGameSlotFixture,
        );
      });

      it('should return a NonStartedGameSlotV1', () => {
        const expected: apiModels.NonStartedGameSlotV1 = {
          userId: nonStartedGameSlotFixture.userId,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
