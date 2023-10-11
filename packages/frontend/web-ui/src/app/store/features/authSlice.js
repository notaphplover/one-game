import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createAuthByCredentials } from '../thunk';
import { httpClient } from '../../../common/http/services/HttpService';
import { buildSerializableResponse } from '../../../common/http/helpers';

export const createAuthByToken = createAsyncThunk(
  'auth/createAuthByToken',
  async (code) => {
    const response = await httpClient.createAuth(
      {},
      {
        code: code,
      },
    );

    return buildSerializableResponse(response);
  },
);

function createAuthPendingReducer(state) {
  state.status = 'checking';
  state.token = null;
  state.errorMessage = null;
}

function createAuthFulfilledReducer(state, action) {
  state.status = 'not-authenticated';

  if (action.payload.statusCode === 200) {
    state.status = 'authenticated';
    state.token = action.payload.body.jwt;
  } else if (action.payload.statusCode === 422) {
    state.errorMessage = 'Unprocessable operation. Try again.';
  } else {
    state.errorMessage = 'Ups... something strange happened. Try again?';
  }
}

function createAuthRejectedReducer(state, action) {
  state.status = 'not-authenticated';
  if (action.payload.statusCode === 422) {
    state.errorMessage = 'Unprocessable operation. Try again.';
  } else {
    state.errorMessage = 'Ups... something strange happened. Try again?';
  }
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    status: 'not-authenticated',
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
