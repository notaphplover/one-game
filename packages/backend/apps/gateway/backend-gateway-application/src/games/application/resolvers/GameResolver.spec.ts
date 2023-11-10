import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as graphqlModels } from '@cornie-js/api-graphql-models';

import { GameResolver } from './GameResolver';

type GameResolvedType = ReturnType<GameResolver['__resolveType']>;

describe(GameResolver.name, () => {
  let gameResolver: GameResolver;

  beforeAll(() => {
    gameResolver = new GameResolver();
  });

  describe('.__resolveType', () => {
    describe('having an ActiveGame', () => {
      let activeGameFixture: graphqlModels.ActiveGame;

      beforeAll(() => {
        activeGameFixture = {
          state: {
            status: 'active',
          } as graphqlModels.ActiveGameState,
        } as graphqlModels.ActiveGame;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameResolver.__resolveType(activeGameFixture);
        });

        it('should return the right resolved type', () => {
          const expected: GameResolvedType = 'ActiveGame';

          expect(result).toBe(expected);
        });
      });
    });

    describe('having a FinishedGame', () => {
      let activeGameFixture: graphqlModels.FinishedGame;

      beforeAll(() => {
        activeGameFixture = {
          state: {
            status: 'finished',
          } as graphqlModels.FinishedGameState,
        } as graphqlModels.FinishedGame;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameResolver.__resolveType(activeGameFixture);
        });

        it('should return the right resolved type', () => {
          const expected: GameResolvedType = 'FinishedGame';

          expect(result).toBe(expected);
        });
      });
    });

    describe('having a NonStartedGame', () => {
      let activeGameFixture: graphqlModels.NonStartedGame;

      beforeAll(() => {
        activeGameFixture = {
          state: {
            status: 'nonStarted',
          } as graphqlModels.NonStartedGameState,
        } as graphqlModels.NonStartedGame;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameResolver.__resolveType(activeGameFixture);
        });

        it('should return the right resolved type', () => {
          const expected: GameResolvedType = 'NonStartedGame';

          expect(result).toBe(expected);
        });
      });
    });
  });
});
