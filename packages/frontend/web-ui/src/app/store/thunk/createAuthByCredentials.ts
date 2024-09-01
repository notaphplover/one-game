import { createAsyncThunk } from '@reduxjs/toolkit';

import { buildSerializableResponse } from '../../../common/http/helpers/buildSerializableResponse';
import { AuthResponse } from '../../../common/http/models/AuthResponse';
import { AuthSerializedResponse } from '../../../common/http/models/AuthSerializedResponse';
import { httpClient } from '../../../common/http/services/httpClient';

export interface CreateAuthByCredentialsParams {
  email: string;
  password: string;
}

export const createAuthByCredentials = createAsyncThunk(
  'auth/createAuthByCredentials',
  async (
    formField: CreateAuthByCredentialsParams,
  ): Promise<AuthSerializedResponse> => {
    const response: AuthResponse = await httpClient.endpoints.createAuthV2(
      {},
      {
        email: formField.email,
        kind: 'login',
        password: formField.password,
      },
    );

    return buildSerializableResponse(response);
  },
);
