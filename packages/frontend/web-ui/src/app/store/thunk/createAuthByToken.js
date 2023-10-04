import { createAsyncThunk } from '@reduxjs/toolkit';
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
