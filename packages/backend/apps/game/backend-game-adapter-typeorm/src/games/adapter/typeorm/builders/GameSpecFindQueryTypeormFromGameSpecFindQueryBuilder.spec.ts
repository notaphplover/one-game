import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { GameSpecFindQuery } from '@cornie-js/backend-game-domain/games';
import { GameSpecFindQueryFixtures } from '@cornie-js/backend-game-domain/games/fixtures';
import { ObjectLiteral, QueryBuilder, WhereExpressionBuilder } from 'typeorm';

import { GameSpecDb } from '../models/GameSpecDb';
import { GameSpecFindQueryTypeormFromGameSpecFindQueryBuilder } from './GameSpecFindQueryTypeormFromGameSpecFindQueryBuilder';

describe(GameSpecFindQueryTypeormFromGameSpecFindQueryBuilder.name, () => {
  let gameSpecFindQueryTypeormFromGameSpecFindQueryBuilder: GameSpecFindQueryTypeormFromGameSpecFindQueryBuilder;

  beforeAll(() => {
    gameSpecFindQueryTypeormFromGameSpecFindQueryBuilder =
      new GameSpecFindQueryTypeormFromGameSpecFindQueryBuilder();
  });

  describe('.build', () => {
    let queryBuilderMock: jest.Mocked<
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder
    >;

    beforeAll(() => {
      queryBuilderMock = {
        andWhere: jest.fn().mockReturnThis(),
      } as Partial<
        jest.Mocked<QueryBuilder<ObjectLiteral> & WhereExpressionBuilder>
      > as jest.Mocked<QueryBuilder<ObjectLiteral> & WhereExpressionBuilder>;
    });

    describe('having a GameSpecFindQuery with gameIds with an empty array', () => {
      let gameSpecFindQueryFixture: GameSpecFindQuery;

      beforeAll(() => {
        gameSpecFindQueryFixture = GameSpecFindQueryFixtures.withGameIdsEmpty;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameSpecFindQueryTypeormFromGameSpecFindQueryBuilder.build(
            gameSpecFindQueryFixture,
            queryBuilderMock,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should not call queryBuilder.andWhere()', () => {
          expect(queryBuilderMock.andWhere).not.toHaveBeenCalled();
        });

        it('should return QueryBuilder', () => {
          expect(result).toBe(queryBuilderMock);
        });
      });
    });

    describe('having a GameSpecFindQuery with gameIds with an array with one element', () => {
      let gameSpecFindQueryFixture: GameSpecFindQuery;

      beforeAll(() => {
        gameSpecFindQueryFixture =
          GameSpecFindQueryFixtures.withGameIdsWithLenghtOne;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameSpecFindQueryTypeormFromGameSpecFindQueryBuilder.build(
            gameSpecFindQueryFixture,
            queryBuilderMock,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call queryBuilder.andWhere()', () => {
          expect(queryBuilderMock.andWhere).toHaveBeenCalledTimes(1);
          expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
            expect.stringContaining(`game = :${GameSpecDb.name}game`),
            {
              [`${GameSpecDb.name}game`]: (
                gameSpecFindQueryFixture.gameIds as string[]
              )[0],
            },
          );
        });

        it('should return QueryBuilder', () => {
          expect(result).toBe(queryBuilderMock);
        });
      });
    });

    describe('having a GameSpecFindQuery with gameIds with an array with multiple elements', () => {
      let gameSpecFindQueryFixture: GameSpecFindQuery;

      beforeAll(() => {
        gameSpecFindQueryFixture =
          GameSpecFindQueryFixtures.withGameIdsWithLenghtTwo;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameSpecFindQueryTypeormFromGameSpecFindQueryBuilder.build(
            gameSpecFindQueryFixture,
            queryBuilderMock,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call queryBuilder.andWhere()', () => {
          expect(queryBuilderMock.andWhere).toHaveBeenCalledTimes(1);
          expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
            expect.stringContaining(`game IN (:${GameSpecDb.name}games)`),
            {
              [`${GameSpecDb.name}games`]: gameSpecFindQueryFixture.gameIds,
            },
          );
        });

        it('should return QueryBuilder', () => {
          expect(result).toBe(queryBuilderMock);
        });
      });
    });
  });
});
