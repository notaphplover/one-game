import { getInitialUserState } from '../helpers/getInitialUserState';
import {
  ActionReducerMapBuilder,
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { FulfilledUserState, UserState } from '../helpers/models/UserState';
import { UserStateStatus } from '../helpers/models/UserStateStatus';
import { UserMeSerializedResponse } from '../../../common/http/models/UserMeSerializedResponse';
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
    case 200:
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

const initialState: UserState = getInitialUserState();

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers(builder: ActionReducerMapBuilder<UserState>) {
    builder
      .addCase(getUserMe.pending, getUserPendingReducer)
      .addCase(getUserMe.fulfilled, getUserFulfilledReducer)
      .addCase(getUserMe.rejected, getUserRejectedReducer);
  },
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
