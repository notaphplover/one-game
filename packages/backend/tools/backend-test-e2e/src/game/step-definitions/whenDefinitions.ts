import { When } from '@cucumber/cucumber';

import { OneGameApiWorld } from '../../http/models/OneGameApiWorld';
import { sendRequest } from '../../http/utils/actions/sendRequest';

export async function whenCreateGameRequestIsSend(
  this: OneGameApiWorld,
  requestAlias?: string,
): Promise<void> {
  await sendRequest.bind(this)('createGame', requestAlias);
}

export async function whenCreateGameSlotRequestIsSend(
  this: OneGameApiWorld,
  requestAlias?: string,
): Promise<void> {
  await sendRequest.bind(this)('createGameSlot', requestAlias);
}

export async function whenGetGameRequestIsSend(
  this: OneGameApiWorld,
  requestAlias?: string,
): Promise<void> {
  await sendRequest.bind(this)('getGame', requestAlias);
}

export async function whenUpdateGameRequestIsSend(
  this: OneGameApiWorld,
  requestAlias?: string,
): Promise<void> {
  await sendRequest.bind(this)('updateGame', requestAlias);
}

When<OneGameApiWorld>(
  'the create game request is sent',
  async function (this: OneGameApiWorld): Promise<void> {
    await whenCreateGameRequestIsSend.bind(this)();
  },
);

When<OneGameApiWorld>(
  'the create game slot request is sent',
  async function (this: OneGameApiWorld): Promise<void> {
    await whenCreateGameSlotRequestIsSend.bind(this)();
  },
);

When<OneGameApiWorld>(
  'the create game slot request {string} is sent',
  async function (this: OneGameApiWorld, requestAlias: string): Promise<void> {
    await whenCreateGameSlotRequestIsSend.bind(this)(requestAlias);
  },
);

When<OneGameApiWorld>(
  'the get game request is sent',
  async function (this: OneGameApiWorld): Promise<void> {
    await whenGetGameRequestIsSend.bind(this)();
  },
);

When<OneGameApiWorld>(
  'the update game request is sent',
  async function (this: OneGameApiWorld): Promise<void> {
    await whenUpdateGameRequestIsSend.bind(this)();
  },
);
