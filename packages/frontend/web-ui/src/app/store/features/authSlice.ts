import { models as apiModels } from '@cornie-js/api-models';
import {
  ActionReducerMapBuilder,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import { OK } from '../../../common/http/helpers/httpCodes';
import { AuthSerializedResponse } from '../../../common/http/models/AuthSerializedResponse';
import login from '../actions/login';
import logout from '../actions/logout';
import { AuthenticatedAuthState, AuthState } from '../helpers/models/AuthState';
import { AuthStateStatus } from '../helpers/models/AuthStateStatus';
import type { RootState } from '../store';
import { createAuthByCredentials } from '../thunk/createAuthByCredentials';
import { createAuthByRefreshToken } from '../thunk/createAuthByRefreshToken';
import { createAuthByToken } from '../thunk/createAuthByToken';
import { createInitialState } from './../helpers/createInitialState';

function createAuthPendingReducer(): AuthState {
  return {
    status: AuthStateStatus.pending,
  };
}

function createAuthFulfilledReducer(
  _state: AuthState,
  action: PayloadAction<AuthSerializedResponse>,
): AuthState {
  switch (action.payload.statusCode) {
    case OK:
      return {
        accessToken: action.payload.body.accessToken,
        refreshToken: action.payload.body.refreshToken,
        status: AuthStateStatus.authenticated,
      };
    default:
      return {
        status: AuthStateStatus.nonAuthenticated,
      };
  }
}

function createAuthRefreshTokenFulfilledReducer(
  _state: AuthState,
  action: PayloadAction<AuthSerializedResponse>,
): AuthState {
  switch (action.payload.statusCode) {
    case OK:
      window.localStorage.setItem(
        'accessToken',
        action.payload.body.accessToken,
      );

      window.localStorage.setItem(
        'refreshToken',
        action.payload.body.refreshToken,
      );

      return {
        accessToken: action.payload.body.accessToken,
        refreshToken: action.payload.body.refreshToken,
        status: AuthStateStatus.authenticated,
      };
    default:
      return {
        status: AuthStateStatus.nonAuthenticated,
      };
  }
}

function createAuthRejectedReducer(): AuthState {
  return {
    status: AuthStateStatus.nonAuthenticated,
  };
}

function loginReducer(
  _state: AuthState,
  action: PayloadAction<apiModels.AuthV2>,
): AuthState {
  return {
    accessToken: action.payload.accessToken,
    refreshToken: action.payload.refreshToken,
    status: AuthStateStatus.authenticated,
  };
}

function logoutReducer(): AuthState {
  window.localStorage.removeItem('accessToken');
  window.localStorage.removeItem('refreshToken');

  return {
    status: AuthStateStatus.nonAuthenticated,
  };
}

const initialState: AuthState = createInitialState();

export const authSlice = createSlice({
  extraReducers(builder: ActionReducerMapBuilder<AuthState>) {
    builder
      .addCase(createAuthByToken.pending, createAuthPendingReducer)
      .addCase(createAuthByToken.fulfilled, createAuthFulfilledReducer)
      .addCase(createAuthByToken.rejected, createAuthRejectedReducer)
      .addCase(createAuthByCredentials.pending, createAuthPendingReducer)
      .addCase(createAuthByCredentials.fulfilled, createAuthFulfilledReducer)
      .addCase(createAuthByCredentials.rejected, createAuthRejectedReducer)
      .addCase(createAuthByRefreshToken.pending, createAuthPendingReducer)
      .addCase(
        createAuthByRefreshToken.fulfilled,
        createAuthRefreshTokenFulfilledReducer,
      )
      .addCase(createAuthByRefreshToken.rejected, createAuthRejectedReducer)
      .addCase(login, loginReducer)
      .addCase(logout, logoutReducer);
  },
  initialState,
  name: 'auth',
  reducers: {},
});

export const selectAuthToken = (state: RootState): string | null => {
  return state.auth.status === AuthStateStatus.authenticated
    ? state.auth.accessToken
    : null;
};

export const selectAuthenticatedAuth = (
  state: RootState,
): AuthenticatedAuthState | null => {
  return state.auth.status === AuthStateStatus.authenticated
    ? state.auth
    : null;
};

export const selectRefreshToken = (state: RootState): string | null => {
  return state.auth.status === AuthStateStatus.authenticated
    ? state.auth.refreshToken
    : null;
};

export default authSlice;
