import { buildApi } from '@cornie-js/frontend-api-rtk-query';

import login from '../../../app/store/actions/login';
import logout from '../../../app/store/actions/logout';
import {
  selectAuthToken,
  selectRefreshToken,
} from '../../../app/store/features/authSlice';
import { httpClient } from './httpClient';

export const cornieApi = buildApi({
  httpClient,
  store: {
    login: login,
    logout: logout,
    selectAccessToken: selectAuthToken,
    selectRefreshToken,
  },
});
