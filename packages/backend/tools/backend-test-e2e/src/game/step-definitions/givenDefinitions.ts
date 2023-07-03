import { HttpClient } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { Given } from '@cucumber/cucumber';
import { HttpStatus } from '@nestjs/common';

import { AuthV1Parameter } from '../../auth/models/AuthV1Parameter';
import { getAuthOrFail } from '../../auth/utils/calculations/getAuthOrFail';
import { defaultAlias } from '../../foundation/application/data/defaultAlias';
import { OneGameApiWorld } from '../../http/models/OneGameApiWorld';
import { setRequestParameters } from '../../http/utils/actions/setRequestParameters';
import { getRequestParametersOrFail } from '../../http/utils/calculations/getRequestOrFail';
import { getResponseParametersOrFail } from '../../http/utils/calculations/getResponseOrFail';
import { UserV1Parameter } from '../../user/models/UserV1Parameter';
import { getUserOrFail } from '../../user/utils/calculations/getUserOrFail';
import { GameV1Parameter } from '../models/GameV1Parameter';
import { setGame } from '../utils/actions/setGame';
import { getGameOrFail } from '../utils/calculations/getGameOrFail';
import {
  whenCreateGameRequestIsSend,
  whenCreateGameSlotRequestIsSend,
  whenGetGameRequestIsSend,
} from './whenDefinitions';

const INDEX_NOT_FOUND_RESULT: number = -1;

export function givenGameFindQueryRequestForGame(
  this: OneGameApiWorld,
  gameAlias?: string,
  requestAlias?: string,
  userAlias?: string,
): void {
  const processedGameAlias: string = gameAlias ?? defaultAlias;
  const processedRequestAlias: string = requestAlias ?? defaultAlias;
  const processedUserAlias: string = userAlias ?? defaultAlias;

  const gameV1Parameter: GameV1Parameter =
    getGameOrFail.bind(this)(processedGameAlias);

  const authV1Parameter: AuthV1Parameter =
    getAuthOrFail.bind(this)(processedUserAlias);

  const getGameV1Request: Parameters<HttpClient['getGame']> = [
    {
      authorization: `Bearer ${authV1Parameter.auth.jwt}`,
    },
    {
      gameId: gameV1Parameter.game.id,
    },
  ];

  setRequestParameters.bind(this)(
    'getGame',
    processedRequestAlias,
    getGameV1Request,
  );
}

export function givenCreateGameRequestForPlayersWithUserCredentials(
  this: OneGameApiWorld,
  gameSlotsAmount: number,
  gameOptions?: apiModels.GameOptionsV1,
  gameAlias?: string,
  userAlias?: string,
): void {
  const processedGameAlias: string = gameAlias ?? defaultAlias;
  const processedUserAlias: string = userAlias ?? defaultAlias;
  const processedGameOptions: apiModels.GameOptionsV1 = gameOptions ?? {
    chainDraw2Draw2Cards: false,
    chainDraw2Draw4Cards: false,
    chainDraw4Draw2Cards: false,
    chainDraw4Draw4Cards: false,
    playCardIsMandatory: false,
    playMultipleSameCards: false,
    playWildDraw4IfNoOtherAlternative: true,
  };

  const auth: AuthV1Parameter = getAuthOrFail.bind(this)(processedUserAlias);

  const gameCreateQueryV1: apiModels.GameCreateQueryV1 = {
    gameSlotsAmount,
    options: processedGameOptions,
  };

  const requestParameters: Parameters<HttpClient['createGame']> = [
    {
      authorization: `Bearer ${auth.auth.jwt}`,
    },
    gameCreateQueryV1,
  ];

  setRequestParameters.bind(this)(
    'createGame',
    processedGameAlias,
    requestParameters,
  );
}

export function givenCreateGameSlotRequestForPlayerWithUserCredentials(
  this: OneGameApiWorld,
  gameAlias?: string,
  requestAlias?: string,
  userAlias?: string,
): void {
  const processedGameAlias: string = gameAlias ?? defaultAlias;
  const processedRequestAlias: string = requestAlias ?? defaultAlias;
  const processedUserAlias: string = userAlias ?? defaultAlias;

  const auth: AuthV1Parameter = getAuthOrFail.bind(this)(processedUserAlias);

  const gameV1Parameter: GameV1Parameter =
    getGameOrFail.bind(this)(processedGameAlias);

  const userV1Parameter: UserV1Parameter =
    getUserOrFail.bind(this)(processedUserAlias);

  const gameSlotCreateQueryV1: apiModels.GameIdSlotCreateQueryV1 = {
    userId: userV1Parameter.user.id,
  };

  const requestParameters: Parameters<HttpClient['createGameSlot']> = [
    {
      authorization: `Bearer ${auth.auth.jwt}`,
    },
    {
      gameId: gameV1Parameter.game.id,
    },
    gameSlotCreateQueryV1,
  ];

  setRequestParameters.bind(this)(
    'createGameSlot',
    processedRequestAlias,
    requestParameters,
  );
}

export async function givenGameForPlayersWithUserCredentials(
  this: OneGameApiWorld,
  gameSlotsAmount: number,
  gameOptions?: apiModels.GameOptionsV1,
  gameAlias?: string,
  userAlias?: string,
): Promise<void> {
  const processedGameAlias: string = gameAlias ?? defaultAlias;
  const processedUserAlias: string = userAlias ?? defaultAlias;

  givenCreateGameRequestForPlayersWithUserCredentials.bind(this)(
    gameSlotsAmount,
    gameOptions,
    processedGameAlias,
    processedUserAlias,
  );

  await whenCreateGameRequestIsSend.bind(this)(processedGameAlias);

  const [, gameCreateQueryV1]: Parameters<HttpClient['createGame']> =
    getRequestParametersOrFail(this, 'createGame', processedGameAlias);

  type ResponseType = Awaited<ReturnType<HttpClient['createGame']>>;

  const response: ResponseType = getResponseParametersOrFail(
    this,
    'createGame',
    processedGameAlias,
  );

  if (response.statusCode !== HttpStatus.OK) {
    throw new Error(
      `Expected game to be created, an unexpected ${response.statusCode} status code was received instead`,
    );
  }

  const gameParameter: GameV1Parameter = {
    game: response.body,
    gameCreateQuery: gameCreateQueryV1,
  };

  setGame.bind(this)(processedGameAlias, gameParameter);
}

export function givenGamePassTurnQueryRequestForGame(
  this: OneGameApiWorld,
  gameAlias?: string,
  requestAlias?: string,
  userAlias?: string,
): void {
  const processedGameAlias: string = gameAlias ?? defaultAlias;
  const processedRequestAlias: string = requestAlias ?? defaultAlias;
  const processedUserAlias: string = userAlias ?? defaultAlias;

  const gameV1Parameter: GameV1Parameter =
    getGameOrFail.bind(this)(processedGameAlias);

  const authV1Parameter: AuthV1Parameter =
    getAuthOrFail.bind(this)(processedUserAlias);

  const userV1Parameter: UserV1Parameter =
    getUserOrFail.bind(this)(processedUserAlias);

  const slotIndex: number = gameV1Parameter.game.slots.findIndex(
    (slot: apiModels.GameSlotV1) => slot.userId === userV1Parameter.user.id,
  );

  if (slotIndex === INDEX_NOT_FOUND_RESULT) {
    throw new Error(
      `Expecting a slow owned by "${processedUserAlias}", none found`,
    );
  }

  const updateGameV1Request: Parameters<HttpClient['updateGame']> = [
    {
      authorization: `Bearer ${authV1Parameter.auth.jwt}`,
    },
    {
      gameId: gameV1Parameter.game.id,
    },
    {
      kind: 'passTurn',
      slotIndex: slotIndex,
    },
  ];

  setRequestParameters.bind(this)(
    'updateGame',
    processedRequestAlias,
    updateGameV1Request,
  );
}

export async function givenStartedGameForPlayersWithUserCredentials(
  this: OneGameApiWorld,
  playerAliases: string[],
  gameOptions?: apiModels.GameOptionsV1,
  gameAlias?: string,
  userAlias?: string,
): Promise<void> {
  await givenGameForPlayersWithUserCredentials.bind(this)(
    playerAliases.length,
    gameOptions,
    gameAlias,
    userAlias,
  );

  for (const playerAlias of playerAliases) {
    givenCreateGameSlotRequestForPlayerWithUserCredentials.bind(this)(
      gameAlias,
      playerAlias,
      playerAlias,
    );

    await whenCreateGameSlotRequestIsSend.bind(this)(playerAlias);
  }

  await updateGameParameter.bind(this)(gameAlias, userAlias);
}

async function updateGameParameter(
  this: OneGameApiWorld,
  gameAlias?: string,
  userAlias?: string,
): Promise<void> {
  const processedGameAlias: string = gameAlias ?? defaultAlias;
  const processedUserAlias: string = userAlias ?? defaultAlias;

  const gameV1Parameter: GameV1Parameter =
    getGameOrFail.bind(this)(processedGameAlias);

  const authV1Parameter: AuthV1Parameter =
    getAuthOrFail.bind(this)(processedUserAlias);

  type GetGameParameters = Parameters<HttpClient['getGame']>;

  const getGameParameters: GetGameParameters = [
    {
      authorization: `Bearer ${authV1Parameter.auth.jwt}`,
    },
    {
      gameId: gameV1Parameter.game.id,
    },
  ];

  setRequestParameters.bind(this)(
    'getGame',
    processedGameAlias,
    getGameParameters,
  );

  await whenGetGameRequestIsSend.bind(this)(processedGameAlias);

  type ResponseType = Awaited<ReturnType<HttpClient['getGame']>>;

  const response: ResponseType = getResponseParametersOrFail(
    this,
    'getGame',
    processedGameAlias,
  );

  if (response.statusCode !== HttpStatus.OK) {
    throw new Error(
      `Expected game to be found, an unexpected ${response.statusCode} status code was received instead`,
    );
  }

  const updatedGameV1Parameter: GameV1Parameter = {
    game: response.body,
    gameCreateQuery: gameV1Parameter.gameCreateQuery,
  };

  setGame.bind(this)(processedGameAlias, updatedGameV1Parameter);
}

Given<OneGameApiWorld>(
  'a get game request for game for {string}',
  function (this: OneGameApiWorld, userAlias: string): void {
    givenGameFindQueryRequestForGame.bind(this)(
      undefined,
      undefined,
      userAlias,
    );
  },
);

Given<OneGameApiWorld>(
  'a create game request for {int} player(s) with {string} credentials',
  function (
    this: OneGameApiWorld,
    gameSlotsAmount: number,
    userAlias: string,
  ): void {
    givenCreateGameRequestForPlayersWithUserCredentials.bind(this)(
      gameSlotsAmount,
      undefined,
      undefined,
      userAlias,
    );
  },
);

Given<OneGameApiWorld>(
  'a game for {int} players created with {string} credentials',
  async function (
    this: OneGameApiWorld,
    gameSlotsAmount: number,
    userAlias: string,
  ): Promise<void> {
    await givenGameForPlayersWithUserCredentials.bind(this)(
      gameSlotsAmount,
      undefined,
      undefined,
      userAlias,
    );
  },
);

Given<OneGameApiWorld>(
  'a game pass turn request for game for {string}',
  function (this: OneGameApiWorld, userAlias: string): void {
    givenGamePassTurnQueryRequestForGame.bind(this)(
      undefined,
      undefined,
      userAlias,
    );
  },
);

Given<OneGameApiWorld>(
  'a game slot create query for game for {string}',
  function (this: OneGameApiWorld, userAlias: string): void {
    givenCreateGameSlotRequestForPlayerWithUserCredentials.bind(this)(
      undefined,
      undefined,
      userAlias,
    );
  },
);

Given<OneGameApiWorld>(
  'a game slot create query {string} for game for {string}',
  function (
    this: OneGameApiWorld,
    requestAlias: string,
    userAlias: string,
  ): void {
    givenCreateGameSlotRequestForPlayerWithUserCredentials.bind(this)(
      undefined,
      requestAlias,
      userAlias,
    );
  },
);

Given<OneGameApiWorld>(
  'a started game with non mandatory card play for {stringList} created with {string} credentials',
  async function (
    this: OneGameApiWorld,
    playerAliases: string[],
    userAlias: string,
  ): Promise<void> {
    await givenStartedGameForPlayersWithUserCredentials.bind(this)(
      playerAliases,
      {
        chainDraw2Draw2Cards: true,
        chainDraw2Draw4Cards: true,
        chainDraw4Draw2Cards: true,
        chainDraw4Draw4Cards: true,
        playCardIsMandatory: false,
        playMultipleSameCards: true,
        playWildDraw4IfNoOtherAlternative: false,
      },
      undefined,
      userAlias,
    );
  },
);
