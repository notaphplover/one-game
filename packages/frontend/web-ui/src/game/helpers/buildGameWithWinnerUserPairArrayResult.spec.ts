import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { SerializableAppError } from '@cornie-js/frontend-api-rtk-query';
import { SerializedError } from '@reduxjs/toolkit';

import { Left, Right } from '../../common/models/Either';
import { GameWithWinnerUserPair } from '../models/GameWithWinnerUserPair';
import { buildGameWithWinnerUserPairArrayResult } from './buildGameWithWinnerUserPairArrayResult';

describe(buildGameWithWinnerUserPairArrayResult.name, () => {
  describe('having gamesV1Result null or winnerUserV1Result null', () => {
    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = buildGameWithWinnerUserPairArrayResult(null, null);
      });

      it('should return null', () => {
        expect(result).toBeNull();
      });
    });
  });

  describe('having Left gamesV1Result or Left winnerUserV1Result', () => {
    let gamesV1Result: Left<SerializableAppError | SerializedError>;
    let winnerUserV1Result: Left<SerializableAppError | SerializedError>;

    beforeAll(() => {
      gamesV1Result = {
        isRight: false,
        value: {
          message: 'games-v1-result-fixture',
        },
      };

      winnerUserV1Result = {
        isRight: false,
        value: {
          message: 'winner-user-v1-result-fixture',
        },
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = buildGameWithWinnerUserPairArrayResult(
          gamesV1Result,
          winnerUserV1Result,
        );
      });

      it('should return Left', () => {
        const expected: Left<SerializableAppError | SerializedError> = {
          isRight: false,
          value: {
            message: `${gamesV1Result.value.message ?? ''}\n${winnerUserV1Result.value.message ?? ''}`,
          },
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having Right gamesV1Result and Right winnerUserV1Result is null', () => {
    let gamesV1Result: Right<[apiModels.GameV1]>;
    let winnerUserV1Result: Right<[null]>;

    beforeAll(() => {
      gamesV1Result = {
        isRight: true,
        value: [
          {
            id: 'game-id',
            isPublic: true,
            state: {
              slots: [],
              status: 'finished',
            },
          },
        ],
      };

      winnerUserV1Result = {
        isRight: true,
        value: [null],
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = buildGameWithWinnerUserPairArrayResult(
          gamesV1Result,
          winnerUserV1Result,
        );
      });

      it('should return Right', () => {
        const [game]: [apiModels.GameV1] = gamesV1Result.value;

        const expected: Right<GameWithWinnerUserPair[]> = {
          isRight: true,
          value: [
            {
              game,
              winnerUser: undefined,
            },
          ],
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having Right gamesV1Result and Right winnerUserV1Result is not null', () => {
    let gamesV1Result: Right<[apiModels.GameV1]>;
    let winnerUserV1Result: Right<[apiModels.UserV1]>;

    beforeAll(() => {
      gamesV1Result = {
        isRight: true,
        value: [
          {
            id: 'game-id',
            isPublic: true,
            state: {
              slots: [],
              status: 'finished',
            },
          },
        ],
      };

      winnerUserV1Result = {
        isRight: true,
        value: [
          {
            active: true,
            id: 'user-id-fixture',
            name: 'name-fixture',
          },
        ],
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = buildGameWithWinnerUserPairArrayResult(
          gamesV1Result,
          winnerUserV1Result,
        );
      });

      it('should return Right', () => {
        const [game]: [apiModels.GameV1] = gamesV1Result.value;
        const [winnerUser]: [apiModels.UserV1] = winnerUserV1Result.value;

        const expected: Right<GameWithWinnerUserPair[]> = {
          isRight: true,
          value: [
            {
              game,
              winnerUser,
            },
          ],
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
