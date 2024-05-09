import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { getInitialUserState } from './getInitialUserState';
import { UserState } from './models/UserState';
import { UserStateStatus } from './models/UserStateStatus';

describe(getInitialUserState.name, () => {
  let getItemSpy: jest.SpiedFunction<typeof window.localStorage.getItem>;

  beforeAll(() => {
    getItemSpy = jest.spyOn(
      /*
       * JS dom env used by jest is using a proxy to provide window.localStorage.
       * This collides with the jest.SpyOn implementation which relies in replacing the original
       * property with a mock function.
       *
       * The only workaround is spying the method available in the prototype of the object, which
       * is actually not a proxy
       */
      Object.getPrototypeOf(window.localStorage),
      'getItem',
    );
  });

  describe('when called, localStorage.getItem() returns null', () => {
    let result: UserState;

    beforeAll(() => {
      result = getInitialUserState();
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call localStorage.getItem() once', () => {
      expect(getItemSpy).toHaveBeenCalledTimes(1);
      expect(getItemSpy).toHaveBeenCalledWith('userId');
    });

    it('should return an initial state without userId', () => {
      const expected: UserState = { status: UserStateStatus.idle };

      expect(result).toStrictEqual(expected);
    });
  });

  describe('when called, localStorage.getItem() returns string', () => {
    let userIdFixture: string;
    let result: UserState;

    beforeAll(() => {
      userIdFixture = 'userId-fixture';

      window.localStorage.setItem('userId', userIdFixture);
      result = getInitialUserState();
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call localStorage.getItem() once', () => {
      expect(getItemSpy).toHaveBeenCalledTimes(1);
      expect(getItemSpy).toHaveBeenCalledWith('userId');
    });

    it('should return an initial state with accessToken and refreshToken', () => {
      const expected: UserState = {
        status: UserStateStatus.fulfilled,
        userId: userIdFixture,
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
