import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('typeorm', () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  const originalTypeOrmModule: any = jest.requireActual('typeorm');

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const originalInstanceChecker: typeof InstanceChecker =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    originalTypeOrmModule.InstanceChecker;

  const instanceCheckerMock: typeof InstanceChecker = {
    ...originalInstanceChecker,
    isSelectQueryBuilder: jest.fn() as unknown as (
      obj: unknown,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) => obj is SelectQueryBuilder<any>,
  } as typeof InstanceChecker;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    ...originalTypeOrmModule,
    InstanceChecker: instanceCheckerMock,
  };
});

import { GameSpecFindQuery } from '@cornie-js/backend-game-domain/games';
import { GameSpecFindQueryFixtures } from '@cornie-js/backend-game-domain/games/fixtures';
import { InstanceChecker, ObjectLiteral, SelectQueryBuilder } from 'typeorm';

import { GameSpecDb } from '../models/GameSpecDb';
import { GameSpecFindQueryTypeormFromGameSpecFindQueryBuilder } from './GameSpecFindQueryTypeormFromGameSpecFindQueryBuilder';

describe(GameSpecFindQueryTypeormFromGameSpecFindQueryBuilder.name, () => {
  let gameSpecFindQueryTypeormFromGameSpecFindQueryBuilder: GameSpecFindQueryTypeormFromGameSpecFindQueryBuilder;

  beforeAll(() => {
    gameSpecFindQueryTypeormFromGameSpecFindQueryBuilder =
      new GameSpecFindQueryTypeormFromGameSpecFindQueryBuilder();
  });

  describe('.build', () => {
    let queryBuilderMock: jest.Mocked<SelectQueryBuilder<ObjectLiteral>>;

    beforeAll(() => {
      queryBuilderMock = {
        andWhere: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
      } as Partial<
        jest.Mocked<SelectQueryBuilder<ObjectLiteral>>
      > as jest.Mocked<SelectQueryBuilder<ObjectLiteral>>;
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
            expect.stringContaining(`game IN (:...${GameSpecDb.name}games)`),
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

    describe('having a GameSpecFindQuery with limit', () => {
      let gameSpecFindQueryFixture: GameSpecFindQuery;

      beforeAll(() => {
        gameSpecFindQueryFixture = GameSpecFindQueryFixtures.withLimit;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReturnValue(true);

          result = gameSpecFindQueryTypeormFromGameSpecFindQueryBuilder.build(
            gameSpecFindQueryFixture,
            queryBuilderMock,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call queryBuilder.limit()', () => {
          expect(queryBuilderMock.limit).toHaveBeenCalledTimes(1);
          expect(queryBuilderMock.limit).toHaveBeenCalledWith(
            gameSpecFindQueryFixture.limit,
          );
        });

        it('should return QueryBuilder', () => {
          expect(result).toBe(queryBuilderMock);
        });
      });
    });

    describe('having a GameSpecFindQuery with offset', () => {
      let gameSpecFindQueryFixture: GameSpecFindQuery;

      beforeAll(() => {
        gameSpecFindQueryFixture = GameSpecFindQueryFixtures.withOffset;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReturnValue(true);

          result = gameSpecFindQueryTypeormFromGameSpecFindQueryBuilder.build(
            gameSpecFindQueryFixture,
            queryBuilderMock,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call queryBuilder.offset()', () => {
          expect(queryBuilderMock.offset).toHaveBeenCalledTimes(1);
          expect(queryBuilderMock.offset).toHaveBeenCalledWith(
            gameSpecFindQueryFixture.offset,
          );
        });

        it('should return QueryBuilder', () => {
          expect(result).toBe(queryBuilderMock);
        });
      });
    });
  });
});
