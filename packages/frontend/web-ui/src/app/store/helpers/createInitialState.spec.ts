import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { createInitialState } from './createInitialState';
import { AuthState } from './models/AuthState';
import {
  STATUS_AUTH_AUTHENTICATED,
  STATUS_AUTH_NOT_AUTHENTICATED,
} from '../data/authSliceStatus';

describe(createInitialState.name, () => {
  let getItemSpy: jest.SpiedFunction<any>;

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

    it('should call localStorage.getItem()', () => {
      expect(getItemSpy).toHaveBeenCalledTimes(1);
      expect(getItemSpy).toHaveBeenCalledWith('token');
    });

    it('should return an initial state without token', () => {
      expect(result).toStrictEqual({
        status: STATUS_AUTH_NOT_AUTHENTICATED,
        token: null,
        errorMessage: null,
      });
    });
  });

  describe('when called, localStorage.getItem() returns string', () => {
    let tokenFixture: string;
    let result: AuthState;

    beforeAll(() => {
      tokenFixture = 'token-fixture';

      window.localStorage.setItem('token', tokenFixture);

      result = createInitialState();
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call localStorage.getItem()', () => {
      expect(getItemSpy).toHaveBeenCalledTimes(1);
      expect(getItemSpy).toHaveBeenCalledWith('token');
    });

    it('should return an initial state with token', () => {
      expect(result).toStrictEqual({
        status: STATUS_AUTH_AUTHENTICATED,
        token: tokenFixture,
        errorMessage: null,
      });
    });
  });
});
