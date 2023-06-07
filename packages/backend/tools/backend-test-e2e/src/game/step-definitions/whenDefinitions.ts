import { When } from '@cucumber/cucumber';

import { OneGameApiWorld } from '../../http/models/OneGameApiWorld';
import { sendRequest } from '../../http/utils/actions/sendRequest';

export function whenCreateGameRequestIsSend(
  this: OneGameApiWorld,
  requestAlias?: string,
): void {
  sendRequest.bind(this)('createGame', requestAlias);
}

export function whenCreateGameSlotRequestIsSend(
  this: OneGameApiWorld,
  requestAlias?: string,
): void {
  sendRequest.bind(this)('createGameSlot', requestAlias);
}

When<OneGameApiWorld>(
  'the create game request is sent',
  function (this: OneGameApiWorld): void {
    whenCreateGameRequestIsSend.bind(this)();
  },
);

When<OneGameApiWorld>(
  'the create game slot request is sent',
  function (this: OneGameApiWorld): void {
    whenCreateGameSlotRequestIsSend.bind(this)();
  },
);
