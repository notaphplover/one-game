import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind, Handler } from '@cornie-js/backend-common';
import { Game } from '@cornie-js/backend-game-domain/games';
import {
  Auth,
  AuthKind,
  AuthRequestContextHolder,
  requestContextProperty,
  RequestWithBody,
} from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { GameRequestContextHolder } from '../models/GameRequestContextHolder';
import { PostV1GamesGameIdSlotRequestBodyHandler } from './PostV1GamesGameIdSlotRequestBodyHandler';

@Injectable()
export class PostV1GamesGameIdSlotsRequestParamHandler
  implements
    Handler<
      [RequestWithBody & GameRequestContextHolder],
      [apiModels.GameIdSlotCreateQueryV1, Game, apiModels.UserV1]
    >
{
  readonly #postGameIdSlotV1RequestBodyHandler: Handler<
    [RequestWithBody],
    [apiModels.GameIdSlotCreateQueryV1]
  >;

  constructor(
    @Inject(PostV1GamesGameIdSlotRequestBodyHandler)
    postGameIdSlotV1RequestBodyHandler: Handler<
      [RequestWithBody],
      [apiModels.GameIdSlotCreateQueryV1]
    >,
  ) {
    this.#postGameIdSlotV1RequestBodyHandler =
      postGameIdSlotV1RequestBodyHandler;
  }

  public async handle(
    request: RequestWithBody &
      AuthRequestContextHolder &
      GameRequestContextHolder,
  ): Promise<[apiModels.GameIdSlotCreateQueryV1, Game, apiModels.UserV1]> {
    const auth: Auth = request[requestContextProperty].auth;

    if (auth.kind !== AuthKind.user) {
      throw new AppError(
        AppErrorKind.invalidCredentials,
        'Expecting user based credentials',
      );
    }

    const [gameIdSlotCreateQueryV1]: [apiModels.GameIdSlotCreateQueryV1] =
      await this.#postGameIdSlotV1RequestBodyHandler.handle(request);

    return [
      gameIdSlotCreateQueryV1,
      request[requestContextProperty].game,
      auth.user,
    ];
  }
}
