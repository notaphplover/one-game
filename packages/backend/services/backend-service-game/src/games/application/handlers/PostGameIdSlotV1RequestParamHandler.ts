import { Inject, Injectable } from '@nestjs/common';
import { models as apiModels } from '@one-game-js/api-models';
import { Handler } from '@one-game-js/backend-common';
import {
  RequestWithBody,
  requestContextProperty,
} from '@one-game-js/backend-http';

import { Game } from '../../domain/models/Game';
import { GameRequestContextHolder } from '../models/GameRequestContextHolder';
import { PostGameIdSlotV1RequestBodyHandler } from './PostGameIdSlotV1RequestBodyHandler';

@Injectable()
export class PostGameIdSlotV1RequestParamHandler
  implements
    Handler<
      [RequestWithBody & GameRequestContextHolder],
      [apiModels.GameIdSlotCreateQueryV1, Game]
    >
{
  readonly #postGameIdSlotV1RequestBodyHandler: Handler<
    [RequestWithBody],
    [apiModels.GameIdSlotCreateQueryV1]
  >;

  constructor(
    @Inject(PostGameIdSlotV1RequestBodyHandler)
    postGameIdSlotV1RequestBodyHandler: Handler<
      [RequestWithBody],
      [apiModels.GameIdSlotCreateQueryV1]
    >,
  ) {
    this.#postGameIdSlotV1RequestBodyHandler =
      postGameIdSlotV1RequestBodyHandler;
  }

  public async handle(
    request: RequestWithBody & GameRequestContextHolder,
  ): Promise<[apiModels.GameIdSlotCreateQueryV1, Game]> {
    const [gameIdSlotCreateQueryV1]: [apiModels.GameIdSlotCreateQueryV1] =
      await this.#postGameIdSlotV1RequestBodyHandler.handle(request);

    return [gameIdSlotCreateQueryV1, request[requestContextProperty].game];
  }
}
