import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('typeorm', () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  const originalTypeOrmModule: any = jest.requireActual('typeorm');

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const originalInstanceChecker: typeof InstanceChecker =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    originalTypeOrmModule.InstanceChecker;

  const instanceCheckerMock: typeof InstanceChecker = {
    // eslint-disable-next-line @typescript-eslint/no-misused-spread
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

import { GameActionFindQuery } from '@cornie-js/backend-game-domain/gameActions';
import { GameActionFindQueryFixtures } from '@cornie-js/backend-game-domain/gameActions/fixtures';
import { InstanceChecker, SelectQueryBuilder } from 'typeorm';

import { GameActionDb } from '../models/GameActionDb';
import { GameActionFindQueryTypeOrmFromGameActionFindQueryBuilder } from './GameActionFindQueryTypeOrmFromGameActionFindQueryBuilder';

describe(GameActionFindQueryTypeOrmFromGameActionFindQueryBuilder.name, () => {
  let gameActionFindQueryTypeOrmFromGameActionFindQueryBuilder: GameActionFindQueryTypeOrmFromGameActionFindQueryBuilder;

  beforeAll(() => {
    gameActionFindQueryTypeOrmFromGameActionFindQueryBuilder =
      new GameActionFindQueryTypeOrmFromGameActionFindQueryBuilder();
  });

  describe('.build', () => {
    let queryBuilderMock: jest.Mocked<SelectQueryBuilder<GameActionDb>>;

    beforeAll(() => {
      queryBuilderMock = {
        andWhere: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
      } as Partial<
        jest.Mocked<SelectQueryBuilder<GameActionDb>>
      > as jest.Mocked<SelectQueryBuilder<GameActionDb>>;
    });

    describe('having a GameActionFindQuery with game id', () => {
      let gameActionFindQueryFixture: GameActionFindQuery;

      beforeAll(() => {
        gameActionFindQueryFixture = GameActionFindQueryFixtures.withGameId;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReturnValue(true);

          result =
            gameActionFindQueryTypeOrmFromGameActionFindQueryBuilder.build(
              gameActionFindQueryFixture,
              queryBuilderMock,
            );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call queryBuilder.andWhere()', () => {
          expect(queryBuilderMock.andWhere).toHaveBeenCalledTimes(1);
          expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
            `${GameActionDb.name}.game = :${GameActionDb.name}game`,
            {
              [`${GameActionDb.name}game`]: gameActionFindQueryFixture.gameId,
            },
          );
        });

        it('should return QueryBuilder<GameActionDb>', () => {
          expect(result).toBe(queryBuilderMock);
        });
      });
    });

    describe('having a GameActionFindQuery with id', () => {
      let gameActionFindQueryFixture: GameActionFindQuery;

      beforeAll(() => {
        gameActionFindQueryFixture = GameActionFindQueryFixtures.withId;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReturnValue(true);

          result =
            gameActionFindQueryTypeOrmFromGameActionFindQueryBuilder.build(
              gameActionFindQueryFixture,
              queryBuilderMock,
            );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call queryBuilder.andWhere()', () => {
          expect(queryBuilderMock.andWhere).toHaveBeenCalledTimes(1);
          expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
            `${GameActionDb.name}.id = :${GameActionDb.name}id`,
            {
              [`${GameActionDb.name}id`]: gameActionFindQueryFixture.id,
            },
          );
        });

        it('should return QueryBuilder<GameActionDb>', () => {
          expect(result).toBe(queryBuilderMock);
        });
      });
    });

    describe('having a GameActionFindQuery with limit', () => {
      let gameActionFindQueryFixture: GameActionFindQuery;

      beforeAll(() => {
        gameActionFindQueryFixture = GameActionFindQueryFixtures.withLimit;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReturnValue(true);

          result =
            gameActionFindQueryTypeOrmFromGameActionFindQueryBuilder.build(
              gameActionFindQueryFixture,
              queryBuilderMock,
            );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call queryBuilder.limit()', () => {
          expect(queryBuilderMock.limit).toHaveBeenCalledTimes(1);
          expect(queryBuilderMock.limit).toHaveBeenCalledWith(
            gameActionFindQueryFixture.limit,
          );
        });

        it('should return QueryBuilder<GameActionDb>', () => {
          expect(result).toBe(queryBuilderMock);
        });
      });
    });

    describe('having a GameActionFindQuery with position with gt', () => {
      let gameActionFindQueryFixture: GameActionFindQuery;

      beforeAll(() => {
        gameActionFindQueryFixture = GameActionFindQueryFixtures.withPositionGt;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReturnValue(true);

          result =
            gameActionFindQueryTypeOrmFromGameActionFindQueryBuilder.build(
              gameActionFindQueryFixture,
              queryBuilderMock,
            );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call queryBuilder.andWhere()', () => {
          expect(queryBuilderMock.andWhere).toHaveBeenCalledTimes(1);
          expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
            `${GameActionDb.name}.position > :${GameActionDb.name}position`,
            {
              [`${GameActionDb.name}position`]:
                gameActionFindQueryFixture.position?.gt,
            },
          );
        });

        it('should return QueryBuilder<GameActionDb>', () => {
          expect(result).toBe(queryBuilderMock);
        });
      });
    });
  });
});
