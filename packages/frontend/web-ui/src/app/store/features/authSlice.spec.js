import { beforeAll, describe, expect, it } from '@jest/globals';
import authSlice from './authSlice';
import { createAuthByToken } from '../thunk/createAuthByToken';

describe('authSlice', () => {
  describe('having no state and no action', () => {
    let stateFixture;
    let actionFixture;

    beforeAll(() => {
      stateFixture = undefined;
      actionFixture = {};
    });

    describe('when authSlice.reducer() is called', () => {
      let result;

      beforeAll(() => {
        result = authSlice.reducer(stateFixture, actionFixture);
      });

      it('should return a state', () => {
        expect(result).toStrictEqual({
          status: 'not-authenticated',
          token: null,
          errorMessage: null,
        });
      });
    });
  });

  describe('having an state and no action', () => {
    let stateFixture;
    let actionFixture;

    beforeAll(() => {
      stateFixture = {
        foo: 'bar',
      };
      actionFixture = {};
    });

    describe('when authSlice.reducer() is called', () => {
      let result;

      beforeAll(() => {
        result = authSlice.reducer(stateFixture, actionFixture);
      });

      it('should return a state', () => {
        expect(result).toStrictEqual(stateFixture);
      });
    });
  });

  describe('having a non authenticated state and a createAuthByToken pending action', () => {
    let stateFixture;
    let actionFixture;

    beforeAll(() => {
      stateFixture = {
        status: 'not-authenticated',
        token: null,
        errorMessage: null,
      };
      actionFixture = createAuthByToken.pending();
    });

    describe('when authSlice.reducer() is called', () => {
      let result;

      beforeAll(() => {
        result = authSlice.reducer(stateFixture, actionFixture);
      });

      it('should return a state', () => {
        expect(result).toStrictEqual({
          status: 'checking',
          token: null,
          errorMessage: null,
        });
      });
    });
  });

  describe('having a checking state and a createAuthByToken fulfilled action with an HTTP OK status code', () => {
    let payloadFixture;
    let stateFixture;
    let actionFixture;

    beforeAll(() => {
      payloadFixture = {
        body: {
          jwt: 'jwt-fixture',
        },
        statusCode: 200,
      };
      stateFixture = {
        status: 'checking',
        token: null,
        errorMessage: null,
      };
      actionFixture = createAuthByToken.fulfilled(payloadFixture);
    });

    describe('when authSlice.reducer() is called', () => {
      let result;

      beforeAll(() => {
        result = authSlice.reducer(stateFixture, actionFixture);
      });

      it('should return a state', () => {
        expect(result).toStrictEqual({
          status: 'authenticated',
          token: payloadFixture.body.jwt,
          errorMessage: null,
        });
      });
    });
  });

  describe('having a checking state and a createAuthByToken fulfilled action with an HTTP UNPROCESSABLE ENTITY status code', () => {
    let payloadFixture;
    let stateFixture;
    let actionFixture;

    beforeAll(() => {
      payloadFixture = {
        body: {},
        statusCode: 422,
      };
      stateFixture = {
        status: 'checking',
        token: null,
        errorMessage: null,
      };
      actionFixture = createAuthByToken.fulfilled(payloadFixture);
    });

    describe('when authSlice.reducer() is called', () => {
      let result;

      beforeAll(() => {
        result = authSlice.reducer(stateFixture, actionFixture);
      });

      it('should return a state', () => {
        expect(result).toStrictEqual({
          status: 'not-authenticated',
          token: null,
          errorMessage: 'Unprocessable operation. Try again.',
        });
      });
    });
  });

  describe('having a checking state and a createAuthByToken fulfilled action with another HTTP status code', () => {
    let payloadFixture;
    let stateFixture;
    let actionFixture;

    beforeAll(() => {
      payloadFixture = {
        body: {},
        statusCode: 500,
      };
      stateFixture = {
        status: 'checking',
        token: null,
        errorMessage: null,
      };
      actionFixture = createAuthByToken.fulfilled(payloadFixture);
    });

    describe('when authSlice.reducer() is called', () => {
      let result;

      beforeAll(() => {
        result = authSlice.reducer(stateFixture, actionFixture);
      });

      it('should return a state', () => {
        expect(result).toStrictEqual({
          status: 'not-authenticated',
          token: null,
          errorMessage: 'Ups... something strange happened. Try again?',
        });
      });
    });
  });
});
