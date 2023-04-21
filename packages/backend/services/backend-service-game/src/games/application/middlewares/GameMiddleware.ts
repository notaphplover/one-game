import { Inject, Injectable } from '@nestjs/common';
import { AppError, AppErrorKind } from '@one-game-js/backend-common';
import {
  Middleware,
  Request,
  RequestContextHolder,
  RequestWithBody,
  requestContextProperty,
} from '@one-game-js/backend-http';

import { Game } from '../../domain/models/Game';
import { GameRequestContext } from '../models/GameRequestContext';
import {
  GamePersistenceOutputPort,
  gamePersistenceOutputPortSymbol,
} from '../ports/output/GamePersistenceOutputPort';

@Injectable()
export class GameMiddleware implements Middleware {
  public static gameIdParam: string = 'gameId';

  readonly #gamePersistenceOutputPort: GamePersistenceOutputPort;

  constructor(
    @Inject(gamePersistenceOutputPortSymbol)
    gamePersistenceOutputPort: GamePersistenceOutputPort,
  ) {
    this.#gamePersistenceOutputPort = gamePersistenceOutputPort;
  }

  public async handle(request: Request | RequestWithBody): Promise<void> {
    const gameId: string | undefined =
      request.urlParameters[GameMiddleware.gameIdParam];

    if (gameId === undefined) {
      throw new AppError(
        AppErrorKind.unknown,
        'Unable to parse request game id',
      );
    }

    const game: Game | undefined =
      await this.#gamePersistenceOutputPort.findOne({ id: gameId });

    if (game === undefined) {
      throw new AppError(
        AppErrorKind.entityNotFound,
        `Unable to process request. Game "${gameId}" not found`,
      );
    }

    this.#setContext(request, game);
  }

  #setContext(request: Request | RequestWithBody, game: Game): void {
    let requestContext: Record<string | symbol, unknown> | undefined = (
      request as Partial<RequestContextHolder>
    )[requestContextProperty];

    if (
      (request as Partial<RequestContextHolder>)[requestContextProperty] ===
      undefined
    ) {
      requestContext = {};

      (request as Partial<RequestContextHolder>)[requestContextProperty] =
        requestContext;
    }

    (requestContext as GameRequestContext).game = game;
  }
}
