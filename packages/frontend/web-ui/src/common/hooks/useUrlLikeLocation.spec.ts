import { beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('react-router');

jest.mock('../models/UrlLikeLocation');

import { Location, useLocation } from 'react-router';

import { UrlLikeLocation } from '../models/UrlLikeLocation';
import { Writable } from '../models/Writable';
import { useUrlLikeLocation } from './useUrlLikeLocation';

describe(UrlLikeLocation.name, () => {
  describe('when called', () => {
    let locationFixture: Location;
    let pathNameFixture: string;

    let result: unknown;

    beforeAll(() => {
      locationFixture = Symbol() as unknown as Location;
      pathNameFixture = 'pathname-fixture';

      (useLocation as jest.Mock<typeof useLocation>).mockReturnValueOnce(
        locationFixture,
      );

      (
        UrlLikeLocation as unknown as jest.Mock<
          (this: Writable<UrlLikeLocation>) => void
        >
      ).mockImplementationOnce(function (this: Writable<UrlLikeLocation>) {
        this.pathname = pathNameFixture;
      });

      result = useUrlLikeLocation();
    });

    it('should call useLocation', () => {
      expect(useLocation).toHaveBeenCalledTimes(1);
      expect(useLocation).toHaveBeenCalledWith();
    });

    it('should call UrlLikeLocation()', () => {
      expect(UrlLikeLocation).toHaveBeenCalledTimes(1);
      expect(UrlLikeLocation).toHaveBeenCalledWith(locationFixture);
    });

    it('should return expected result', () => {
      const expectedProperties: Partial<UrlLikeLocation> = {
        pathname: pathNameFixture,
      };

      expect(result).toStrictEqual(expect.objectContaining(expectedProperties));
    });
  });
});
