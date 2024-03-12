import { AuthState } from './models/AuthState';
import { AuthStateStatus } from './models/AuthStateStatus';

export const createInitialState = (): AuthState => {
  const token: string | null = window.localStorage.getItem('token');

  if (token === null) {
    return {
      status: AuthStateStatus.nonAuthenticated,
    };
  } else {
    return {
      status: AuthStateStatus.authenticated,
      token,
    };
  }
};
