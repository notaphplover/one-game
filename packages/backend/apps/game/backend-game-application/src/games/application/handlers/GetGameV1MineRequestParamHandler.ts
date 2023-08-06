import { models as apiModels } from '@cornie-js/api-models';
import {
  AppError,
  AppErrorKind,
  Handler,
  Writable,
} from '@cornie-js/backend-common';
import {
  GameFindQuery,
  GameStatus,
} from '@cornie-js/backend-game-domain/games';
import {
  Auth,
  AuthKind,
  AuthRequestContextHolder,
  Request,
  requestContextProperty,
} from '@cornie-js/backend-http';
import { Injectable } from '@nestjs/common';

const GAME_V1_STATE_STATUS_TO_GAME_STATUS_MAP: {
  [TKey in apiModels.GameV1['state']['status']]: GameStatus;
} & { [key: string]: GameStatus } = {
  active: GameStatus.active,
  finished: GameStatus.finished,
  nonStarted: GameStatus.nonStarted,
};

const DEFAULT_PAGE_VALUE: number = 1;
const DEFAULT_PAGE_SIZE_VALUE: number = 10;
const MAX_PAGE_SIZE_VALUE: number = 50;
const MIN_PAGE_VALUE: number = 1;
const MIN_PAGE_SIZE_VALUE: number = 1;

@Injectable()
export class GetGameV1MineRequestParamHandler
  implements Handler<[Request & AuthRequestContextHolder], [GameFindQuery]>
{
  public static pageQueryParam: string = 'page';
  public static pageSizeQueryParam: string = 'pageSize';
  public static statusQueryParam: string = 'status';

  public async handle(
    request: Request & AuthRequestContextHolder,
  ): Promise<[GameFindQuery]> {
    const gameFindQuery: Writable<GameFindQuery> = {};

    const page: number = this.#parsePage(request);
    const pageSize: number = this.#parsePageSize(request);

    gameFindQuery.limit = pageSize;
    gameFindQuery.offset = pageSize * (page - 1);

    const gameStatus: GameStatus | undefined = this.#parseStatus(request);

    if (gameStatus !== undefined) {
      gameFindQuery.status = gameStatus;
    }

    const userId: string = this.#parseUserId(request);

    gameFindQuery.gameSlotFindQuery = {
      userId,
    };

    return [gameFindQuery];
  }

  #parsePage(request: Request): number {
    const page: number =
      this.#tryGetIntegerRequestQueryOrDefault(
        request,
        GetGameV1MineRequestParamHandler.pageQueryParam,
      ) ?? DEFAULT_PAGE_VALUE;

    if (page < MIN_PAGE_VALUE) {
      throw new AppError(
        AppErrorKind.contractViolation,
        `Expecting "${GetGameV1MineRequestParamHandler.pageQueryParam}" query to be at least ${MIN_PAGE_VALUE}`,
      );
    }

    return page;
  }

  #parsePageSize(request: Request): number {
    const pageSize: number =
      this.#tryGetIntegerRequestQueryOrDefault(
        request,
        GetGameV1MineRequestParamHandler.pageSizeQueryParam,
      ) ?? DEFAULT_PAGE_SIZE_VALUE;

    if (pageSize < MIN_PAGE_SIZE_VALUE) {
      throw new AppError(
        AppErrorKind.contractViolation,
        `Expecting "${GetGameV1MineRequestParamHandler.pageSizeQueryParam}" query to be at least ${MIN_PAGE_SIZE_VALUE}`,
      );
    }

    if (pageSize > MAX_PAGE_SIZE_VALUE) {
      throw new AppError(
        AppErrorKind.contractViolation,
        `Expecting "${GetGameV1MineRequestParamHandler.pageSizeQueryParam}" query to be at most ${MAX_PAGE_SIZE_VALUE}`,
      );
    }

    return pageSize;
  }

  #parseStatus(request: Request): GameStatus | undefined {
    const gameStatusStringified: string | undefined =
      this.#tryGetStringRequestQueryOrDefault(
        request,
        GetGameV1MineRequestParamHandler.statusQueryParam,
      );

    if (gameStatusStringified === undefined) {
      return undefined;
    }

    const gameStatusOrUndefined: GameStatus | undefined =
      GAME_V1_STATE_STATUS_TO_GAME_STATUS_MAP[gameStatusStringified];

    if (gameStatusOrUndefined === undefined) {
      const expectedValues: string[] = Object.keys(
        GAME_V1_STATE_STATUS_TO_GAME_STATUS_MAP,
      );

      throw new AppError(
        AppErrorKind.contractViolation,
        `Expected "${
          GetGameV1MineRequestParamHandler.statusQueryParam
        }" query to be one of the following values: ${expectedValues.join(
          ',',
        )}`,
      );
    }

    return gameStatusOrUndefined;
  }

  #parseUserId(request: AuthRequestContextHolder): string {
    const auth: Auth = request[requestContextProperty].auth;

    if (auth.kind !== AuthKind.user) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        'Unnable to retrieve user from non user credentials',
      );
    }

    return auth.user.id;
  }

  #tryGetIntegerRequestQueryOrDefault(
    request: Request,
    name: string,
  ): number | undefined {
    const queryValue: number | undefined =
      this.#tryGetNumberRequestQueryOrDefault(request, name);

    if (queryValue === undefined) {
      return undefined;
    }

    if (!Number.isInteger(queryValue)) {
      throw new AppError(
        AppErrorKind.contractViolation,
        `Expecting "${name}" query to be a single integer value`,
      );
    }

    return queryValue;
  }

  #tryGetNumberRequestQueryOrDefault(
    request: Request,
    name: string,
  ): number | undefined {
    const queryValue: string | undefined =
      this.#tryGetStringRequestQueryOrDefault(request, name);

    if (queryValue === undefined) {
      return undefined;
    }

    const numericQueryValue: number = parseFloat(queryValue);

    if (Number.isNaN(numericQueryValue)) {
      throw new AppError(
        AppErrorKind.contractViolation,
        `Expecting "${name}" query to be a single numeric value`,
      );
    }

    return numericQueryValue;
  }

  #tryGetStringRequestQueryOrDefault(
    request: Request,
    name: string,
  ): string | undefined {
    const queryValue: string | string[] | undefined = request.query[name];

    if (Array.isArray(queryValue)) {
      throw new AppError(
        AppErrorKind.contractViolation,
        `Expected "${name}" query to be a single value`,
      );
    }

    return queryValue;
  }
}
