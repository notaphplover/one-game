import { beforeAll, afterAll, jest, it, describe, expect } from '@jest/globals';
import { setFormFieldValue } from './setFormFieldValue';

describe(setFormFieldValue.name, () => {
  let fieldNameFixture: string;
  let fieldValueFixture: string | undefined;

  describe('having a fieldName with value "name" and a fieldValue with string value', () => {
    let result: string | undefined;

    beforeAll(() => {
      fieldNameFixture = 'name';
      fieldValueFixture = 'value-fixture';

      result = setFormFieldValue(fieldNameFixture, fieldValueFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return a string value', () => {
      expect(result).toStrictEqual(fieldValueFixture);
    });
  });

  describe('having a fieldName with value "name" and a fieldValue with undefined value', () => {
    let result: string | undefined;

    beforeAll(() => {
      fieldNameFixture = 'name';
      fieldValueFixture = undefined;

      result = setFormFieldValue(fieldNameFixture, fieldValueFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return a undefined value', () => {
      expect(result).toStrictEqual(fieldValueFixture);
    });
  });

  describe('having a fieldName with a different value "name" and a fieldValue with string value', () => {
    let result: string | undefined;

    beforeAll(() => {
      fieldNameFixture = 'players';
      fieldValueFixture = '3';

      result = setFormFieldValue(fieldNameFixture, fieldValueFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return a number value', () => {
      expect(result).toStrictEqual(fieldValueFixture);
    });
  });

  describe('having a fieldName with a different value "name" and a fieldValue with undefined value', () => {
    let result: string | undefined;

    beforeAll(() => {
      fieldNameFixture = 'players';
      fieldValueFixture = undefined;

      result = setFormFieldValue(fieldNameFixture, fieldValueFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return a undefined value', () => {
      expect(result).toStrictEqual(fieldValueFixture);
    });
  });
});
