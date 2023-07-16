import { beforeAll, describe, expect, it } from '@jest/globals';

import { BcryptHashProviderBcryptAdapter } from './BcryptHashProviderBcryptAdapter';

describe(BcryptHashProviderBcryptAdapter.name, () => {
  let bcryptHashProviderBcryptAdapter: BcryptHashProviderBcryptAdapter;

  beforeAll(() => {
    bcryptHashProviderBcryptAdapter = new BcryptHashProviderBcryptAdapter();
  });

  describe('.hash', () => {
    let textFixture: string;

    beforeAll(() => {
      textFixture = 'Sample text';
    });

    describe('when called', () => {
      let hashResult: string;

      beforeAll(async () => {
        hashResult = await bcryptHashProviderBcryptAdapter.hash(textFixture);
      });

      describe('when called .verifyR()', () => {
        let verifyResult: boolean;

        beforeAll(async () => {
          verifyResult = await bcryptHashProviderBcryptAdapter.verify(
            textFixture,
            hashResult,
          );
        });

        it('should return true', () => {
          expect(verifyResult).toBe(true);
        });
      });
    });
  });
});
