import { beforeAll, describe, expect, it } from '@jest/globals';
import { buildErrorMessage } from './buildErrorMessage';
import { UNEXPECTED_ERROR_MESSAGE } from './unexpectedErrorMessage';

describe(buildErrorMessage.name, () => {
  describe('when called', () => {
    let result: unknown;

    beforeAll(() => {
      result = buildErrorMessage();
    });

    it('should return string', () => {
      expect(result).toBe(UNEXPECTED_ERROR_MESSAGE);
    });
  });
});
