import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { findByBatchIds } from './findByBatchIds';

describe(findByBatchIds.name, () => {
  let getIdMock: jest.Mock<(entity: unknown) => string>;
  let findByIdsMock: jest.Mock<(ids: string[]) => Promise<unknown[]>>;

  beforeAll(() => {
    getIdMock = jest.fn();
    findByIdsMock = jest.fn();
  });

  describe('having two equal ids', () => {
    let idFixture: string;
    let idsFixture: string[];

    beforeAll(() => {
      idFixture = 'id-fixture';
      idsFixture = [idFixture, idFixture];
    });

    describe('when called, and findByIds() returns empty array', () => {
      let result: unknown;

      beforeAll(async () => {
        findByIdsMock.mockResolvedValueOnce([]);

        result = await findByBatchIds(getIdMock, findByIdsMock)(idsFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call findByIds()', () => {
        expect(findByIdsMock).toHaveBeenCalledTimes(1);
        expect(findByIdsMock).toHaveBeenCalledWith(idsFixture);
      });

      it('should return empty array', () => {
        expect(result).toStrictEqual(new Array(2));
      });
    });

    describe('when called, and findByIds() returns single entity and getId() returns id', () => {
      let entityFixture: unknown;

      let result: unknown;

      beforeAll(async () => {
        entityFixture = Symbol();

        getIdMock.mockReturnValueOnce(idFixture);
        findByIdsMock.mockResolvedValueOnce([entityFixture]);

        result = await findByBatchIds(getIdMock, findByIdsMock)(idsFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call findByIds()', () => {
        expect(findByIdsMock).toHaveBeenCalledTimes(1);
        expect(findByIdsMock).toHaveBeenCalledWith(idsFixture);
      });

      it('should call getId()', () => {
        expect(getIdMock).toHaveBeenCalledTimes(1);
        expect(getIdMock).toHaveBeenCalledWith(entityFixture);
      });

      it('should return expected result', () => {
        expect(result).toStrictEqual([entityFixture, entityFixture]);
      });
    });
  });

  describe('having two different ids', () => {
    let firstIdFixture: string;
    let secondIdFixture: string;
    let idsFixture: string[];

    beforeAll(() => {
      firstIdFixture = 'first-id-fixture';
      secondIdFixture = 'second-id-fixture';

      idsFixture = [firstIdFixture, secondIdFixture];
    });

    describe('when called, and findByIds() returns single entity and getId() returns second id', () => {
      let entityFixture: unknown;

      let result: unknown;

      beforeAll(async () => {
        entityFixture = Symbol();

        getIdMock.mockReturnValueOnce(secondIdFixture);
        findByIdsMock.mockResolvedValueOnce([entityFixture]);

        result = await findByBatchIds(getIdMock, findByIdsMock)(idsFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call findByIds()', () => {
        expect(findByIdsMock).toHaveBeenCalledTimes(1);
        expect(findByIdsMock).toHaveBeenCalledWith(idsFixture);
      });

      it('should call getId()', () => {
        expect(getIdMock).toHaveBeenCalledTimes(1);
        expect(getIdMock).toHaveBeenCalledWith(entityFixture);
      });

      it('should return expected result', () => {
        const expected: unknown[] = new Array(2);
        expected[1] = entityFixture;

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
