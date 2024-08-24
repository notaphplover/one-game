import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { PayloadAction, UnknownAction } from '@reduxjs/toolkit';

import { AuthSerializedResponse } from '../../../common/http/models/AuthSerializedResponse';
import { SerializableResponse } from '../../../common/http/models/SerializedResponse';
import login from '../actions/login';
import logout from '../actions/logout';
import {
  AuthenticatedAuthState,
  AuthState,
  NonAuthenticatedAuthState,
  PendingAuthState,
} from '../helpers/models/AuthState';
import { AuthStateStatus } from '../helpers/models/AuthStateStatus';
import {
  createAuthByCredentials,
  CreateAuthByCredentialsParams,
} from '../thunk/createAuthByCredentials';
import { createAuthByRefreshToken } from '../thunk/createAuthByRefreshToken';
import { createAuthByToken } from '../thunk/createAuthByToken';
import authSlice from './authSlice';

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
    let payloadFixture: SerializableResponse<apiModels.AuthV2, 200>;

    beforeAll(() => {
      payloadFixture = {
        body: {
          accessToken: 'accessToken-fixture',
          refreshToken: 'refreshToken-fixture',
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

      it('should save accessToken and refreshToken in Local Storage', () => {
        const accessTokenStorage: string | null =
          window.localStorage.getItem('accessToken');
        const refreshTokenStorage: string | null =
          window.localStorage.getItem('refreshToken');

        expect(accessTokenStorage).toBe(payloadFixture.body.accessToken);
        expect(refreshTokenStorage).toBe(payloadFixture.body.refreshToken);
      });

      it('should return a state', () => {
        const expected: AuthState = {
          accessToken: payloadFixture.body.accessToken,
          refreshToken: payloadFixture.body.refreshToken,
          status: AuthStateStatus.authenticated,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a pending state and a createAuthByToken fulfilled action with an HTTP BAD REQUEST status code 400', () => {
    let stateFixture: PendingAuthState;
    let actionFixture: PayloadAction<AuthSerializedResponse>;
    let payloadFixture: SerializableResponse<apiModels.ErrorV1, 400>;

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
    let payloadFixture: SerializableResponse<apiModels.AuthV2, 200>;
    let createAuthByCredentialsParamsFixture: CreateAuthByCredentialsParams;

    beforeAll(() => {
      payloadFixture = {
        body: {
          accessToken: 'accessToken-fixture',
          refreshToken: 'refreshToken-fixture',
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
          accessToken: payloadFixture.body.accessToken,
          refreshToken: payloadFixture.body.refreshToken,
          status: AuthStateStatus.authenticated,
        };

        expect(result).toStrictEqual(expected);
      });

      it('should save accessToken and refreshToken in Local Storage', () => {
        const accessTokenStorage: string | null =
          window.localStorage.getItem('accessToken');
        const refreshTokenStorage: string | null =
          window.localStorage.getItem('refreshToken');

        expect(accessTokenStorage).toBe(payloadFixture.body.accessToken);
        expect(refreshTokenStorage).toBe(payloadFixture.body.refreshToken);
      });
    });
  });

  describe('having a pending state and a createAuthByCredentials fulfilled action with an HTTP BAD REQUEST status code 400', () => {
    let stateFixture: PendingAuthState;
    let actionFixture: PayloadAction<AuthSerializedResponse>;
    let payloadFixture: SerializableResponse<apiModels.ErrorV1, 400>;
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

  describe('having a non authenticated state and a createAuthByRefreshToken pending action', () => {
    let stateFixture: NonAuthenticatedAuthState;
    let actionFixture: PayloadAction<undefined>;

    beforeAll(() => {
      stateFixture = {
        status: AuthStateStatus.nonAuthenticated,
      };
      actionFixture = createAuthByRefreshToken.pending(
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

  describe('having a pending state and a createAuthByRefreshToken fulfilled action with an HTTP OK status code 200', () => {
    let stateFixture: PendingAuthState;
    let actionFixture: PayloadAction<AuthSerializedResponse>;
    let payloadFixture: SerializableResponse<apiModels.AuthV2, 200>;

    beforeAll(() => {
      payloadFixture = {
        body: {
          accessToken: 'accessToken-fixture',
          refreshToken: 'refreshToken-fixture',
        },
        statusCode: 200,
      };
      stateFixture = {
        status: AuthStateStatus.pending,
      };

      actionFixture = createAuthByRefreshToken.fulfilled(
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

      it('should save accessToken and refreshToken in Local Storage', () => {
        const accessTokenStorage: string | null =
          window.localStorage.getItem('accessToken');
        const refreshTokenStorage: string | null =
          window.localStorage.getItem('refreshToken');

        expect(accessTokenStorage).toBe(payloadFixture.body.accessToken);
        expect(refreshTokenStorage).toBe(payloadFixture.body.refreshToken);
      });

      it('should return a state', () => {
        const expected: AuthState = {
          accessToken: payloadFixture.body.accessToken,
          refreshToken: payloadFixture.body.refreshToken,
          status: AuthStateStatus.authenticated,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a pending state and a createAuthByRefreshToken fulfilled action with an HTTP BAD REQUEST status code 400', () => {
    let stateFixture: PendingAuthState;
    let actionFixture: PayloadAction<AuthSerializedResponse>;
    let payloadFixture: SerializableResponse<apiModels.ErrorV1, 400>;

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
      actionFixture = createAuthByRefreshToken.fulfilled(
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

  describe('having a non authenticated state and a login action', () => {
    let authV2Fixture: apiModels.AuthV2;
    let stateFixture: NonAuthenticatedAuthState;
    let actionFixture: PayloadAction<apiModels.AuthV2, 'login'>;

    beforeAll(() => {
      authV2Fixture = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };
      stateFixture = {
        status: AuthStateStatus.nonAuthenticated,
      };
      actionFixture = login(authV2Fixture);
    });

    describe('when authSlice.reducer() is called', () => {
      let result: unknown;

      beforeAll(() => {
        result = authSlice.reducer(stateFixture, actionFixture);
      });

      it('should return a state', () => {
        const expected: AuthState = {
          accessToken: authV2Fixture.accessToken,
          refreshToken: authV2Fixture.refreshToken,
          status: AuthStateStatus.authenticated,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having an authenticated state and a logout action', () => {
    let stateFixture: AuthenticatedAuthState;
    let actionFixture: PayloadAction<void, 'logout'>;

    beforeAll(() => {
      stateFixture = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        status: AuthStateStatus.authenticated,
      };
      actionFixture = logout();
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
