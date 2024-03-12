import { createAsyncThunk } from '@reduxjs/toolkit';
import { httpClient } from '../../../common/http/services/HttpService';
import { buildSerializableResponse } from '../../../common/http/helpers/buildSerializableResponse';
import { AuthResponse } from '../../../common/http/models/AuthResponse';
import { AuthSerializedResponse } from '../../../common/http/models/AuthSerializedResponse';

export interface CreateAuthByCredentialsParams {
  email: string;
  password: string;
}

export const createAuthByCredentials = createAsyncThunk(
  'auth/createAuthByCredentials',
  async (
    formField: CreateAuthByCredentialsParams,
  ): Promise<AuthSerializedResponse> => {
    const response: AuthResponse = await httpClient.createAuth(
      {},
      {
        email: formField.email,
        password: formField.password,
      },
    );

    return buildSerializableResponse(response);
  },
);
