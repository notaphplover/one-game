import { beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { Card } from '@cornie-js/backend-game-domain/cards';
import { CardFixtures } from '@cornie-js/backend-game-domain/cards/fixtures';
import { GameCardSpec } from '@cornie-js/backend-game-domain/games';

import { GameCardSpecV1Fixtures } from '../../../cards/application/fixtures/GameCardSpecV1Fixtures';
import { GameCardSpecFromGameCardSpecV1Builder } from './GameCardSpecFromGameCardSpecV1Builder';

describe(GameCardSpecFromGameCardSpecV1Builder.name, () => {
  let cardFromCardV1BuilderMock: jest.Mocked<Builder<Card, [apiModels.CardV1]>>;

  let gameCardSpecFromGameCardSpecV1Builder: GameCardSpecFromGameCardSpecV1Builder;

  beforeAll(() => {
    cardFromCardV1BuilderMock = {
      build: jest.fn(),
    };

    gameCardSpecFromGameCardSpecV1Builder =
      new GameCardSpecFromGameCardSpecV1Builder(cardFromCardV1BuilderMock);
  });

  describe('.build', () => {
    let gameCardSpecV1Fixture: apiModels.GameCardSpecV1;

    beforeAll(() => {
      gameCardSpecV1Fixture = GameCardSpecV1Fixtures.any;
    });

    describe('when called', () => {
      let cardFixture: Card;
      let gameCardSpecFixture: GameCardSpec;

      let result: unknown;

      beforeAll(() => {
        cardFixture = CardFixtures.any;

        gameCardSpecFixture = {
          amount: gameCardSpecV1Fixture.amount,
          card: cardFixture,
        };

        cardFromCardV1BuilderMock.build.mockReturnValueOnce(cardFixture);

        result = gameCardSpecFromGameCardSpecV1Builder.build(
          gameCardSpecV1Fixture,
        );
      });

      it('should return GameCardSpec', () => {
        expect(result).toStrictEqual(gameCardSpecFixture);
      });
    });
  });
});
