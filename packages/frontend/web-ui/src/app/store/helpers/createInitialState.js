import {
  STATUS_AUTH_AUTHENTICATED,
  STATUS_AUTH_NOT_AUTHENTICATED,
} from '../data/authSliceStatus';

export const createInitialState = () => {
  const token = window.localStorage.getItem('token');
  let status;

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
