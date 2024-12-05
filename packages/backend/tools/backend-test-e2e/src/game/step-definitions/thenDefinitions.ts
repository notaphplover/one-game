import * as assert from 'node:assert/strict';

import { HttpClientEndpoints } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { Then } from '@cucumber/cucumber';
import { HttpStatus } from '@nestjs/common';

import { expectObjectContaining } from '../../foundation/adapter/node/assertions/expectObjectContaining';
import { defaultAlias } from '../../foundation/application/data/defaultAlias';
import { OneGameApiWorld } from '../../http/models/OneGameApiWorld';
import { getRequestParametersOrFail } from '../../http/utils/calculations/getRequestOrFail';
import { getResponseParametersOrFail } from '../../http/utils/calculations/getResponseOrFail';
import { GameEventSubscriptionV2Parameter } from '../models/GameEventSubscriptionV2Parameter';
import { GameV1Parameter } from '../models/GameV1Parameter';
import { getGameEventSubscriptionOrFail } from '../utils/calculations/getGameEventSubscriptionOrFail';
import { getGameOrFail } from '../utils/calculations/getGameOrFail';

export function thenCreateGameResponseShouldContainValidGame(
  this: OneGameApiWorld,
  requestAlias?: string,
): void {
  const alias: string = requestAlias ?? defaultAlias;

  const [, gameCreateQueryV1]: Parameters<HttpClientEndpoints['createGame']> =
    getRequestParametersOrFail(this, 'createGame', alias);

  type ResponseType = Awaited<ReturnType<HttpClientEndpoints['createGame']>>;

  const response: ResponseType = getResponseParametersOrFail(
    this,
    'createGame',
    alias,
  );

  expectObjectContaining<ResponseType>(response, {
    body: {
      id: () => undefined,
      name: gameCreateQueryV1.name as string,
    },
    headers: {},
    statusCode: HttpStatus.OK,
  });
}

export function thenCreateGameSlotResponseShouldContainValidGameSlot(
  this: OneGameApiWorld,
  requestAlias?: string,
): void {
  const alias: string = requestAlias ?? defaultAlias;

  const [, , gameCreateSlotQueryV1]: Parameters<
    HttpClientEndpoints['createGameSlot']
  > = getRequestParametersOrFail(this, 'createGameSlot', alias);

  type ResponseType = Awaited<
    ReturnType<HttpClientEndpoints['createGameSlot']>
  >;

  const response: ResponseType = getResponseParametersOrFail(
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

export function thenGetGameResponseShouldContainStartedGame(
  this: OneGameApiWorld,
  gameAlias?: string,
  requestAlias?: string,
): void {
  const processedGameAlias: string = gameAlias ?? defaultAlias;
  const processedRequestAlias: string = requestAlias ?? defaultAlias;

  const gameV1Parameter: GameV1Parameter =
    getGameOrFail.bind(this)(processedGameAlias);

  type ResponseType = Awaited<ReturnType<HttpClientEndpoints['getGame']>>;

  const response: ResponseType = getResponseParametersOrFail(
    this,
    'getGame',
    processedRequestAlias,
  );

  expectObjectContaining<ResponseType>(response, {
    body: {
      id: gameV1Parameter.game.id,
      state: () => undefined,
    },
    headers: {},
    statusCode: HttpStatus.OK,
  });
}

export function thenGetGameSpecResponseShouldContainGameSpec(
  this: OneGameApiWorld,
  requestAlias?: string,
): void {
  const alias: string = requestAlias ?? defaultAlias;

  const [, gameCreateQueryV1]: Parameters<HttpClientEndpoints['createGame']> =
    getRequestParametersOrFail(this, 'createGame', alias);

  type ResponseType = Awaited<
    ReturnType<HttpClientEndpoints['getGameGameIdSpec']>
  >;

  const response: ResponseType = getResponseParametersOrFail(
    this,
    'getGameGameIdSpec',
    alias,
  );

  expectObjectContaining<ResponseType>(response, {
    body: {
      cardSpecs: () => undefined,
      gameSlotsAmount: gameCreateQueryV1.gameSlotsAmount,
      options: gameCreateQueryV1.options,
    },
    headers: {},
    statusCode: HttpStatus.OK,
  });
}

function thenMessageEventMatchesPlayFirstCardRequest(
  this: OneGameApiWorld,
): void {
  type RequestType = Parameters<HttpClientEndpoints['updateGame']>;

  const playFirstCardRequest: RequestType = getRequestParametersOrFail(
    this,
    'updateGame',
    defaultAlias,
  );

  const gameEventSubscriptionV2Parameter: GameEventSubscriptionV2Parameter =
    getGameEventSubscriptionOrFail.bind(this)(defaultAlias);

  const firstGameEvent: apiModels.GameEventV2 | undefined =
    gameEventSubscriptionV2Parameter.gameEvents[0];

  assert.ok(firstGameEvent !== undefined);
  assert.ok(firstGameEvent.kind === 'cardsPlayed');
  assert.deepEqual(
    firstGameEvent.currentPlayingSlotIndex,
    playFirstCardRequest[2].slotIndex,
  );
}

export function thenUpdateGameResponseShouldBeSuccessful(
  this: OneGameApiWorld,
  requestAlias?: string,
): void {
  const processedRequestAlias: string = requestAlias ?? defaultAlias;

  type ResponseType = Awaited<ReturnType<HttpClientEndpoints['updateGame']>>;

  const response: ResponseType = getResponseParametersOrFail(
    this,
    'updateGame',
    processedRequestAlias,
  );

  expectObjectContaining<ResponseType>(response, {
    body: () => undefined,
    headers: {},
    statusCode: HttpStatus.OK,
  });
}

export function thenUpdateGameResponseShouldContainExpectedCurrentPlayingSlotIndex(
  this: OneGameApiWorld,
  requestAlias: string | undefined,
  expectedPlayingSlotIndex: number,
): void {
  const processedRequestAlias: string = requestAlias ?? defaultAlias;

  type ResponseType = Awaited<ReturnType<HttpClientEndpoints['updateGame']>>;

  const response: ResponseType = getResponseParametersOrFail(
    this,
    'updateGame',
    processedRequestAlias,
  );

  expectObjectContaining<ResponseType>(response, {
    body: {
      state: {
        currentPlayingSlotIndex: expectedPlayingSlotIndex,
      },
    },
    headers: {},
    statusCode: HttpStatus.OK,
  });
}

Then<OneGameApiWorld>(
  'the create game response should contain a valid game',
  function (this: OneGameApiWorld): void {
    thenCreateGameResponseShouldContainValidGame.bind(this)();
  },
);

Then<OneGameApiWorld>(
  'the create game slot response should contain a valid game slot',
  function (this: OneGameApiWorld): void {
    thenCreateGameSlotResponseShouldContainValidGameSlot.bind(this)();
  },
);

Then<OneGameApiWorld>(
  'the get game response should contain a started game',
  function (this: OneGameApiWorld): void {
    thenGetGameResponseShouldContainStartedGame.bind(this)();
  },
);

Then<OneGameApiWorld>(
  'the get game response should contain the game spec',
  function (this: OneGameApiWorld): void {
    thenGetGameSpecResponseShouldContainGameSpec.bind(this)();
  },
);

Then<OneGameApiWorld>(
  'the message event matches the game play first card request',
  function (this: OneGameApiWorld): void {
    thenMessageEventMatchesPlayFirstCardRequest.bind(this)();
  },
);

Then<OneGameApiWorld>(
  'the update game response should be successful',
  function (this: OneGameApiWorld): void {
    thenUpdateGameResponseShouldBeSuccessful.bind(this)();
  },
);

Then<OneGameApiWorld>(
  'the update game response have "{int}" as its current playing slot index',
  function (this: OneGameApiWorld, expectedPlayingSlotIndex: number): void {
    thenUpdateGameResponseShouldContainExpectedCurrentPlayingSlotIndex.bind(
      this,
    )(undefined, expectedPlayingSlotIndex);
  },
);

Then<OneGameApiWorld>(
  'the update game response {string} have "{int}" as its current playing slot index',
  function (
    this: OneGameApiWorld,
    requestAlias: string,
    expectedPlayingSlotIndex: number,
  ): void {
    thenUpdateGameResponseShouldContainExpectedCurrentPlayingSlotIndex.bind(
      this,
    )(requestAlias, expectedPlayingSlotIndex);
  },
);
