import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import userSlice from './userSlice';
import { PayloadAction, UnknownAction } from '@reduxjs/toolkit';
import {
  IdleUserState,
  PendingUserState,
  UserState,
} from '../helpers/models/UserState';
import { UserStateStatus } from '../helpers/models/UserStateStatus';
import { getUserMe } from '../thunk/getUserMe';
import { UserMeSerializedResponse } from '../../../common/http/models/UserMeSerializedResponse';
import { SerializableResponse } from '../../../common/http/models/SerializedResponse';
import { models as apiModels } from '@cornie-js/api-models';

describe(userSlice.name, () => {
  describe('having no state and no action', () => {
    let stateFixture: undefined;
    let actionFixture: UnknownAction;

    beforeAll(() => {
      stateFixture = undefined;
      actionFixture = {
        type: 'unknown-action',
      };
    });

    describe('when userSlice.reducer() is called', () => {
      let result: unknown;

      beforeAll(() => {
        result = userSlice.reducer(stateFixture, actionFixture);
      });

      it('should return a state', () => {
        const expected: UserState = {
          status: UserStateStatus.idle,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having an state and no action', () => {
    let stateFixture: IdleUserState;
    let actionFixture: UnknownAction;

    beforeAll(() => {
      stateFixture = {
        status: UserStateStatus.idle,
      };
      actionFixture = {
        type: 'unknown-action',
      };
    });

    describe('when userSlice.reducer() is called', () => {
      let result: unknown;

      beforeAll(() => {
        result = userSlice.reducer(stateFixture, actionFixture);
      });

      it('should return a state', () => {
        expect(result).toStrictEqual(stateFixture);
      });
    });
  });

  describe('having a idle state and a getUserMe pending action', () => {
    let stateFixture: IdleUserState;
    let actionFixture: PayloadAction<undefined>;

    beforeAll(() => {
      stateFixture = {
        status: UserStateStatus.idle,
      };
      actionFixture = getUserMe.pending('arg-1-fixture', 'arg-2-fixture');
    });

    describe('when userSlice.reducer() is called', () => {
      let result: unknown;

      beforeAll(() => {
        result = userSlice.reducer(stateFixture, actionFixture);
      });

      it('should return a state', () => {
        const expected: UserState = {
          status: UserStateStatus.pending,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a pending state and a getUserMe fulfilled action with an HTTP OK status code 200', () => {
    let stateFixture: PendingUserState;
    let actionFixture: PayloadAction<UserMeSerializedResponse>;
    let payloadFixture: SerializableResponse<apiModels.UserV1, 200>;

    beforeAll(() => {
      payloadFixture = {
        body: {
          active: true,
          id: 'userId-fixture',
          name: 'name-fixture',
        },
        statusCode: 200,
      };
      stateFixture = {
        status: UserStateStatus.pending,
      };
      actionFixture = getUserMe.fulfilled(
        payloadFixture,
        'arg-1-fixture',
        'arg-2-fixture',
      );
    });

    describe('when userSlice.reducer() is called', () => {
      let result: unknown;

      beforeAll(() => {
        result = userSlice.reducer(stateFixture, actionFixture);
      });

      it('should return a state', () => {
        const expected: UserState = {
          status: UserStateStatus.fulfilled,
          userId: payloadFixture.body.id,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a pending state and a getUserMe fulfilled action with an HTTP UNAUTHORIZED status code 401', () => {
    let stateFixture: PendingUserState;
    let actionFixture: PayloadAction<UserMeSerializedResponse>;
    let payloadFixture: SerializableResponse<apiModels.ErrorV1, 401>;

    beforeAll(() => {
      payloadFixture = {
        body: {
          description: 'error-fixture',
        },
        statusCode: 401,
      };
      stateFixture = {
        status: UserStateStatus.pending,
      };

      actionFixture = getUserMe.fulfilled(
        payloadFixture,
        'arg-1-fixture',
        'arg-2-fixture',
      );
    });

    describe('when userSlice.reducer() is called', () => {
      let result: unknown;

      beforeAll(() => {
        result = userSlice.reducer(stateFixture, actionFixture);
      });

      it('should return a state', () => {
        const expected: UserState = {
          status: UserStateStatus.rejected,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
