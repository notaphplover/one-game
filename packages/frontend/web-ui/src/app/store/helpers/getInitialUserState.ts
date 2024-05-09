import { UserState } from './models/UserState';
import { UserStateStatus } from './models/UserStateStatus';

export const getInitialUserState = (): UserState => {
  const localStorageUserId: string | null =
    window.localStorage.getItem('userId');

  if (localStorageUserId === null) {
    return {
      status: UserStateStatus.idle,
    };
  } else {
    return {
      status: UserStateStatus.fulfilled,
      userId: localStorageUserId,
    };
  }
};
