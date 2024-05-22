import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../../../app/store/hooks');

import { FulfilledUserState } from '../../../../app/store/helpers/models/UserState';
import { UserStateStatus } from '../../../../app/store/helpers/models/UserStateStatus';
import { useAppSelector } from '../../../../app/store/hooks';
import { UseJoinGameContext } from '../models/UseJoinGameContext';
import { useContext } from './useContext';

describe(useContext.name, () => {
  describe('when called, and useAppSelector returns an authenticated AuthState', () => {
    let tokenFixture: string;
    let userIdFixture: FulfilledUserState;

    let result: unknown;

    beforeAll(() => {
      tokenFixture = 'token-fixture';
      userIdFixture = {
        status: UserStateStatus.fulfilled,
        userId: 'userId-fixture',
      };

      (useAppSelector as jest.Mock<typeof useAppSelector>).mockReturnValueOnce(
        tokenFixture,
      );

      (useAppSelector as jest.Mock<typeof useAppSelector>).mockReturnValueOnce(
        userIdFixture,
      );

      result = useContext();
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call useAppSelector()', () => {
      expect(useAppSelector).toHaveBeenCalledTimes(2);
      expect(useAppSelector).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should return token', () => {
      const expected: { context: UseJoinGameContext } = {
        context: { token: tokenFixture, userId: userIdFixture.userId },
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

      (useAppSelector as jest.Mock<typeof useAppSelector>).mockReturnValueOnce(
        null,
      );

      result = useContext();
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call useAppSelector()', () => {
      expect(useAppSelector).toHaveBeenCalledTimes(2);
      expect(useAppSelector).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should return null', () => {
      const expected: { context: UseJoinGameContext } = {
        context: { token: null, userId: null },
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
