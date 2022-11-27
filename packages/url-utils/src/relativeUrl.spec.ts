import { beforeAll, describe, expect, it } from '@jest/globals';

import { relativeUrl } from './relativeUrl';

describe(relativeUrl.name, () => {
  describe.each<[string, string]>([
    ['http://sample-domain.com/', 'http://sample-domain.com/'],
    ['http://sample-domain.com:45678/', 'http://sample-domain.com:45678/'],
    ['http://sample-domain.com/foo', 'http://sample-domain.com/'],
    ['http://sample-domain.com/foo', 'http://sample-domain.com/#g'],
    ['http://sample-domain.com/foo', 'http://sample-domain.com/foo'],
    ['http://sample-domain.com/foo', 'http://sample-domain.com/foo#g'],
    ['http://sample-domain.com/foo/bar', 'http://sample-domain.com/'],
    ['http://sample-domain.com/foo/bar', 'http://sample-domain.com/foo'],
    ['http://sample-domain.com/foo/bar', 'http://sample-domain.com/foo#g'],
    ['http://sample-domain.com/foo/bar', 'http://sample-domain.com/#g'],
  ])(
    'having two urls with common origin (from: "%s", to: "%s")',
    (fromUrl: string, toUrl: string): void => {
      describe('when called', () => {
        let relativeUrlResult: string;

        beforeAll(() => {
          relativeUrlResult = relativeUrl(fromUrl, toUrl);
        });

        describe('when called new URL with relative url and from URL as base', () => {
          let toUrlInstance: URL;
          let urlResult: URL;

          beforeAll(() => {
            toUrlInstance = new URL(toUrl);
            urlResult = new URL(relativeUrlResult, fromUrl);
          });

          it('should return to URL', () => {
            expect(urlResult).toStrictEqual(toUrlInstance);
          });
        });
      });
    },
  );
});
