import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { models as apiModels } from '@cornie-js/api-models';

import { GameSpecGraphqlFromGameSpecV1Builder } from './GameSpecGraphqlFromGameSpecV1Builder';

describe(GameSpecGraphqlFromGameSpecV1Builder.name, () => {
  let gameSpecGraphqlFromGameSpecV1Builder: GameSpecGraphqlFromGameSpecV1Builder;

  beforeAll(() => {
    gameSpecGraphqlFromGameSpecV1Builder =
      new GameSpecGraphqlFromGameSpecV1Builder();
  });

  describe('.build', () => {
    let gameSpecV1Fixture: apiModels.GameSpecV1;

    beforeAll(() => {
      gameSpecV1Fixture = {
        cardSpecs: Symbol() as unknown as apiModels.GameCardSpecV1[],
        gameId: 'game-Id',
        gameSlotsAmount: 2,
        options: Symbol() as unknown as apiModels.GameOptionsV1,
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = gameSpecGraphqlFromGameSpecV1Builder.build(gameSpecV1Fixture);
      });

      it('should return GameSpec', () => {
        const expected: graphqlModels.GameSpec = {
          cardSpecs: gameSpecV1Fixture.cardSpecs,
          gameSlotsAmount: gameSpecV1Fixture.gameSlotsAmount,
          options: gameSpecV1Fixture.options,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
