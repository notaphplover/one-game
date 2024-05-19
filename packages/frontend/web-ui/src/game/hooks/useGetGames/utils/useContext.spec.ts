import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../../../app/store/hooks');

import { useAppSelector } from '../../../../app/store/hooks';
import { UseGetGamesContext } from '../models/UseGetGamesContext';
import { useContext } from './useContext';

describe(useContext.name, () => {
  describe('when called, and useAppSelector returns an authenticated AuthState', () => {
    let tokenFixture: string;

    let result: unknown;

    beforeAll(() => {
      tokenFixture = 'token-fixture';

      (useAppSelector as jest.Mock<typeof useAppSelector>).mockReturnValueOnce(
        tokenFixture,
      );

      result = useContext();
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call useAppSelector()', () => {
      expect(useAppSelector).toHaveBeenCalledTimes(1);
      expect(useAppSelector).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should return token', () => {
      const expected: { context: UseGetGamesContext } = {
        context: {
          token: tokenFixture,
        },
      };

      expect(result).toStrictEqual(expected);
    });
  });

  describe('when called, and useAppSelector returns a non authenticated AuthState', () => {
    let result: unknown;

    beforeAll(() => {
      (useAppSelector as jest.Mock<typeof useAppSelector>).mockReturnValueOnce(
        null,
      );

      result = useContext();
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call useAppSelector()', () => {
      expect(useAppSelector).toHaveBeenCalledTimes(1);
      expect(useAppSelector).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should return null', () => {
      const expected: { context: UseGetGamesContext } = {
        context: {
          token: null,
        },
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
