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

import { GameSlotFindQuery } from '@cornie-js/backend-game-domain/games';
import { GameSlotFindQueryFixtures } from '@cornie-js/backend-game-domain/games/fixtures';
import {
  InstanceChecker,
  QueryBuilder,
  SelectQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';

import { GameSlotDb } from '../models/GameSlotDb';
import { GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter } from './GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter';

describe(GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter.name, () => {
  let gameSlotFindQueryToGameSlotFindQueryTypeOrmConverter: GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter;

  beforeAll(() => {
    gameSlotFindQueryToGameSlotFindQueryTypeOrmConverter =
      new GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter();
  });

  describe('.convert', () => {
    let queryBuilderMock: jest.Mocked<
      QueryBuilder<GameSlotDb> & WhereExpressionBuilder
    >;

    beforeAll(() => {
      queryBuilderMock = {
        andWhere: jest.fn().mockReturnThis(),
      } as Partial<
        jest.Mocked<QueryBuilder<GameSlotDb> & WhereExpressionBuilder>
      > as jest.Mocked<QueryBuilder<GameSlotDb> & WhereExpressionBuilder>;
    });

    describe('having a GameSlotFindQuery with gameId', () => {
      let gameSlotFindQueryFixture: GameSlotFindQuery;

      beforeAll(() => {
        gameSlotFindQueryFixture = GameSlotFindQueryFixtures.withGameId;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReturnValueOnce(true);

          result = gameSlotFindQueryToGameSlotFindQueryTypeOrmConverter.convert(
            gameSlotFindQueryFixture,
            queryBuilderMock,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call queryBuilder.andWhere()', () => {
          expect(queryBuilderMock.andWhere).toHaveBeenCalled();
          expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
            `${GameSlotDb.name}.game = :${GameSlotDb.name}gameId`,
            {
              [`${GameSlotDb.name}gameId`]: gameSlotFindQueryFixture.gameId,
            },
          );
        });

        it('should return a QueryBuilder', () => {
          expect(result).toBe(queryBuilderMock);
        });
      });
    });

    describe('having a GameSlotFindQuery with position', () => {
      let gameSlotFindQueryFixture: GameSlotFindQuery;

      beforeAll(() => {
        gameSlotFindQueryFixture = GameSlotFindQueryFixtures.withPosition;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReturnValueOnce(true);

          result = gameSlotFindQueryToGameSlotFindQueryTypeOrmConverter.convert(
            gameSlotFindQueryFixture,
            queryBuilderMock,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call queryBuilder.andWhere()', () => {
          expect(queryBuilderMock.andWhere).toHaveBeenCalled();
          expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
            `${GameSlotDb.name}.position = :${GameSlotDb.name}position`,
            {
              [`${GameSlotDb.name}position`]: gameSlotFindQueryFixture.position,
            },
          );
        });

        it('should return a QueryBuilder', () => {
          expect(result).toBe(queryBuilderMock);
        });
      });
    });

    describe('having a GameSlotFindQuery with userId', () => {
      let gameSlotFindQueryFixture: GameSlotFindQuery;

      beforeAll(() => {
        gameSlotFindQueryFixture = GameSlotFindQueryFixtures.withUserId;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReturnValueOnce(true);

          result = gameSlotFindQueryToGameSlotFindQueryTypeOrmConverter.convert(
            gameSlotFindQueryFixture,
            queryBuilderMock,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call queryBuilder.andWhere()', () => {
          expect(queryBuilderMock.andWhere).toHaveBeenCalled();
          expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
            `${GameSlotDb.name}.userId = :${GameSlotDb.name}userId`,
            {
              [`${GameSlotDb.name}userId`]: gameSlotFindQueryFixture.userId,
            },
          );
        });

        it('should return a QueryBuilder', () => {
          expect(result).toBe(queryBuilderMock);
        });
      });
    });
  });
});
