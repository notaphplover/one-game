import { beforeAll, describe, expect, it } from '@jest/globals';
import authSlice from './authSlice';
import { createAuthByToken } from '../thunk/createAuthByToken';
import {
  CreateAuthByCredentialsParams,
  createAuthByCredentials,
} from '../thunk/createAuthByCredentials';
import { PayloadAction, UnknownAction } from '@reduxjs/toolkit';
import {
  AuthState,
  NonAuthenticatedAuthState,
  PendingAuthState,
} from '../helpers/models/AuthState';
import { AuthStateStatus } from '../helpers/models/AuthStateStatus';
import { SerializableResponse } from '../../../common/http/models/SerializedResponse';
import { AuthV1, ErrorV1 } from '@cornie-js/api-models/lib/models/types';
import { AuthSerializedResponse } from '../../../common/http/models/AuthSerializedResponse';

describe('authSlice', () => {
  describe('having no state and no action', () => {
    let stateFixture: undefined;
    let actionFixture: UnknownAction;

    beforeAll(() => {
      stateFixture = undefined;
      actionFixture = {
        type: 'unknown-action',
      };
    });

    describe('when authSlice.reducer() is called', () => {
      let result: unknown;

      beforeAll(() => {
        result = authSlice.reducer(stateFixture, actionFixture);
      });

      it('should return a state', () => {
        const expected: AuthState = {
          status: AuthStateStatus.nonAuthenticated,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having an state and no action', () => {
    let stateFixture: NonAuthenticatedAuthState;
    let actionFixture: UnknownAction;

    beforeAll(() => {
      stateFixture = {
        status: AuthStateStatus.nonAuthenticated,
      };
      actionFixture = {
        type: 'unknown-action',
      };
    });

    describe('when authSlice.reducer() is called', () => {
      let result: unknown;

      beforeAll(() => {
        result = authSlice.reducer(stateFixture, actionFixture);
      });

      it('should return a state', () => {
        expect(result).toStrictEqual(stateFixture);
      });
    });
  });

  describe('having a non authenticated state and a createAuthByToken pending action', () => {
    let stateFixture: NonAuthenticatedAuthState;
    let actionFixture: PayloadAction<undefined>;

    beforeAll(() => {
      stateFixture = {
        status: AuthStateStatus.nonAuthenticated,
      };
      actionFixture = createAuthByToken.pending(
        'arg-1-fixture',
        'arg-2-fixture',
      );
    });

    describe('when authSlice.reducer() is called', () => {
      let result: unknown;

      beforeAll(() => {
        result = authSlice.reducer(stateFixture, actionFixture);
      });

      it('should return a state', () => {
        const expected: AuthState = {
          status: AuthStateStatus.pending,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a pending state and a createAuthByToken fulfilled action with an HTTP OK status code 200', () => {
    let stateFixture: PendingAuthState;
    let actionFixture: PayloadAction<AuthSerializedResponse>;
    let payloadFixture: SerializableResponse<AuthV1, 200>;

    beforeAll(() => {
      payloadFixture = {
        body: {
          jwt: 'jwt-fixture',
        },
        statusCode: 200,
      };
      stateFixture = {
        status: AuthStateStatus.pending,
      };
      actionFixture = createAuthByToken.fulfilled(
        payloadFixture,
        'arg-1-fixture',
        'arg-2-fixture',
      );
    });

    describe('when authSlice.reducer() is called', () => {
      let result: unknown;

      beforeAll(() => {
        result = authSlice.reducer(stateFixture, actionFixture);
      });

      it('should return a state', () => {
        const expected: AuthState = {
          status: AuthStateStatus.authenticated,
          token: payloadFixture.body.jwt,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a pending state and a createAuthByToken fulfilled action with an HTTP BAD REQUEST status code 400', () => {
    let stateFixture: PendingAuthState;
    let actionFixture: PayloadAction<AuthSerializedResponse>;
    let payloadFixture: SerializableResponse<ErrorV1, 400>;

    beforeAll(() => {
      payloadFixture = {
        body: {
          description: 'error-fixture',
        },
        statusCode: 400,
      };
      stateFixture = {
        status: AuthStateStatus.pending,
      };
      actionFixture = createAuthByToken.fulfilled(
        payloadFixture,
        'arg-1-fixture',
        'arg-2-fixture',
      );
    });

    describe('when authSlice.reducer() is called', () => {
      let result: unknown;

      beforeAll(() => {
        result = authSlice.reducer(stateFixture, actionFixture);
      });

      it('should return a state', () => {
        const expected: AuthState = {
          status: AuthStateStatus.nonAuthenticated,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a non authenticated state and a createAuthByCredentials pending action', () => {
    let stateFixture: NonAuthenticatedAuthState;
    let actionFixture: PayloadAction<undefined>;
    let createAuthByCredentialsParamsFixture: CreateAuthByCredentialsParams;

    beforeAll(() => {
      stateFixture = {
        status: AuthStateStatus.nonAuthenticated,
      };
      createAuthByCredentialsParamsFixture = {
        email: 'email-fixture',
        password: 'password-fixture',
      };
      actionFixture = createAuthByCredentials.pending(
        'arg-1-fixture',
        createAuthByCredentialsParamsFixture,
      );
    });

    describe('when authSlice.reducer() is called', () => {
      let result: unknown;

      beforeAll(() => {
        result = authSlice.reducer(stateFixture, actionFixture);
      });

      it('should return a state', () => {
        const expected: AuthState = {
          status: AuthStateStatus.pending,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a pending state and a createAuthByCredentials fulfilled action with an HTTP OK status code 200', () => {
    let stateFixture: PendingAuthState;
    let actionFixture: PayloadAction<AuthSerializedResponse>;
    let payloadFixture: SerializableResponse<AuthV1, 200>;
    let createAuthByCredentialsParamsFixture: CreateAuthByCredentialsParams;

    beforeAll(() => {
      payloadFixture = {
        body: {
          jwt: 'jwt-fixture',
        },
        statusCode: 200,
      };
      stateFixture = {
        status: AuthStateStatus.pending,
      };
      createAuthByCredentialsParamsFixture = {
        email: 'email-fixture',
        password: 'password-fixture',
      };
      actionFixture = createAuthByCredentials.fulfilled(
        payloadFixture,
        'arg-1-fixture',
        createAuthByCredentialsParamsFixture,
      );
    });

    describe('when authSlice.reducer() is called', () => {
      let result: unknown;

      beforeAll(() => {
        result = authSlice.reducer(stateFixture, actionFixture);
      });

      it('should return a state', () => {
        const expected: AuthState = {
          status: AuthStateStatus.authenticated,
          token: payloadFixture.body.jwt,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a pending state and a createAuthByCredentials fulfilled action with an HTTP BAD REQUEST status code 400', () => {
    let stateFixture: PendingAuthState;
    let actionFixture: PayloadAction<AuthSerializedResponse>;
    let payloadFixture: SerializableResponse<ErrorV1, 400>;
    let createAuthByCredentialsParamsFixture: CreateAuthByCredentialsParams;

    beforeAll(() => {
      payloadFixture = {
        body: {
          description: 'error-fixture',
        },
        statusCode: 400,
      };
      stateFixture = {
        status: AuthStateStatus.pending,
      };
      createAuthByCredentialsParamsFixture = {
        email: 'email-fixture',
        password: 'password-fixture',
      };
      actionFixture = createAuthByCredentials.fulfilled(
        payloadFixture,
        'arg-1-fixture',
        createAuthByCredentialsParamsFixture,
      );
    });

    describe('when authSlice.reducer() is called', () => {
      let result: unknown;

      beforeAll(() => {
        result = authSlice.reducer(stateFixture, actionFixture);
      });

      it('should return a state', () => {
        const expected: AuthState = {
          status: AuthStateStatus.nonAuthenticated,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
