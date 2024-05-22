import {
  ActionReducerMapBuilder,
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';

import { OK } from '../../../common/http/helpers/httpCodes';
import { UserMeSerializedResponse } from '../../../common/http/models/UserMeSerializedResponse';
import logout from '../actions/logout';
import { getInitialUserState } from '../helpers/getInitialUserState';
import { FulfilledUserState, UserState } from '../helpers/models/UserState';
import { UserStateStatus } from '../helpers/models/UserStateStatus';
import type { RootState } from '../store';
import { getUserMe } from '../thunk/getUserMe';

function getUserPendingReducer(): UserState {
  return {
    status: UserStateStatus.pending,
  };
}

function getUserFulfilledReducer(
  _state: UserState,
  action: PayloadAction<UserMeSerializedResponse>,
): UserState {
  switch (action.payload.statusCode) {
    case OK:
      return {
        status: UserStateStatus.fulfilled,
        userId: action.payload.body.id,
      };
    default:
      return {
        status: UserStateStatus.rejected,
      };
  }
}

function getUserRejectedReducer(): UserState {
  return {
    status: UserStateStatus.rejected,
  };
}

function logoutReducer(): UserState {
  return {
    status: UserStateStatus.idle,
  };
}

const initialState: UserState = getInitialUserState();

export const userSlice = createSlice({
  extraReducers(builder: ActionReducerMapBuilder<UserState>) {
    builder
      .addCase(getUserMe.pending, getUserPendingReducer)
      .addCase(getUserMe.fulfilled, getUserFulfilledReducer)
      .addCase(getUserMe.rejected, getUserRejectedReducer)
      .addCase(logout, logoutReducer);
  },
  initialState,
  name: 'user',
  reducers: {},
});

export const selectFulfilledUser = (
  state: RootState,
): FulfilledUserState | null => {
  return state.user.status === UserStateStatus.fulfilled
    ? {
        status: state.user.status,
        userId: state.user.userId,
      }
    : null;
};

export default userSlice;
