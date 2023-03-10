import { beforeAll, describe, expect, it } from '@jest/globals';

import { readApiJsonSchemas } from './readApiJsonSchemas';

describe(readApiJsonSchemas.name, () => {
  describe('when called', () => {
    let result: unknown;

    beforeAll(async () => {
      result = await readApiJsonSchemas();
    });

    it('should return a JSON schema array', () => {
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
