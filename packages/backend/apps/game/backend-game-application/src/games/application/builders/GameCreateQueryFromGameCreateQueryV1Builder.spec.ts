import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import {
  GameCardSpec,
  GameCreateQuery,
  GameOptionsCreateQuery,
  GameService,
} from '@cornie-js/backend-game-domain/games';
import {
  GameCardSpecFixtures,
  GameOptionsCreateQueryFixtures,
} from '@cornie-js/backend-game-domain/games/fixtures';

import { GameCreateQueryContextFixtures } from '../fixtures/GameCreateQueryContextFixtures';
import { GameCreateQueryV1Fixtures } from '../fixtures/GameCreateQueryV1Fixtures';
import { GameCreateQueryContext } from '../models/GameCreateQueryContext';
import { GameOptionsCreateQueryContext } from '../models/GameOptionsCreateQueryContext';
import { GameCreateQueryFromGameCreateQueryV1Builder } from './GameCreateQueryFromGameCreateQueryV1Builder';

describe(GameCreateQueryFromGameCreateQueryV1Builder.name, () => {
  let gameOptionsCreateQueryFromGameOptionsV1BuilderMock: jest.Mocked<
    Builder<
      GameOptionsCreateQuery,
      [apiModels.GameOptionsV1, GameOptionsCreateQueryContext]
    >
  >;
  let gameServiceMock: jest.Mocked<GameService>;

  let gameCreateQueryFromGameCreateQueryV1Builder: GameCreateQueryFromGameCreateQueryV1Builder;

  beforeAll(() => {
    gameOptionsCreateQueryFromGameOptionsV1BuilderMock = {
      build: jest.fn(),
    };
    gameServiceMock = {
      getInitialCardsSpec: jest.fn(),
    } as Partial<jest.Mocked<GameService>> as jest.Mocked<GameService>;

    gameCreateQueryFromGameCreateQueryV1Builder =
      new GameCreateQueryFromGameCreateQueryV1Builder(
        gameOptionsCreateQueryFromGameOptionsV1BuilderMock,
        gameServiceMock,
      );
  });

  describe('.build', () => {
    let gameCreateQueryV1Fixture: apiModels.GameCreateQueryV1;

    beforeAll(() => {
      gameCreateQueryV1Fixture = GameCreateQueryV1Fixtures.any;
    });

    describe('when called', () => {
      let gameCardSpecFixture: GameCardSpec;
      let gameCreateQueryContextFixture: GameCreateQueryContext;
      let gameOptionsCreateQueryFixture: GameOptionsCreateQuery;

      let result: unknown;

      beforeAll(() => {
        gameCardSpecFixture = GameCardSpecFixtures.any;
        gameCreateQueryContextFixture = GameCreateQueryContextFixtures.any;
        gameOptionsCreateQueryFixture = GameOptionsCreateQueryFixtures.any;

        gameOptionsCreateQueryFromGameOptionsV1BuilderMock.build.mockReturnValueOnce(
          gameOptionsCreateQueryFixture,
        );
        gameServiceMock.getInitialCardsSpec.mockReturnValueOnce([
          gameCardSpecFixture,
        ]);

        result = gameCreateQueryFromGameCreateQueryV1Builder.build(
          gameCreateQueryV1Fixture,
          gameCreateQueryContextFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameOptionsCreateQueryFromGameOptionsV1Builder.build()', () => {
        const expectedContext: GameOptionsCreateQueryContext = {
          gameId: gameCreateQueryContextFixture.uuid,
          uuid: gameCreateQueryContextFixture.gameOptionsId,
        };

        expect(
          gameOptionsCreateQueryFromGameOptionsV1BuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameOptionsCreateQueryFromGameOptionsV1BuilderMock.build,
        ).toHaveBeenCalledWith(
          gameCreateQueryV1Fixture.options,
          expectedContext,
        );
      });

      it('should call gameServiceMock.getInitialCardsSpec()', () => {
        expect(gameServiceMock.getInitialCardsSpec).toHaveBeenCalledTimes(1);
        expect(gameServiceMock.getInitialCardsSpec).toHaveBeenCalledWith();
      });

      it('should return apiModels.GameSpecV1', () => {
        const expected: GameCreateQuery = {
          id: gameCreateQueryContextFixture.uuid,
          isPublic: false,
          name: gameCreateQueryV1Fixture.name,
          spec: {
            cards: [gameCardSpecFixture],
            gameId: gameCreateQueryContextFixture.uuid,
            gameSlotsAmount: gameCreateQueryV1Fixture.gameSlotsAmount,
            id: gameCreateQueryContextFixture.gameSpecId,
            options: gameOptionsCreateQueryFixture,
          },
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
