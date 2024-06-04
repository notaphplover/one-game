import {
  configureStore,
  ThunkMiddleware,
  Tuple,
  UnknownAction,
} from '@reduxjs/toolkit';

import { cornieApi } from '../../common/http/services/cornieApi';
import authSlice from './features/authSlice';
import userSlice from './features/userSlice';
import type { AuthState } from './helpers/models/AuthState';
import type { UserState } from './helpers/models/UserState';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface RootState extends Record<string | symbol, any> {
  auth: AuthState;
  user: UserState;
}

export const store = configureStore<RootState>({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cornieApi.middleware) as Tuple<
      unknown[]
    > as Tuple<[ThunkMiddleware<RootState, UnknownAction>]>,
  reducer: {
    auth: authSlice.reducer,
    user: userSlice.reducer,
    [cornieApi.reducerPath]: cornieApi.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
