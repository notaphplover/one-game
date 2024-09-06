import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';

import { Left, Right } from '../../common/models/Either';
import { GameWithSpecPair } from '../models/GameWithSpecPair';
import { buildGameWithSpecPairArrayResult } from './buildGameWithSpecPairArrayResult';

describe(buildGameWithSpecPairArrayResult.name, () => {
  describe('having gamesV1Result null or gamesSpecsV1Result null', () => {
    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = buildGameWithSpecPairArrayResult(null, null);
      });

      it('should return null', () => {
        expect(result).toBeNull();
      });
    });
  });

  describe('having Left gamesV1Result or Left gamesSpecsV1Result', () => {
    let gamesV1Result: Left<string>;
    let gamesSpecsV1Result: Left<string>;

    beforeAll(() => {
      gamesV1Result = {
        isRight: false,
        value: 'games-v1-result-fixture',
      };

      gamesSpecsV1Result = {
        isRight: false,
        value: 'games-specs-v1-result-fixture',
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = buildGameWithSpecPairArrayResult(
          gamesV1Result,
          gamesSpecsV1Result,
        );
      });

      it('should return Left', () => {
        const expected: Left<string> = {
          isRight: false,
          value: `${gamesV1Result.value}\n${gamesSpecsV1Result.value}`,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having Right gamesV1Result and Right gamesSpecsV1Result', () => {
    let gamesV1Result: Right<[apiModels.GameV1]>;
    let gamesSpecsV1Result: Right<[apiModels.GameSpecV1]>;

    beforeAll(() => {
      gamesV1Result = {
        isRight: true,
        value: [
          {
            id: 'game-id',
            isPublic: true,
            state: {
              slots: [],
              status: 'nonStarted',
            },
          },
        ],
      };

      gamesSpecsV1Result = {
        isRight: true,
        value: [
          {
            cardSpecs: [],
            gameId: 'game-id',
            gameSlotsAmount: 2,
            options: {
              chainDraw2Draw2Cards: false,
              chainDraw2Draw4Cards: false,
              chainDraw4Draw2Cards: false,
              chainDraw4Draw4Cards: false,
              playCardIsMandatory: false,
              playMultipleSameCards: false,
              playWildDraw4IfNoOtherAlternative: true,
            },
          },
        ],
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = buildGameWithSpecPairArrayResult(
          gamesV1Result,
          gamesSpecsV1Result,
        );
      });

      it('should return Right', () => {
        const [game]: [apiModels.GameV1] = gamesV1Result.value;
        const [spec]: [apiModels.GameSpecV1] = gamesSpecsV1Result.value;

        const expected: Right<GameWithSpecPair[]> = {
          isRight: true,
          value: [
            {
              game,
              spec,
            },
          ],
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
