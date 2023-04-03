import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@one-game-js/api-models';
import { Builder } from '@one-game-js/backend-common';

import { GameSpecV1Fixtures } from '../../../cards/application/fixtures/GameSpecV1Fixtures';
import { GameCardSpecFixtures } from '../../domain/fixtures/GameCardSpecFixtures';
import { GameCardSpec } from '../../domain/models/GameCardSpec';
import { GameCardSpecsFromGameSpecV1Builder } from './GameCardSpecsFromGameSpecV1Builder';

describe(GameCardSpecsFromGameSpecV1Builder.name, () => {
  let gameCardSpecFromGameCardSpecV1BuilderMock: jest.Mocked<
    Builder<GameCardSpec, [apiModels.GameCardSpecV1]>
  >;

  let gameCreateQueryV1ToGameCreateQueryBuilder: GameCardSpecsFromGameSpecV1Builder;

  beforeAll(() => {
    gameCardSpecFromGameCardSpecV1BuilderMock = {
      build: jest.fn(),
    };

    gameCreateQueryV1ToGameCreateQueryBuilder =
      new GameCardSpecsFromGameSpecV1Builder(
        gameCardSpecFromGameCardSpecV1BuilderMock,
      );
  });

  describe('.build', () => {
    let gameCardSpecV1Fixture: apiModels.GameCardSpecV1;
    let gameSpecV1Fixture: apiModels.GameSpecV1;

    beforeAll(() => {
      gameSpecV1Fixture = GameSpecV1Fixtures.withCardSpecsOne;

      [gameCardSpecV1Fixture] = gameSpecV1Fixture.cardSpecs as [
        apiModels.GameCardSpecV1,
      ];
    });

    describe('when called', () => {
      let gameCardSpecFixture: GameCardSpec;

      let result: unknown;

      beforeAll(() => {
        gameCardSpecFixture = GameCardSpecFixtures.any;

        gameCardSpecFromGameCardSpecV1BuilderMock.build.mockReturnValueOnce(
          gameCardSpecFixture,
        );

        result =
          gameCreateQueryV1ToGameCreateQueryBuilder.build(gameSpecV1Fixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameCardSpecFromGameCardSpecV1Builder.build()', () => {
        expect(
          gameCardSpecFromGameCardSpecV1BuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameCardSpecFromGameCardSpecV1BuilderMock.build,
        ).toHaveBeenCalledWith(gameCardSpecV1Fixture);
      });

      it('should return a GameCardSpec[]', () => {
        expect(result).toStrictEqual([gameCardSpecFixture]);
      });
    });
  });
});
