import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';

import { getCardColorClassName } from './getCardColorClassName';

describe(getCardColorClassName.name, () => {
  let colorFixture: apiModels.CardColorV1;

  describe('having a color with value blue', () => {
    let result: string;

    beforeAll(() => {
      colorFixture = 'blue';
      result = getCardColorClassName(colorFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return an blue-card className', () => {
      expect(result).toBe('blue-card');
    });
  });

  describe('having a color with value red', () => {
    let result: string;

    beforeAll(() => {
      colorFixture = 'red';
      result = getCardColorClassName(colorFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return an red-card className', () => {
      expect(result).toBe('red-card');
    });
  });

  describe('having a color with value green', () => {
    let result: string;

    beforeAll(() => {
      colorFixture = 'green';
      result = getCardColorClassName(colorFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return an green-card className', () => {
      expect(result).toBe('green-card');
    });
  });

  describe('having a color with value yellow', () => {
    let result: string;

    beforeAll(() => {
      colorFixture = 'yellow';
      result = getCardColorClassName(colorFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return an yellow-card className', () => {
      expect(result).toBe('yellow-card');
    });
  });
});
