import { beforeAll, describe, expect, it } from '@jest/globals';

import { Location } from 'react-router-dom';

import { UrlLikeLocation } from './UrlLikeLocation';

describe(UrlLikeLocation.name, () => {
  describe.each<
    [string, Location, (locationFixture: Location) => Partial<UrlLikeLocation>]
  >([
    [
      'with empty query',
      {
        hash: '',
        key: 'sample-key',
        pathname: '/',
        search: '',
        state: undefined,
      },
      (locationFixture: Location): Partial<UrlLikeLocation> => ({
        pathname: locationFixture.pathname,
        searchParams: new URLSearchParams(),
      }),
    ],
    [
      'with query with single value',
      {
        hash: '',
        key: 'sample-key',
        pathname: '/foo',
        search: '?bar=baz',
        state: undefined,
      },
      (locationFixture: Location): Partial<UrlLikeLocation> => ({
        pathname: locationFixture.pathname,
        searchParams: new URLSearchParams([['bar', 'baz']]),
      }),
    ],
    [
      'with query with multiple values',
      {
        hash: '',
        key: 'sample-key',
        pathname: '/foo',
        search: '?bar=baz&bar=baz2',
        state: undefined,
      },
      (locationFixture: Location): Partial<UrlLikeLocation> => ({
        pathname: locationFixture.pathname,
        searchParams: new URLSearchParams([
          ['bar', 'baz'],
          ['bar', 'baz2'],
        ]),
      }),
    ],
  ])(
    'having a Location %s',
    (
      _: string,
      locationFixture: Location,
      buildExpectedUrlLikeLocation: (
        locationFixture: Location,
      ) => Partial<UrlLikeLocation>,
    ) => {
      describe('when called', () => {
        let result: UrlLikeLocation;

        beforeAll(() => {
          result = new UrlLikeLocation(locationFixture);
        });

        it('should return expected UrlLikeLocation', () => {
          const expected: Partial<UrlLikeLocation> =
            buildExpectedUrlLikeLocation(locationFixture);

          expect(result).toStrictEqual(expect.objectContaining(expected));
        });
      });
    },
  );
});
