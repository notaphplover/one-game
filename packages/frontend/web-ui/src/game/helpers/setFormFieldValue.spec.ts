import { beforeAll, afterAll, jest, it, describe, expect } from '@jest/globals';
import { setFormFieldValue } from './setFormFieldValue';

describe(setFormFieldValue.name, () => {
  let fieldNameFixture: string;
  let fieldValueFixture: string;

  describe('having a fieldName with value "name"', () => {
    let result: string | number;

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

  describe('having a fieldName with different value "name"', () => {
    let result: string | number;

    beforeAll(() => {
      fieldNameFixture = 'players';
      fieldValueFixture = '3';

      result = setFormFieldValue(fieldNameFixture, fieldValueFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return a number value', () => {
      expect(result).toStrictEqual(parseInt(fieldValueFixture));
    });
  });
});
