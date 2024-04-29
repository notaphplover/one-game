import { AuthState } from './models/AuthState';
import { AuthStateStatus } from './models/AuthStateStatus';

export const createInitialState = (): AuthState => {
  const token: string | null = window.localStorage.getItem('token');
  const refreshToken: string | null =
    window.localStorage.getItem('refreshToken');

  if (token === null || refreshToken === null) {
    return {
      status: AuthStateStatus.nonAuthenticated,
    };
  } else {
    return {
      status: AuthStateStatus.authenticated,
      token,
      refreshToken,
    };
  }
};
