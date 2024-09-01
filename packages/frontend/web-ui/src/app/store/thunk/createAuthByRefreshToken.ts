import { createAsyncThunk } from '@reduxjs/toolkit';

import { buildSerializableResponse } from '../../../common/http/helpers/buildSerializableResponse';
import { AuthResponse } from '../../../common/http/models/AuthResponse';
import { AuthSerializedResponse } from '../../../common/http/models/AuthSerializedResponse';
import { httpClient } from '../../../common/http/services/httpClient';

export const createAuthByRefreshToken = createAsyncThunk(
  'auth/createAuthByRefreshToken',
  async (refreshToken: string): Promise<AuthSerializedResponse> => {
    const response: AuthResponse = await httpClient.endpoints.createAuthV2(
      {
        authorization: `Bearer ${refreshToken}`,
      },
      undefined,
    );

    return buildSerializableResponse(response);
  },
);
