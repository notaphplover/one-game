import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';

import { getCardColorClassName } from './getCardColorClassName';

describe(getCardColorClassName.name, () => {
  let colorMock: apiModels.CardColorV1;

  describe('having a color with value blue', () => {
    let result: string;

    beforeAll(() => {
      colorMock = 'blue';
      result = getCardColorClassName(colorMock);
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
      colorMock = 'red';
      result = getCardColorClassName(colorMock);
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
      colorMock = 'green';
      result = getCardColorClassName(colorMock);
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
      colorMock = 'yellow';
      result = getCardColorClassName(colorMock);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return an yellow-card className', () => {
      expect(result).toBe('yellow-card');
    });
  });
});
