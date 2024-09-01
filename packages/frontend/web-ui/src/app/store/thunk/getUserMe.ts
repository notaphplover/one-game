import { createAsyncThunk } from '@reduxjs/toolkit';

import { buildSerializableResponse } from '../../../common/http/helpers/buildSerializableResponse';
import { UserMeResponse } from '../../../common/http/models/UserMeResponse';
import { UserMeSerializedResponse } from '../../../common/http/models/UserMeSerializedResponse';
import { httpClient } from '../../../common/http/services/httpClient';

export const getUserMe = createAsyncThunk(
  'user/getUserMe',
  async (token: string): Promise<UserMeSerializedResponse> => {
    const response: UserMeResponse = await httpClient.endpoints.getUserMe({
      authorization: `Bearer ${token}`,
    });

    return buildSerializableResponse(response);
  },
);
