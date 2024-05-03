import { AuthState } from './models/AuthState';
import { AuthStateStatus } from './models/AuthStateStatus';

export const createInitialState = (): AuthState => {
  const accessToken: string | null = window.localStorage.getItem('accessToken');
  const refreshToken: string | null =
    window.localStorage.getItem('refreshToken');

  if (accessToken === null || refreshToken === null) {
    return {
      status: AuthStateStatus.nonAuthenticated,
    };
  } else {
    return {
      status: AuthStateStatus.authenticated,
      accessToken,
      refreshToken,
    };
  }
};
