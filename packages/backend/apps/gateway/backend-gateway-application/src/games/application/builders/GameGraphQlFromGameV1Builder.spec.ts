import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { models as apiModels } from '@cornie-js/api-models';

import { GameGraphQlFromGameV1Builder } from './GameGraphQlFromGameV1Builder';

describe(GameGraphQlFromGameV1Builder.name, () => {
  let gameGraphQlFromGameV1Builder: GameGraphQlFromGameV1Builder;

  beforeAll(() => {
    gameGraphQlFromGameV1Builder = new GameGraphQlFromGameV1Builder();
  });

  describe('.build', () => {
    describe('having a ActiveGameV1 with no name', () => {
      let activeGameV1Fixture: apiModels.ActiveGameV1;

      beforeAll(() => {
        activeGameV1Fixture = {
          id: 'id-fixture',
          spec: Symbol() as unknown as apiModels.GameSpecV1,
          state: {
            status: 'active',
          } as apiModels.ActiveGameStateV1,
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameGraphQlFromGameV1Builder.build(activeGameV1Fixture);
        });

        it('should return a GraphQL game', () => {
          const expected: graphqlModels.ActiveGame = {
            id: activeGameV1Fixture.id,
            name: null,
            spec: activeGameV1Fixture.spec,
            state: activeGameV1Fixture.state,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a ActiveGameV1 with name', () => {
      let activeGameV1Fixture: apiModels.ActiveGameV1;

      beforeAll(() => {
        activeGameV1Fixture = {
          id: 'id-fixture',
          name: 'name fixture',
          spec: Symbol() as unknown as apiModels.GameSpecV1,
          state: {
            status: 'active',
          } as apiModels.ActiveGameStateV1,
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameGraphQlFromGameV1Builder.build(activeGameV1Fixture);
        });

        it('should return a GraphQL game', () => {
          const expected: graphqlModels.ActiveGame = {
            id: activeGameV1Fixture.id,
            name: activeGameV1Fixture.name as string,
            spec: activeGameV1Fixture.spec,
            state: activeGameV1Fixture.state,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a FinishedGameV1 with no name', () => {
      let finishedGameV1Fixture: apiModels.FinishedGameV1;

      beforeAll(() => {
        finishedGameV1Fixture = {
          id: 'id-fixture',
          spec: Symbol() as unknown as apiModels.GameSpecV1,
          state: {
            status: 'finished',
          } as apiModels.FinishedGameStateV1,
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameGraphQlFromGameV1Builder.build(finishedGameV1Fixture);
        });

        it('should return a GraphQL game', () => {
          const expected: graphqlModels.FinishedGame = {
            id: finishedGameV1Fixture.id,
            name: null,
            spec: finishedGameV1Fixture.spec,
            state: finishedGameV1Fixture.state,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a FinishedGameV1 with name', () => {
      let finishedGameV1Fixture: apiModels.FinishedGameV1;

      beforeAll(() => {
        finishedGameV1Fixture = {
          id: 'id-fixture',
          spec: Symbol() as unknown as apiModels.GameSpecV1,
          state: {
            status: 'finished',
          } as apiModels.FinishedGameStateV1,
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameGraphQlFromGameV1Builder.build(finishedGameV1Fixture);
        });

        it('should return a GraphQL game', () => {
          const expected: graphqlModels.FinishedGame = {
            id: finishedGameV1Fixture.id,
            name: null,
            spec: finishedGameV1Fixture.spec,
            state: finishedGameV1Fixture.state,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a NonStartedGameV1 with no name', () => {
      let nonStartedGameV1Fixture: apiModels.NonStartedGameV1;

      beforeAll(() => {
        nonStartedGameV1Fixture = {
          id: 'id-fixture',
          spec: Symbol() as unknown as apiModels.GameSpecV1,
          state: {
            status: 'nonStarted',
          } as apiModels.NonStartedGameStateV1,
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameGraphQlFromGameV1Builder.build(nonStartedGameV1Fixture);
        });

        it('should return a GraphQL game', () => {
          const expected: graphqlModels.NonStartedGame = {
            id: nonStartedGameV1Fixture.id,
            name: null,
            spec: nonStartedGameV1Fixture.spec,
            state: nonStartedGameV1Fixture.state,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a NonStartedGameV1 with name', () => {
      let nonStartedGameV1Fixture: apiModels.NonStartedGameV1;

      beforeAll(() => {
        nonStartedGameV1Fixture = {
          id: 'id-fixture',
          spec: Symbol() as unknown as apiModels.GameSpecV1,
          state: {
            status: 'nonStarted',
          } as apiModels.NonStartedGameStateV1,
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameGraphQlFromGameV1Builder.build(nonStartedGameV1Fixture);
        });

        it('should return a GraphQL game', () => {
          const expected: graphqlModels.NonStartedGame = {
            id: nonStartedGameV1Fixture.id,
            name: null,
            spec: nonStartedGameV1Fixture.spec,
            state: nonStartedGameV1Fixture.state,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
