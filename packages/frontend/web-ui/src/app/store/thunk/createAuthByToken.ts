import { createAsyncThunk } from '@reduxjs/toolkit';

import { buildSerializableResponse } from '../../../common/http/helpers/buildSerializableResponse';
import { AuthResponse } from '../../../common/http/models/AuthResponse';
import { AuthSerializedResponse } from '../../../common/http/models/AuthSerializedResponse';
import { httpClient } from '../../../common/http/services/httpClient';

export const createAuthByToken = createAsyncThunk(
  'auth/createAuthByToken',
  async (code: string): Promise<AuthSerializedResponse> => {
    const response: AuthResponse = await httpClient.endpoints.createAuthV2(
      {},
      {
        code: code,
        kind: 'code',
      },
    );

    return buildSerializableResponse(response);
  },
);
