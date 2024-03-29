import { When } from '@cucumber/cucumber';

import { OneGameApiWorld } from '../../http/models/OneGameApiWorld';
import { sendRequest } from '../../http/utils/actions/sendRequest';

export async function whenCreateUserRequestIsSend(
  this: OneGameApiWorld,
  requestAlias?: string,
): Promise<void> {
  await sendRequest.bind(this)('createUser', requestAlias);
}

export async function whenCreateUserCodeRequestIsSend(
  this: OneGameApiWorld,
  requestAlias?: string | undefined,
): Promise<void> {
  await sendRequest.bind(this)('createUserByEmailCode', requestAlias);
}

export async function whenDeleteUserCodeRequestIsSend(
  this: OneGameApiWorld,
  requestAlias?: string | undefined,
): Promise<void> {
  await sendRequest.bind(this)('deleteUserByEmailCode', requestAlias);
}

export async function whenDeleteUserMeRequestIsSend(
  this: OneGameApiWorld,
  requestAlias?: string,
): Promise<void> {
  await sendRequest.bind(this)('deleteUserMe', requestAlias);
}

export async function whenGetUserMeRequestIsSend(
  this: OneGameApiWorld,
  requestAlias?: string,
): Promise<void> {
  await sendRequest.bind(this)('getUserMe', requestAlias);
}

export async function whenUpdateUserMeRequestIsSend(
  this: OneGameApiWorld,
  requestAlias?: string,
): Promise<void> {
  await sendRequest.bind(this)('updateUserMe', requestAlias);
}

When<OneGameApiWorld>(
  'the create user request is sent',
  async function (this: OneGameApiWorld): Promise<void> {
    await whenCreateUserRequestIsSend.bind(this)();
  },
);

When<OneGameApiWorld>(
  'the create user code request is sent',
  async function (this: OneGameApiWorld): Promise<void> {
    await whenCreateUserCodeRequestIsSend.bind(this)();
  },
);

When<OneGameApiWorld>(
  'the create user code request as {string} is sent',
  async function (this: OneGameApiWorld, requestAlias: string): Promise<void> {
    await whenCreateUserCodeRequestIsSend.bind(this)(requestAlias);
  },
);

When<OneGameApiWorld>(
  'the create user request is sent as {string}',
  async function (this: OneGameApiWorld, requestAlias: string): Promise<void> {
    await whenCreateUserRequestIsSend.bind(this)(requestAlias);
  },
);

When<OneGameApiWorld>(
  'the delete own user request for {string} is sent',
  async function (this: OneGameApiWorld, requestAlias: string): Promise<void> {
    await whenDeleteUserMeRequestIsSend.bind(this)(requestAlias);
  },
);

When<OneGameApiWorld>(
  'the delete user code request is sent',
  async function (this: OneGameApiWorld): Promise<void> {
    await whenDeleteUserCodeRequestIsSend.bind(this)();
  },
);

When<OneGameApiWorld>(
  'the update own user request for {string} is sent',
  async function (this: OneGameApiWorld, requestAlias: string): Promise<void> {
    await whenUpdateUserMeRequestIsSend.bind(this)(requestAlias);
  },
);
