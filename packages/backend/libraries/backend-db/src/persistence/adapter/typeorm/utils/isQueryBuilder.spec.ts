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
    isDeleteQueryBuilder: jest.fn() as unknown as (
      obj: unknown,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) => obj is DeleteQueryBuilder<any>,
    isInsertQueryBuilder: jest.fn() as unknown as (
      obj: unknown,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) => obj is InsertQueryBuilder<any>,
    isRelationQueryBuilder: jest.fn() as unknown as (
      obj: unknown,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) => obj is RelationQueryBuilder<any>,
    isSelectQueryBuilder: jest.fn() as unknown as (
      obj: unknown,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) => obj is SelectQueryBuilder<any>,
    isSoftDeleteQueryBuilder: jest.fn() as unknown as (
      obj: unknown,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) => obj is SoftDeleteQueryBuilder<any>,
    isUpdateQueryBuilder: jest.fn() as unknown as (
      obj: unknown,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) => obj is UpdateQueryBuilder<any>,
  } as typeof InstanceChecker;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    ...originalTypeOrmModule,
    InstanceChecker: instanceCheckerMock,
  };
});

import {
  DeleteQueryBuilder,
  InsertQueryBuilder,
  InstanceChecker,
  RelationQueryBuilder,
  SelectQueryBuilder,
  UpdateQueryBuilder,
} from 'typeorm';
import { SoftDeleteQueryBuilder } from 'typeorm/query-builder/SoftDeleteQueryBuilder.js';

import { isQueryBuilder } from './isQueryBuilder';

const instanceCheckerMethods: (keyof typeof InstanceChecker)[] = [
  'isDeleteQueryBuilder',
  'isInsertQueryBuilder',
  'isRelationQueryBuilder',
  'isSelectQueryBuilder',
  'isSoftDeleteQueryBuilder',
  'isUpdateQueryBuilder',
];

describe(isQueryBuilder.name, () => {
  let objectFixture: unknown;

  beforeAll(() => {
    objectFixture = Symbol();
  });

  describe.each<keyof typeof InstanceChecker>(instanceCheckerMethods)(
    'when called, and InstanceChecker.%s returns true',
    (method: keyof typeof InstanceChecker) => {
      let result: unknown;

      beforeAll(() => {
        (
          InstanceChecker[method] as unknown as jest.Mock<() => boolean>
        ).mockReturnValueOnce(true);

        result = isQueryBuilder(objectFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it(`should call InstanceChecker.${method}()`, () => {
        expect(InstanceChecker[method]).toHaveBeenCalledTimes(1);
        expect(InstanceChecker[method]).toHaveBeenCalledWith(objectFixture);
      });

      it('should return true', () => {
        expect(result).toBe(true);
      });
    },
  );

  describe('when called, and InstanceChecker methods return false', () => {
    let result: unknown;

    beforeAll(() => {
      for (const method of instanceCheckerMethods) {
        (
          InstanceChecker[method] as unknown as jest.Mock<() => boolean>
        ).mockReturnValueOnce(false);
      }

      result = isQueryBuilder(objectFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return fallse', () => {
      expect(result).toBe(false);
    });
  });
});
