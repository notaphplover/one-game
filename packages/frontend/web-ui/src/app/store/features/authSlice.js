import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
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

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    status: 'not-authenticated',
    token: null,
    errorMessage: null,
  },
  extraReducers(builder) {
    builder
      .addCase(createAuthByToken.pending, (state) => {
        state.status = 'checking';
        state.token = null;
        state.errorMessage = null;
      })
      .addCase(createAuthByToken.fulfilled, (state, action) => {
        state.status = 'not-authenticated';

        if (action.payload.statusCode === 200) {
          state.status = 'authenticated';
          state.token = action.payload.body.jwt;
        } else if (action.payload.statusCode === 422) {
          state.errorMessage = 'Unprocessable operation. Try again.';
        } else {
          state.errorMessage = 'Ups... something strange happened. Try again?';
        }
      })
      .addCase(createAuthByToken.rejected, (state, action) => {
        state.status = 'not-authenticated';
        if (action.payload.statusCode === 422) {
          state.errorMessage = 'Unprocessable operation. Try again.';
        } else {
          state.errorMessage = 'Ups... something strange happened. Try again?';
        }
      });
  },
});

export default authSlice;
