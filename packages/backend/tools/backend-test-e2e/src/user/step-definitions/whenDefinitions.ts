import { When } from '@cucumber/cucumber';

import { OneGameApiWorld } from '../../http/models/OneGameApiWorld';
import { sendRequest } from '../../http/utils/actions/sendRequest';

export function whenCreateUserRequestIsSend(
  this: OneGameApiWorld,
  requestAlias?: string,
): void {
  sendRequest.bind(this)('createUser', requestAlias);
}

When<OneGameApiWorld>(
  'the create user request is sent',
  function (this: OneGameApiWorld): void {
    whenCreateUserRequestIsSend.bind(this)();
  },
);

When<OneGameApiWorld>(
  'the create user request is sent as {string}',
  function (this: OneGameApiWorld, requestAlias: string): void {
    whenCreateUserRequestIsSend.bind(this)(requestAlias);
  },
);
