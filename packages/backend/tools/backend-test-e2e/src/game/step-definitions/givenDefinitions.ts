import { HttpClientEndpoints } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { Given } from '@cucumber/cucumber';
import { HttpStatus } from '@nestjs/common';

import { AuthV2Parameter } from '../../auth/models/AuthV2Parameter';
import { getAuthOrFail } from '../../auth/utils/calculations/getAuthOrFail';
import { CardArrayV1Parameter } from '../../card/models/CardArrayV1Parameter';
import { CardV1Parameter } from '../../card/models/CardV1Parameter';
import { getCardArrayOrFail } from '../../card/utils/calculations/getCardArrayOrFail';
import { defaultAlias } from '../../foundation/application/data/defaultAlias';
import { OneGameApiWorld } from '../../http/models/OneGameApiWorld';
import { setRequestParameters } from '../../http/utils/actions/setRequestParameters';
import { getRequestParametersOrFail } from '../../http/utils/calculations/getRequestOrFail';
import { getResponseParametersOrFail } from '../../http/utils/calculations/getResponseOrFail';
import { UserV1Parameter } from '../../user/models/UserV1Parameter';
import { getUserOrFail } from '../../user/utils/calculations/getUserOrFail';
import { GameEventSubscriptionV2Parameter } from '../models/GameEventSubscriptionV2Parameter';
import { GameOptionsV1Parameter } from '../models/GameOptionsV1Parameter';
import { GameV1Parameter } from '../models/GameV1Parameter';
import { CustomEventSource } from '../modules/CustomEventSource';
import { setGame } from '../utils/actions/setGame';
import { setGameEventSubscription } from '../utils/actions/setGameEventSubscription';
import { setGameOptions } from '../utils/actions/setGameOptions';
import { updateActiveGame } from '../utils/actions/updateActiveGame';
import { getGameOptionsOrFail } from '../utils/calculations/getGameOptionsOrFail';
import { getGameOrFail } from '../utils/calculations/getGameOrFail';
import {
  whenCreateGameRequestIsSend,
  whenCreateGameSlotRequestIsSend,
  whenGetGameRequestIsSend,
} from './whenDefinitions';

/**
 * A message received by a target object.
 *
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/MessageEvent)
 *
 * EDIT: interface simplified to be a workaround for missing node types.
 */
interface MessageEvent<T = unknown> extends Event {
  /**
   * Returns the data of the message.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/MessageEvent/data)
   */
  readonly data: T;
  /**
   * Returns the last event ID string, for server-sent events.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/MessageEvent/lastEventId)
   */
  readonly lastEventId: string;
  /**
   * Returns the origin of the message, for server-sent events and cross-document messaging.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/MessageEvent/origin)
   */
  readonly origin: string;
}

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

  const authV2Parameter: AuthV2Parameter =
    getAuthOrFail.bind(this)(processedUserAlias);

  const getGameV1Request: Parameters<HttpClientEndpoints['getGame']> = [
    {
      authorization: `Bearer ${authV2Parameter.auth.accessToken}`,
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

  const auth: AuthV2Parameter = getAuthOrFail.bind(this)(processedUserAlias);

  const gameCreateQueryV1: apiModels.GameCreateQueryV1 = {
    gameSlotsAmount,
    name: 'Game created by E2E tests',
    options: processedGameOptions,
  };

  const requestParameters: Parameters<HttpClientEndpoints['createGame']> = [
    {
      authorization: `Bearer ${auth.auth.accessToken}`,
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

  const auth: AuthV2Parameter = getAuthOrFail.bind(this)(processedUserAlias);

  const gameV1Parameter: GameV1Parameter =
    getGameOrFail.bind(this)(processedGameAlias);

  const userV1Parameter: UserV1Parameter =
    getUserOrFail.bind(this)(processedUserAlias);

  const gameSlotCreateQueryV1: apiModels.GameIdSlotCreateQueryV1 = {
    userId: userV1Parameter.user.id,
  };

  const requestParameters: Parameters<HttpClientEndpoints['createGameSlot']> = [
    {
      authorization: `Bearer ${auth.auth.accessToken}`,
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

function givenGameEventSubscriptionForGame(
  this: OneGameApiWorld,
  gameAlias?: string,
  userAlias?: string,
): void {
  const processedGameAlias: string = gameAlias ?? defaultAlias;
  const processedUserAlias: string = userAlias ?? defaultAlias;

  const gameV1Parameter: GameV1Parameter =
    getGameOrFail.bind(this)(processedGameAlias);

  const authV2Parameter: AuthV2Parameter =
    getAuthOrFail.bind(this)(processedUserAlias);

  const parameter: GameEventSubscriptionV2Parameter = {
    eventSource: new CustomEventSource(
      `${this.env.backendBaseUrl}/v2/events/games/${gameV1Parameter.game.id}`,
      {
        token: authV2Parameter.auth.accessToken,
      },
    ),
    gameEvents: [],
  };

  parameter.eventSource.onmessage = (event: MessageEvent) => {
    parameter.gameEvents.push(
      JSON.parse(event.data as string) as apiModels.GameEventV2,
    );
  };

  setGameEventSubscription.bind(this)(processedGameAlias, parameter);
}

export function givenGameOptions(
  this: OneGameApiWorld,
  gameOptions: apiModels.GameOptionsV1,
  gameSpecAlias?: string,
): void {
  const processedGameSpecAlias: string = gameSpecAlias ?? defaultAlias;

  setGameOptions.bind(this)(processedGameSpecAlias, {
    options: gameOptions,
  });
}

export function givenGetGameSpecRequestForGameWithUserCredentials(
  this: OneGameApiWorld,
  gameAlias?: string,
  userAlias?: string,
): void {
  const processedGameAlias: string = gameAlias ?? defaultAlias;
  const processedUserAlias: string = userAlias ?? defaultAlias;

  const authParameter: AuthV2Parameter =
    getAuthOrFail.bind(this)(processedUserAlias);
  const gameV1Parameter: GameV1Parameter =
    getGameOrFail.bind(this)(processedGameAlias);

  const requestParameters: Parameters<
    HttpClientEndpoints['getGameGameIdSpec']
  > = [
    {
      authorization: `Bearer ${authParameter.auth.accessToken}`,
    },
    {
      gameId: gameV1Parameter.game.id,
    },
  ];

  setRequestParameters.bind(this)(
    'getGameGameIdSpec',
    processedGameAlias,
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

  const [, gameCreateQueryV1]: Parameters<HttpClientEndpoints['createGame']> =
    getRequestParametersOrFail(this, 'createGame', processedGameAlias);

  type ResponseType = Awaited<ReturnType<HttpClientEndpoints['createGame']>>;

  const response: ResponseType = getResponseParametersOrFail(
    this,
    'createGame',
    processedGameAlias,
  );

  if (response.statusCode !== HttpStatus.OK) {
    throw new Error(
      `Expected game to be created, an unexpected ${response.statusCode.toString()} status code was received instead`,
    );
  }

  const gameParameter: GameV1Parameter = {
    game: response.body,
    gameCreateQuery: gameCreateQueryV1,
  };

  setGame.bind(this)(processedGameAlias, gameParameter);
}

export function givenGameUpdateQueryRequestForGame(
  this: OneGameApiWorld,
  buildGameUpdateQueryV1: (slotIndex: number) => apiModels.GameIdUpdateQueryV1,
  gameAlias?: string,
  requestAlias?: string,
  userAlias?: string,
): void {
  const processedGameAlias: string = gameAlias ?? defaultAlias;
  const processedRequestAlias: string = requestAlias ?? defaultAlias;
  const processedUserAlias: string = userAlias ?? defaultAlias;

  const gameV1Parameter: GameV1Parameter =
    getGameOrFail.bind(this)(processedGameAlias);

  const authV2Parameter: AuthV2Parameter =
    getAuthOrFail.bind(this)(processedUserAlias);

  const userV1Parameter: UserV1Parameter =
    getUserOrFail.bind(this)(processedUserAlias);

  const slotIndex: number = gameV1Parameter.game.state.slots.findIndex(
    (slot: apiModels.GameSlotV1) => slot.userId === userV1Parameter.user.id,
  );

  if (slotIndex === INDEX_NOT_FOUND_RESULT) {
    throw new Error(
      `Expecting a slow owned by "${processedUserAlias}", none found`,
    );
  }

  const updateGameV1Request: Parameters<HttpClientEndpoints['updateGame']> = [
    {
      authorization: `Bearer ${authV2Parameter.auth.accessToken}`,
    },
    {
      gameId: gameV1Parameter.game.id,
    },
    buildGameUpdateQueryV1(slotIndex),
  ];

  setRequestParameters.bind(this)(
    'updateGame',
    processedRequestAlias,
    updateGameV1Request,
  );
}

export function givenGameDrawCardsQueryRequestForGame(
  this: OneGameApiWorld,
  gameAlias?: string,
  requestAlias?: string,
  userAlias?: string,
): void {
  givenGameUpdateQueryRequestForGame.bind(this)(
    (slotIndex: number) => ({
      kind: 'drawCards',
      slotIndex: slotIndex,
    }),
    gameAlias,
    requestAlias,
    userAlias,
  );
}

export function givenGamePassTurnQueryRequestForGame(
  this: OneGameApiWorld,
  gameAlias?: string,
  requestAlias?: string,
  userAlias?: string,
): void {
  givenGameUpdateQueryRequestForGame.bind(this)(
    (slotIndex: number) => ({
      kind: 'passTurn',
      slotIndex: slotIndex,
    }),
    gameAlias,
    requestAlias,
    userAlias,
  );
}

export function givenGamePlayFirstCardQueryRequestForGame(
  this: OneGameApiWorld,
  gameAlias?: string,
  requestAlias?: string,
  userAlias?: string,
  colorChoice?: apiModels.CardColorV1,
): void {
  givenGameUpdateQueryRequestForGame.bind(this)(
    (slotIndex: number) => {
      const updateGameV1RequestBody: apiModels.GameIdPlayCardsQueryV1 = {
        cardIndexes: [0],
        kind: 'playCards',
        slotIndex: slotIndex,
      };

      if (colorChoice !== undefined) {
        updateGameV1RequestBody.colorChoice = colorChoice;
      }

      return updateGameV1RequestBody;
    },
    gameAlias,
    requestAlias,
    userAlias,
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

  const gameV1Parameter: GameV1Parameter = getGameOrFail.bind(this)(
    gameAlias ?? defaultAlias,
  );

  await updateActiveGame(undefined, 0, gameV1Parameter, []);

  await updateGameParameter.bind(this)(gameAlias, userAlias);
}

export async function givenStartedGameForTwoPlayersWithUserCredentials(
  this: OneGameApiWorld,
  cardV1Parameter: CardV1Parameter,
  firstUserAlias: string,
  firstUserCardAlias: string,
  secondUserAlias: string,
  credentialsAlias: string,
): Promise<void> {
  const gameOptionsV1Parameter: GameOptionsV1Parameter =
    getGameOptionsOrFail.bind(this)(defaultAlias);

  await givenStartedGameForPlayersWithUserCredentials.bind(this)(
    [firstUserAlias, secondUserAlias],
    gameOptionsV1Parameter.options,
    defaultAlias,
    credentialsAlias,
  );

  const gameV1Parameter: GameV1Parameter =
    getGameOrFail.bind(this)(defaultAlias);

  const firstUserV1Parameter: UserV1Parameter =
    getUserOrFail.bind(this)(firstUserAlias);

  const firstUserCardsV1Parameter: CardArrayV1Parameter =
    getCardArrayOrFail.bind(this)(firstUserCardAlias);

  await updateActiveGame(cardV1Parameter, 0, gameV1Parameter, [
    [firstUserV1Parameter, firstUserCardsV1Parameter],
  ]);

  await updateGameParameter.bind(this)(undefined, credentialsAlias);
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

  const authV2Parameter: AuthV2Parameter =
    getAuthOrFail.bind(this)(processedUserAlias);

  type GetGameParameters = Parameters<HttpClientEndpoints['getGame']>;

  const getGameParameters: GetGameParameters = [
    {
      authorization: `Bearer ${authV2Parameter.auth.accessToken}`,
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

  type ResponseType = Awaited<ReturnType<HttpClientEndpoints['getGame']>>;

  const response: ResponseType = getResponseParametersOrFail(
    this,
    'getGame',
    processedGameAlias,
  );

  if (response.statusCode !== HttpStatus.OK) {
    throw new Error(
      `Expected game to be found, an unexpected ${response.statusCode.toString()} status code was received instead`,
    );
  }

  const updatedGameV1Parameter: GameV1Parameter = {
    game: response.body,
    gameCreateQuery: gameV1Parameter.gameCreateQuery,
  };

  setGame.bind(this)(processedGameAlias, updatedGameV1Parameter);
}

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
  'a game draw cards request for game for {string}',
  function (this: OneGameApiWorld, userAlias: string): void {
    givenGameDrawCardsQueryRequestForGame.bind(this)(
      undefined,
      undefined,
      userAlias,
    );
  },
);

Given<OneGameApiWorld>(
  'a game draw cards request {string} for game for {string}',
  function (
    this: OneGameApiWorld,
    requestAlias: string,
    userAlias: string,
  ): void {
    givenGameDrawCardsQueryRequestForGame.bind(this)(
      undefined,
      requestAlias,
      userAlias,
    );
  },
);

Given<OneGameApiWorld>(
  'a game event subscription for game with {string} credentials',
  async function (this: OneGameApiWorld, userAlias: string): Promise<void> {
    givenGameEventSubscriptionForGame.bind(this)(undefined, userAlias);
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
  'a game pass turn request {string} for game for {string}',
  function (
    this: OneGameApiWorld,
    requestAlias: string,
    userAlias: string,
  ): void {
    givenGamePassTurnQueryRequestForGame.bind(this)(
      undefined,
      requestAlias,
      userAlias,
    );
  },
);

Given<OneGameApiWorld>(
  'a game play first card request for game for {string}',
  function (this: OneGameApiWorld, userAlias: string): void {
    givenGamePlayFirstCardQueryRequestForGame.bind(this)(
      undefined,
      undefined,
      userAlias,
      undefined,
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
  'a get game spec request for the game with {string} credentials',
  function (this: OneGameApiWorld, userAlias: string): void {
    givenGetGameSpecRequestForGameWithUserCredentials.bind(this)(
      defaultAlias,
      userAlias,
    );
  },
);

Given<OneGameApiWorld>(
  'a started game with current card {card} for {string} with {string} and {string} created with {string} credentials',
  async function (
    this: OneGameApiWorld,
    cardParameter: CardV1Parameter,
    firstUserAlias: string,
    firstUserCardAlias: string,
    secondUserAlias: string,
    credentialsAlias: string,
  ): Promise<void> {
    await givenStartedGameForTwoPlayersWithUserCredentials.bind(this)(
      cardParameter,
      firstUserAlias,
      firstUserCardAlias,
      secondUserAlias,
      credentialsAlias,
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

Given<OneGameApiWorld>(
  'game options with non mandatory card play',
  function (this: OneGameApiWorld): void {
    givenGameOptions.bind(this)({
      chainDraw2Draw2Cards: true,
      chainDraw2Draw4Cards: true,
      chainDraw4Draw2Cards: true,
      chainDraw4Draw4Cards: true,
      playCardIsMandatory: false,
      playMultipleSameCards: true,
      playWildDraw4IfNoOtherAlternative: false,
    });
  },
);
