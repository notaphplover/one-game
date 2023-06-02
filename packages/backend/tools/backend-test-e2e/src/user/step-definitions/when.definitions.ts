import { When } from '@cucumber/cucumber';

import { OneGameApiWorld } from '../../http/models/OneGameApiWorld';
import { sendRequest } from '../../http/utils/actions/sendRequest';

async function whenCreateUserRequestIsSend(
  this: OneGameApiWorld,
  requestAlias?: string,
): Promise<void> {
  await sendRequest.bind(this)('createUser', requestAlias);
}

When<OneGameApiWorld>(
  'the create user request is sent',
  async function (this: OneGameApiWorld): Promise<void> {
    await whenCreateUserRequestIsSend.bind(this)();
  },
);

When<OneGameApiWorld>(
  'the create user request is sent as {string}',
  async function (this: OneGameApiWorld, requestAlias: string): Promise<void> {
    await whenCreateUserRequestIsSend.bind(this)(requestAlias);
  },
);
