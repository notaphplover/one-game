import { createSlice } from '@reduxjs/toolkit';
import { createAuthByCredentials } from '../thunk/createAuthByCredentials';
import { createAuthByToken } from '../thunk/createAuthByToken';

const STATUS_AUTH_AUTHENTICATED = 'authenticated';
const STATUS_AUTH_NOT_AUTHENTICATED = 'not-authenticated';
const STATUS_AUTH_CHECKING = 'checking';

function createAuthPendingReducer(state) {
  state.status = STATUS_AUTH_CHECKING;
  state.token = null;
  state.errorMessage = null;
}

function createAuthFulfilledReducer(state, action) {
  state.status = STATUS_AUTH_NOT_AUTHENTICATED;

  switch (action.payload.statusCode) {
    case 200:
      state.status = STATUS_AUTH_AUTHENTICATED;
      state.token = action.payload.body.jwt;
      break;
    case 422:
      state.errorMessage = 'Unprocessable operation. Try again.';
      break;
    default:
      state.errorMessage = 'Ups... something strange happened. Try again?';
  }
}

function createAuthRejectedReducer(state, action) {
  state.status = STATUS_AUTH_NOT_AUTHENTICATED;
  if (action.payload.statusCode === 422) {
    state.errorMessage = 'Unprocessable operation. Try again.';
  } else {
    state.errorMessage = 'Ups... something strange happened. Try again?';
  }
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    status: STATUS_AUTH_NOT_AUTHENTICATED,
    token: null,
    errorMessage: null,
  },
  extraReducers(builder) {
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
