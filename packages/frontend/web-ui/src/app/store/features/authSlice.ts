import { createInitialState } from './../helpers/createInitialState';
import {
  ActionReducerMapBuilder,
  PayloadAction,
  Slice,
  createSlice,
} from '@reduxjs/toolkit';
import { createAuthByCredentials } from '../thunk/createAuthByCredentials';
import { createAuthByToken } from '../thunk/createAuthByToken';
import {
  STATUS_AUTH_AUTHENTICATED,
  STATUS_AUTH_CHECKING,
  STATUS_AUTH_NOT_AUTHENTICATED,
} from '../data/authSliceStatus';
import { AuthState } from '../helpers/models/AuthState';
import { AuthSerializedResponse } from '../../../common/http/models/AuthSerializedResponse';

function createAuthPendingReducer(state: AuthState): void {
  state.status = STATUS_AUTH_CHECKING;
  state.token = null;
  state.errorMessage = null;
}

function createAuthFulfilledReducer(
  state: AuthState,
  action: PayloadAction<AuthSerializedResponse>,
): void {
  state.status = STATUS_AUTH_NOT_AUTHENTICATED;

  switch (action.payload.statusCode) {
    case 200:
      state.status = STATUS_AUTH_AUTHENTICATED;
      state.token = action.payload.body.jwt;
      break;
    case 400:
    case 401:
      state.errorMessage = 'Invalid operation, please try again later';
      break;
    default:
      state.errorMessage = 'An error occurred, please try again later';
  }
}

function createAuthRejectedReducer(state: AuthState): void {
  state.status = STATUS_AUTH_NOT_AUTHENTICATED;
  state.errorMessage = 'An error occurred, please try again later';
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
