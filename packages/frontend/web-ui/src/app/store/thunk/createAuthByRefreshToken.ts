import { createAsyncThunk } from '@reduxjs/toolkit';

import { buildSerializableResponse } from '../../../common/http/helpers/buildSerializableResponse';
import { AuthResponse } from '../../../common/http/models/AuthResponse';
import { AuthSerializedResponse } from '../../../common/http/models/AuthSerializedResponse';
import { httpClient } from '../../../common/http/services/HttpService';
import { useAppSelector } from '../hooks';
import { selectAuthenticatedAuth } from './../features/authSlice';

export const createAuthByRefreshToken = createAsyncThunk(
  'auth/createAuthByRefreshToken',
  async (): Promise<AuthSerializedResponse> => {
    const auth = useAppSelector(selectAuthenticatedAuth);
    let refreshToken: string | null;

    if (auth !== null) {
      refreshToken = auth.refreshToken;
    } else {
      refreshToken = window.localStorage.getItem('refreshToken');
    }

    const response: AuthResponse = await httpClient.endpoints.createAuthV2(
      {
        authorization: `Bearer ${refreshToken}`,
      },
      undefined,
    );

    return buildSerializableResponse(response);
  },
);
