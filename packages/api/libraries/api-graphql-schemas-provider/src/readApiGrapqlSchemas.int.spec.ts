import { beforeAll, describe, expect, it } from '@jest/globals';

import { readApiGraphqlSchemas } from './readApiGrapqlSchemas';

describe(readApiGraphqlSchemas.name, () => {
  describe('when called', () => {
    let result: unknown;

    beforeAll(async () => {
      result = await readApiGraphqlSchemas();
    });

    it('should return a JSON schema array', () => {
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
