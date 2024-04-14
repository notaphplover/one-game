import { createAsyncThunk } from '@reduxjs/toolkit';
import { httpClient } from '../../../common/http/services/HttpService';
import { buildSerializableResponse } from '../../../common/http/helpers/buildSerializableResponse';
import { AuthSerializedResponse } from '../../../common/http/models/AuthSerializedResponse';
import { AuthResponse } from '../../../common/http/models/AuthResponse';

export const createAuthByToken = createAsyncThunk(
  'auth/createAuthByToken',
  async (code: string): Promise<AuthSerializedResponse> => {
    const response: AuthResponse = await httpClient.endpoints.createAuth(
      {},
      {
        code: code,
      },
    );

    return buildSerializableResponse(response);
  },
);
