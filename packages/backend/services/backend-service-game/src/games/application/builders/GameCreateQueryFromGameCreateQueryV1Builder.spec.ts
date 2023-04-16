import { beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@one-game-js/api-models';
import { Builder } from '@one-game-js/backend-common';

import { GameCreateQueryV1Fixtures } from '../../../cards/application/fixtures/GameCreateQueryV1Fixtures';
import { UuidContext } from '../../../foundation/common/application/models/UuidContext';
import { GameCardSpecFixtures } from '../../domain/fixtures/GameCardSpecFixtures';
import { GameCardSpec } from '../../domain/models/GameCardSpec';
import { GameCreateQuery } from '../../domain/query/GameCreateQuery';
import { GameCreateQueryFromGameCreateQueryV1Builder } from './GameCreateQueryFromGameCreateQueryV1Builder';

describe(GameCreateQueryFromGameCreateQueryV1Builder.name, () => {
  let gameCardSpecsFromGameSpecV1BuilderMock: jest.Mocked<
    Builder<GameCardSpec[], [apiModels.GameSpecV1]>
  >;

  let gameCreateQueryFromGameCreateQueryV1Builder: GameCreateQueryFromGameCreateQueryV1Builder;

  beforeAll(() => {
    gameCardSpecsFromGameSpecV1BuilderMock = {
      build: jest.fn(),
    };

    gameCreateQueryFromGameCreateQueryV1Builder =
      new GameCreateQueryFromGameCreateQueryV1Builder(
        gameCardSpecsFromGameSpecV1BuilderMock,
      );
  });

  describe('.build', () => {
    let gameCreateQueryV1Fixture: apiModels.GameCreateQueryV1;

    beforeAll(() => {
      gameCreateQueryV1Fixture = GameCreateQueryV1Fixtures.any;
    });

    describe('when called', () => {
      let gameCardSpecFixture: GameCardSpec;
      let uuidContext: UuidContext;

      let result: unknown;

      beforeAll(() => {
        gameCardSpecFixture = GameCardSpecFixtures.any;
        uuidContext = {
          uuid: '83073aec-b81b-4107-97f9-baa46de5dd41',
        };

        gameCardSpecsFromGameSpecV1BuilderMock.build.mockReturnValueOnce([
          gameCardSpecFixture,
        ]);

        result = gameCreateQueryFromGameCreateQueryV1Builder.build(
          gameCreateQueryV1Fixture,
          uuidContext,
        );
      });

      it('should call gameCardSpecsFromGameSpecV1Builder.build()', () => {
        expect(
          gameCardSpecsFromGameSpecV1BuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameCardSpecsFromGameSpecV1BuilderMock.build,
        ).toHaveBeenCalledWith(gameCreateQueryV1Fixture.gameSpec);
      });

      it('should return apiModels.GameSpecV1', () => {
        const expected: GameCreateQuery = {
          gameSlotsAmount: gameCreateQueryV1Fixture.gameSlotsAmount,
          id: uuidContext.uuid,
          spec: [gameCardSpecFixture],
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
