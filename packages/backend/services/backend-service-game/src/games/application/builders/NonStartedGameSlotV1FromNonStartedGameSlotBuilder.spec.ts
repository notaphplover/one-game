import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@one-game-js/api-models';

import { NonStartedGameSlotFixtures } from '../../domain/fixtures/NonStartedGameSlotFixtures';
import { NonStartedGameSlot } from '../../domain/models/NonStartedGameSlot';
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
