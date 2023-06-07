import { HttpClient } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { Then } from '@cucumber/cucumber';
import { HttpStatus } from '@nestjs/common';

import { expectObjectContaining } from '../../foundation/adapter/node/assertions/expectObjectContaining';
import { defaultAlias } from '../../foundation/application/data/defaultAlias';
import { OneGameApiWorld } from '../../http/models/OneGameApiWorld';
import { getRequestParametersOrFail } from '../../http/utils/calculations/getRequestOrFail';
import { getResponseParametersOrFail } from '../../http/utils/calculations/getResponseOrFail';

export async function thenCreateGameResponseShouldContainValidGame(
  this: OneGameApiWorld,
  requestAlias?: string,
): Promise<void> {
  const alias: string = requestAlias ?? defaultAlias;

  const [, gameCreateQueryV1]: Parameters<HttpClient['createGame']> =
    getRequestParametersOrFail(this, 'createGame', alias);

  type ResponseType = Awaited<ReturnType<HttpClient['createGame']>>;

  const response: ResponseType = await getResponseParametersOrFail(
    this,
    'createGame',
    alias,
  );

  expectObjectContaining<ResponseType>(response, {
    body: {
      gameSlotsAmount: gameCreateQueryV1.gameSlotsAmount,
      gameSpec: () => undefined,
      id: () => undefined,
      slots: [],
    },
    headers: {},
    statusCode: HttpStatus.OK,
  });
}

export async function thenCreateGameSlotResponseShouldContainValidGameSlot(
  this: OneGameApiWorld,
  requestAlias?: string,
): Promise<void> {
  const alias: string = requestAlias ?? defaultAlias;

  const [, , gameCreateSlotQueryV1]: Parameters<HttpClient['createGameSlot']> =
    getRequestParametersOrFail(this, 'createGameSlot', alias);

  type ResponseType = Awaited<ReturnType<HttpClient['createGameSlot']>>;

  const response: ResponseType = await getResponseParametersOrFail(
    this,
    'createGameSlot',
    alias,
  );

  const gameSlotV1: apiModels.NonStartedGameSlotV1 = {
    userId: gameCreateSlotQueryV1.userId,
  };

  expectObjectContaining<ResponseType>(response, {
    body: gameSlotV1,
    headers: {},
    statusCode: HttpStatus.OK,
  });
}

Then<OneGameApiWorld>(
  'the create game response should contain a valid game',
  async function (this: OneGameApiWorld): Promise<void> {
    await thenCreateGameResponseShouldContainValidGame.bind(this)();
  },
);

Then<OneGameApiWorld>(
  'the create game slot response should contain a valid game slot',
  async function (this: OneGameApiWorld): Promise<void> {
    await thenCreateGameResponseShouldContainValidGame.bind(this)();
  },
);
