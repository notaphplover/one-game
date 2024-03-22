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

import { Builder } from '@cornie-js/backend-common';
import {
  GameFindQuery,
  GameSlotFindQuery,
} from '@cornie-js/backend-game-domain/games';
import { GameFindQueryFixtures } from '@cornie-js/backend-game-domain/games/fixtures';
import {
  InstanceChecker,
  QueryBuilder,
  SelectQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';

import { GameDb } from '../models/GameDb';
import { GameSlotDb } from '../models/GameSlotDb';
import { GameFindQueryTypeOrmFromGameFindQueryBuilder } from './GameFindQueryTypeOrmFromGameFindQueryBuilder';

describe(GameFindQueryTypeOrmFromGameFindQueryBuilder.name, () => {
  let gameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilderMock: jest.Mocked<
    Builder<
      QueryBuilder<GameSlotDb> & WhereExpressionBuilder,
      [GameSlotFindQuery, QueryBuilder<GameSlotDb> & WhereExpressionBuilder]
    >
  >;
  let gameFindQueryTypeOrmFromGameFindQueryBuilder: GameFindQueryTypeOrmFromGameFindQueryBuilder;

  beforeAll(() => {
    gameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilderMock = {
      build: jest.fn(),
    };

    gameFindQueryTypeOrmFromGameFindQueryBuilder =
      new GameFindQueryTypeOrmFromGameFindQueryBuilder(
        gameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilderMock,
      );
  });

  describe('.build', () => {
    let queryFixture: string;
    let queryBuilderMock: jest.Mocked<
      SelectQueryBuilder<GameDb> & SelectQueryBuilder<GameSlotDb>
    >;

    beforeAll(() => {
      queryFixture = '(query fixture)';

      queryBuilderMock = {
        andWhere: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        getParameters: jest.fn().mockReturnThis(),
        getQuery: jest.fn().mockReturnValue(queryFixture),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        subQuery: jest.fn().mockReturnThis(),
      } as Partial<
        jest.Mocked<SelectQueryBuilder<GameDb> & SelectQueryBuilder<GameSlotDb>>
      > as jest.Mocked<
        SelectQueryBuilder<GameDb> & SelectQueryBuilder<GameSlotDb>
      >;
    });

    describe('having a GameFindQuery with id', () => {
      let gameFindQueryFixture: GameFindQuery;

      beforeAll(() => {
        gameFindQueryFixture = GameFindQueryFixtures.withId;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReturnValue(true);

          result = gameFindQueryTypeOrmFromGameFindQueryBuilder.build(
            gameFindQueryFixture,
            queryBuilderMock,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();

          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReset();
        });

        it('should call queryBuilder.andWhere()', () => {
          expect(queryBuilderMock.andWhere).toHaveBeenCalled();
          expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
            `${GameDb.name}.id = :${GameDb.name}id`,
            {
              [`${GameDb.name}id`]: gameFindQueryFixture.id,
            },
          );
        });

        it('should return a QueryBuilder', () => {
          expect(result).toBe(queryBuilderMock);
        });
      });
    });

    describe('having a GameFindQuery with GameSlotFindQuery', () => {
      let gameFindQueryFixture: GameFindQuery;

      beforeAll(() => {
        gameFindQueryFixture = GameFindQueryFixtures.withGameSlotFindQuery;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReturnValue(true);

          gameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilderMock.build.mockReturnValueOnce(
            queryBuilderMock,
          );

          result = gameFindQueryTypeOrmFromGameFindQueryBuilder.build(
            gameFindQueryFixture,
            queryBuilderMock,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();

          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReset();
        });

        it('should call gameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilderMock.build()', () => {
          expect(
            gameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilderMock.build,
          ).toHaveBeenCalled();
          expect(
            gameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilderMock.build,
          ).toHaveBeenCalledWith(
            gameFindQueryFixture.gameSlotFindQuery,
            queryBuilderMock,
          );
        });

        it('should return a QueryBuilder', () => {
          expect(result).toBe(queryBuilderMock);
        });
      });
    });

    describe('having a GameFindQuery with limit', () => {
      let gameFindQueryFixture: GameFindQuery;

      beforeAll(() => {
        gameFindQueryFixture = GameFindQueryFixtures.withLimit;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReturnValue(true);

          result = gameFindQueryTypeOrmFromGameFindQueryBuilder.build(
            gameFindQueryFixture,
            queryBuilderMock,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();

          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReset();
        });

        it('should call queryBuilder.limit()', () => {
          expect(queryBuilderMock.limit).toHaveBeenCalledTimes(1);
          expect(queryBuilderMock.limit).toHaveBeenCalledWith(
            gameFindQueryFixture.limit,
          );
        });

        it('should return a QueryBuilder', () => {
          expect(result).toBe(queryBuilderMock);
        });
      });
    });

    describe('having a GameFindQuery with offset', () => {
      let gameFindQueryFixture: GameFindQuery;

      beforeAll(() => {
        gameFindQueryFixture = GameFindQueryFixtures.withOffset;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReturnValue(true);

          result = gameFindQueryTypeOrmFromGameFindQueryBuilder.build(
            gameFindQueryFixture,
            queryBuilderMock,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();

          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReset();
        });

        it('should call queryBuilder.offset()', () => {
          expect(queryBuilderMock.offset).toHaveBeenCalledTimes(1);
          expect(queryBuilderMock.offset).toHaveBeenCalledWith(
            gameFindQueryFixture.offset,
          );
        });

        it('should return a QueryBuilder', () => {
          expect(result).toBe(queryBuilderMock);
        });
      });
    });

    describe('having a GameFindQuery with state with currentPlayingSlotIndex', () => {
      let gameFindQueryFixture: GameFindQuery;

      beforeAll(() => {
        gameFindQueryFixture =
          GameFindQueryFixtures.withStateWithCurrentPlayingSlotIndex;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReturnValue(true);

          result = gameFindQueryTypeOrmFromGameFindQueryBuilder.build(
            gameFindQueryFixture,
            queryBuilderMock,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();

          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReset();
        });

        it('should call queryBuilder.andWhere()', () => {
          expect(queryBuilderMock.andWhere).toHaveBeenCalled();
          expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
            `${GameDb.name}.currentPlayingSlotIndex = :${GameDb.name}currentPlayingSlotIndex`,
            {
              [`${GameDb.name}currentPlayingSlotIndex`]:
                gameFindQueryFixture.state?.currentPlayingSlotIndex,
            },
          );
        });

        it('should return a QueryBuilder', () => {
          expect(result).toBe(queryBuilderMock);
        });
      });
    });

    describe('having a GameFindQuery with status', () => {
      let gameFindQueryFixture: GameFindQuery;

      beforeAll(() => {
        gameFindQueryFixture = GameFindQueryFixtures.withStatusActive;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReturnValue(true);

          result = gameFindQueryTypeOrmFromGameFindQueryBuilder.build(
            gameFindQueryFixture,
            queryBuilderMock,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();

          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReset();
        });

        it('should call queryBuilder.andWhere()', () => {
          expect(queryBuilderMock.andWhere).toHaveBeenCalled();
          expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
            `${GameDb.name}.status = :${GameDb.name}status`,
            {
              [`${GameDb.name}status`]: gameFindQueryFixture.status,
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
