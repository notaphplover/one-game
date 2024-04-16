import { When } from '@cucumber/cucumber';

import { defaultAlias } from '../../foundation/application/data/defaultAlias';
import { OneGameApiWorld } from '../../http/models/OneGameApiWorld';
import { sendRequest } from '../../http/utils/actions/sendRequest';
import { GameEventSubscriptionV2Parameter } from '../models/GameEventSubscriptionV2Parameter';
import { getGameEventSubscriptionOrFail } from '../utils/calculations/getGameEventSubscriptionOrFail';

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

export async function whenGetGameSpecRequestIsSend(
  this: OneGameApiWorld,
  requestAlias?: string,
): Promise<void> {
  await sendRequest.bind(this)('getGameGameIdSpec', requestAlias);
}

async function whenMessageEventForGameIsReceived(
  this: OneGameApiWorld,
  gameAlias?: string,
): Promise<void> {
  const processedGameAlias: string = gameAlias ?? defaultAlias;
  const gameEventSubscriptionV2Parameter: GameEventSubscriptionV2Parameter =
    getGameEventSubscriptionOrFail.bind(this)(processedGameAlias);

  if (gameEventSubscriptionV2Parameter.gameEvents.length === 0) {
    const resolveWrapper: { resolve: () => void; resolved: boolean } = {
      resolve: () => {
        resolveWrapper.resolved = true;
      },
      resolved: false,
    };

    const eventListener: () => void = () => {
      gameEventSubscriptionV2Parameter.eventSource.removeEventListener(
        'message',
        eventListener,
      );
      resolveWrapper.resolve();
    };

    gameEventSubscriptionV2Parameter.eventSource.addEventListener(
      'message',
      eventListener,
    );

    await new Promise<void>((resolve: () => void) => {
      resolveWrapper.resolve = resolve;

      if (resolveWrapper.resolved) {
        resolve();
      }
    });
  }
}

export async function whenUpdateGameRequestIsSend(
  this: OneGameApiWorld,
  requestAlias?: string,
): Promise<void> {
  await sendRequest.bind(this)('updateGame', requestAlias);
}

When<OneGameApiWorld>(
  'a message event for game is received',
  async function (this: OneGameApiWorld): Promise<void> {
    await whenMessageEventForGameIsReceived.bind(this)();
  },
);

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
  'the get game spec request is sent',
  async function (this: OneGameApiWorld): Promise<void> {
    await whenGetGameSpecRequestIsSend.bind(this)();
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

When<OneGameApiWorld>(
  'the update game request {string} is sent',
  async function (this: OneGameApiWorld, requestAlias: string): Promise<void> {
    await whenUpdateGameRequestIsSend.bind(this)(requestAlias);
  },
);
