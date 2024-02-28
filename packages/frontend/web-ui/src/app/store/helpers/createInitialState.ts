import { AuthState } from './models/AuthState';
import {
  STATUS_AUTH_AUTHENTICATED,
  STATUS_AUTH_NOT_AUTHENTICATED,
} from '../data/authSliceStatus';

export const createInitialState = (): AuthState => {
  const token: string | null = window.localStorage.getItem('token');
  let status: string;

  if (token === null) {
    status = STATUS_AUTH_NOT_AUTHENTICATED;
  } else {
    status = STATUS_AUTH_AUTHENTICATED;
  }

  return {
    status,
    token,
    errorMessage: null,
  };
};
