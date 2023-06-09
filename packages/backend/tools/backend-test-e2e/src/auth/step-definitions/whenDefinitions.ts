import { When } from '@cucumber/cucumber';

import { OneGameApiWorld } from '../../http/models/OneGameApiWorld';
import { sendRequest } from '../../http/utils/actions/sendRequest';

export async function whenCreateAuthRequestIsSend(
  this: OneGameApiWorld,
  requestAlias?: string,
): Promise<void> {
  await sendRequest.bind(this)('createAuth', requestAlias);
}

When<OneGameApiWorld>(
  'the create auth request is sent',
  async function (this: OneGameApiWorld): Promise<void> {
    await whenCreateAuthRequestIsSend.bind(this)();
  },
);

When<OneGameApiWorld>(
  'the create auth request is sent as {string}',
  async function (this: OneGameApiWorld, requestAlias: string): Promise<void> {
    await whenCreateAuthRequestIsSend.bind(this)(requestAlias);
  },
);
