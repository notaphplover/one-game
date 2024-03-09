import { createInitialState } from './../helpers/createInitialState';
import {
  ActionReducerMapBuilder,
  PayloadAction,
  Slice,
  createSlice,
} from '@reduxjs/toolkit';
import { createAuthByCredentials } from '../thunk/createAuthByCredentials';
import { createAuthByToken } from '../thunk/createAuthByToken';
import { AuthState } from '../helpers/models/AuthState';
import { AuthSerializedResponse } from '../../../common/http/models/AuthSerializedResponse';
import { AuthStateStatus } from '../helpers/models/AuthStateStatus';

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
    case 200:
      return {
        status: AuthStateStatus.authenticated,
        token: action.payload.body.jwt,
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

const initialState: AuthState = createInitialState();

export const authSlice: Slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers(builder: ActionReducerMapBuilder<AuthState>) {
    builder
      .addCase(createAuthByToken.pending, createAuthPendingReducer)
      .addCase(createAuthByToken.fulfilled, createAuthFulfilledReducer)
      .addCase(createAuthByToken.rejected, createAuthRejectedReducer)
      .addCase(createAuthByCredentials.pending, createAuthPendingReducer)
      .addCase(createAuthByCredentials.fulfilled, createAuthFulfilledReducer)
      .addCase(createAuthByCredentials.rejected, createAuthRejectedReducer);
  },
});

export default authSlice;
