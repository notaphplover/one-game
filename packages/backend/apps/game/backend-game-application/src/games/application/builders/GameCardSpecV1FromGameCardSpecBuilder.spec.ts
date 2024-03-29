import { beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { Card } from '@cornie-js/backend-game-domain/cards';
import { GameCardSpec } from '@cornie-js/backend-game-domain/games';
import { GameCardSpecFixtures } from '@cornie-js/backend-game-domain/games/fixtures';

import { CardV1Fixtures } from '../../../cards/application/fixtures/CardV1Fixtures';
import { GameCardSpecV1FromGameCardSpecBuilder } from './GameCardSpecV1FromGameCardSpecBuilder';

describe(GameCardSpecV1FromGameCardSpecBuilder.name, () => {
  let cardV1FromCardBuilderMock: jest.Mocked<Builder<apiModels.CardV1, [Card]>>;

  let gameCardSpecFromGameCardSpecV1Builder: GameCardSpecV1FromGameCardSpecBuilder;

  beforeAll(() => {
    cardV1FromCardBuilderMock = {
      build: jest.fn(),
    };

    gameCardSpecFromGameCardSpecV1Builder =
      new GameCardSpecV1FromGameCardSpecBuilder(cardV1FromCardBuilderMock);
  });

  describe('.build', () => {
    let gameCardSpecFixture: GameCardSpec;

    beforeAll(() => {
      gameCardSpecFixture = GameCardSpecFixtures.any;
    });

    describe('when called', () => {
      let cardV1Fixture: apiModels.CardV1;
      let gameCardSpecV1Fixture: apiModels.GameCardSpecV1;

      let result: unknown;

      beforeAll(() => {
        cardV1Fixture = CardV1Fixtures.any;

        gameCardSpecV1Fixture = {
          amount: gameCardSpecFixture.amount,
          card: cardV1Fixture,
        };

        cardV1FromCardBuilderMock.build.mockReturnValueOnce(cardV1Fixture);

        result =
          gameCardSpecFromGameCardSpecV1Builder.build(gameCardSpecFixture);
      });

      it('should return GameCardSpec', () => {
        expect(result).toStrictEqual(gameCardSpecV1Fixture);
      });
    });
  });
});
