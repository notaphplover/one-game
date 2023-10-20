import { createAsyncThunk } from '@reduxjs/toolkit';
import { httpClient } from '../../../common/http/services/HttpService';
import { buildSerializableResponse } from '../../../common/http/helpers/buildSerializableResponse';

export const createAuthByCredentials = createAsyncThunk(
  'auth/createAuthByCredentials',
  async ({ email, password }) => {
    const response = await httpClient.createAuth(
      {},
      {
        email: email,
        password: password,
      },
    );

    return buildSerializableResponse(response);
  },
);
