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

import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { UserFindQuery } from '@cornie-js/backend-user-domain/users';
import { UserFindQueryFixtures } from '@cornie-js/backend-user-domain/users/fixtures';
import { InstanceChecker, SelectQueryBuilder } from 'typeorm';

import { UserDb } from '../models/UserDb';
import { UserFindQueryTypeOrmFromUserFindQueryBuilder } from './UserFindQueryTypeOrmFromUserFindQueryBuilder';

describe(UserFindQueryTypeOrmFromUserFindQueryBuilder.name, () => {
  let userFindQueryTypeOrmFromUserFindQueryBuilder: UserFindQueryTypeOrmFromUserFindQueryBuilder;

  beforeAll(() => {
    userFindQueryTypeOrmFromUserFindQueryBuilder =
      new UserFindQueryTypeOrmFromUserFindQueryBuilder();
  });

  describe('.build', () => {
    let queryBuilderMock: jest.Mocked<SelectQueryBuilder<UserDb>>;

    beforeAll(() => {
      queryBuilderMock = {
        addOrderBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
      } as Partial<jest.Mocked<SelectQueryBuilder<UserDb>>> as jest.Mocked<
        SelectQueryBuilder<UserDb>
      >;
    });

    describe('having a UserFindQuery with no properties', () => {
      let userFindQueryFixture: UserFindQuery;

      beforeAll(() => {
        userFindQueryFixture = UserFindQueryFixtures.withNoProperties;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = userFindQueryTypeOrmFromUserFindQueryBuilder.build(
            userFindQueryFixture,
            queryBuilderMock,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a QueryBuilder', () => {
          expect(result).toBe(queryBuilderMock);
        });
      });
    });

    describe('having a UserFindQuery with an email', () => {
      let userFindQueryFixture: UserFindQuery;

      beforeAll(() => {
        userFindQueryFixture = UserFindQueryFixtures.withEmail;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReturnValue(true);

          result = userFindQueryTypeOrmFromUserFindQueryBuilder.build(
            userFindQueryFixture,
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
          expect(queryBuilderMock.andWhere).toHaveBeenCalledTimes(1);
          expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
            `${UserDb.name}.email = :${UserDb.name}email`,
            {
              [`${UserDb.name}email`]: userFindQueryFixture.email,
            },
          );
        });

        it('should return a QueryBuilder', () => {
          expect(result).toBe(queryBuilderMock);
        });
      });
    });

    describe('having a UserFindQuery with an id', () => {
      let userFindQueryFixture: UserFindQuery;

      beforeAll(() => {
        userFindQueryFixture = UserFindQueryFixtures.withId;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReturnValue(true);

          result = userFindQueryTypeOrmFromUserFindQueryBuilder.build(
            userFindQueryFixture,
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
          expect(queryBuilderMock.andWhere).toHaveBeenCalledTimes(1);
          expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
            `${UserDb.name}.id = :${UserDb.name}id`,
            {
              [`${UserDb.name}id`]: userFindQueryFixture.id,
            },
          );
        });

        it('should return a QueryBuilder', () => {
          expect(result).toBe(queryBuilderMock);
        });
      });
    });

    describe('having a UserFindQuery with an ids with one element', () => {
      let userFindQueryFixture: UserFindQuery;

      beforeAll(() => {
        userFindQueryFixture = UserFindQueryFixtures.withIdsOne;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReturnValue(true);

          result = userFindQueryTypeOrmFromUserFindQueryBuilder.build(
            userFindQueryFixture,
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
          expect(queryBuilderMock.andWhere).toHaveBeenCalledTimes(1);
          expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
            `${UserDb.name}.id = :${UserDb.name}id`,
            {
              [`${UserDb.name}id`]: (userFindQueryFixture.ids as [string])[0],
            },
          );
        });

        it('should return a QueryBuilder', () => {
          expect(result).toBe(queryBuilderMock);
        });
      });
    });

    describe('having a UserFindQuery with an ids with two elements', () => {
      let userFindQueryFixture: UserFindQuery;

      beforeAll(() => {
        userFindQueryFixture = UserFindQueryFixtures.withIdsTwo;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReturnValue(true);

          result = userFindQueryTypeOrmFromUserFindQueryBuilder.build(
            userFindQueryFixture,
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
          expect(queryBuilderMock.andWhere).toHaveBeenCalledTimes(1);
          expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
            `${UserDb.name}.id IN (:...${UserDb.name}id)`,
            {
              [`${UserDb.name}id`]: userFindQueryFixture.ids,
            },
          );
        });

        it('should return a QueryBuilder', () => {
          expect(result).toBe(queryBuilderMock);
        });
      });
    });

    describe('having a UserFindQuery with limit', () => {
      let userFindQueryFixture: UserFindQuery;

      beforeAll(() => {
        userFindQueryFixture = UserFindQueryFixtures.withLimit;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReturnValue(true);

          result = userFindQueryTypeOrmFromUserFindQueryBuilder.build(
            userFindQueryFixture,
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
            userFindQueryFixture.limit,
          );
        });

        it('should return a QueryBuilder', () => {
          expect(result).toBe(queryBuilderMock);
        });
      });
    });

    describe('having a UserFindQuery with offset', () => {
      let userFindQueryFixture: UserFindQuery;

      beforeAll(() => {
        userFindQueryFixture = UserFindQueryFixtures.withOffset;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReturnValue(true);

          result = userFindQueryTypeOrmFromUserFindQueryBuilder.build(
            userFindQueryFixture,
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
            userFindQueryFixture.offset,
          );
        });

        it('should return a QueryBuilder', () => {
          expect(result).toBe(queryBuilderMock);
        });
      });
    });

    describe('having a UserFindQuery with sort ids and ids', () => {
      let userFindQueryFixture: UserFindQuery;

      beforeAll(() => {
        userFindQueryFixture = UserFindQueryFixtures.withIdsTwoAndSortIds;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReturnValue(true);

          result = userFindQueryTypeOrmFromUserFindQueryBuilder.build(
            userFindQueryFixture,
            queryBuilderMock,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();

          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReset();
        });

        it('should call queryBuilder.addOrderBy()', () => {
          expect(queryBuilderMock.addOrderBy).toHaveBeenCalledTimes(1);
          expect(queryBuilderMock.addOrderBy).toHaveBeenCalledWith(
            `array_position(ARRAY[:...${UserDb.name}ids], ${UserDb.name}.id)`,
          );
        });

        it('should return a QueryBuilder', () => {
          expect(result).toBe(queryBuilderMock);
        });
      });
    });

    describe('having a UserFindQuery with sort ids and no ids', () => {
      let userFindQueryFixture: UserFindQuery;

      beforeAll(() => {
        userFindQueryFixture = UserFindQueryFixtures.withNoIdsAndSortIds;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReturnValue(true);

          try {
            userFindQueryTypeOrmFromUserFindQueryBuilder.build(
              userFindQueryFixture,
              queryBuilderMock,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();

          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReset();
        });

        it('should throw an AppError', () => {
          const expectedErrorProperties: Partial<AppError> = {
            kind: AppErrorKind.unprocessableOperation,
            message:
              'Unable to sort users by ids. Reason: id list was not provided',
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedErrorProperties),
          );
        });
      });
    });
  });
});
