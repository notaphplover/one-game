import { When } from '@cucumber/cucumber';

import { OneGameApiWorld } from '../../http/models/OneGameApiWorld';
import { sendRequest } from '../../http/utils/actions/sendRequest';

export function whenCreateAuthRequestIsSend(
  this: OneGameApiWorld,
  requestAlias?: string,
): void {
  sendRequest.bind(this)('createAuth', requestAlias);
}

When<OneGameApiWorld>(
  'the create auth request is sent',
  function (this: OneGameApiWorld): void {
    whenCreateAuthRequestIsSend.bind(this)();
  },
);

When<OneGameApiWorld>(
  'the create auth request is sent as {string}',
  function (this: OneGameApiWorld, requestAlias: string): void {
    whenCreateAuthRequestIsSend.bind(this)(requestAlias);
  },
);
