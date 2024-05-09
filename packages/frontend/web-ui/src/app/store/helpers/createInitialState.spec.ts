import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { createInitialState } from './createInitialState';
import { AuthState } from './models/AuthState';
import { AuthStateStatus } from './models/AuthStateStatus';

describe(createInitialState.name, () => {
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
    let result: AuthState;

    beforeAll(() => {
      result = createInitialState();
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call localStorage.getItem() twice', () => {
      expect(getItemSpy).toHaveBeenCalledTimes(2);
      expect(getItemSpy).toHaveBeenCalledWith('accessToken');
      expect(getItemSpy).toHaveBeenCalledWith('refreshToken');
    });

    it('should return an initial state without accessToken and refreshToken', () => {
      const expected: AuthState = { status: AuthStateStatus.nonAuthenticated };

      expect(result).toStrictEqual(expected);
    });
  });

  describe('when called, localStorage.getItem() returns string', () => {
    let accessTokenFixture: string;
    let refreshTokenFixture: string;
    let result: AuthState;

    beforeAll(() => {
      accessTokenFixture = 'accessToken-fixture';
      refreshTokenFixture = 'refreshToken-fixture';

      window.localStorage.setItem('accessToken', accessTokenFixture);
      window.localStorage.setItem('refreshToken', refreshTokenFixture);

      result = createInitialState();
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call localStorage.getItem() twice', () => {
      expect(getItemSpy).toHaveBeenCalledTimes(2);
      expect(getItemSpy).toHaveBeenCalledWith('accessToken');
    });

    it('should return an initial state with accessToken and refreshToken', () => {
      const expected: AuthState = {
        accessToken: accessTokenFixture,
        refreshToken: refreshTokenFixture,
        status: AuthStateStatus.authenticated,
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
