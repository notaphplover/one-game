import { models as apiModels } from '@cornie-js/api-models';
import {
  AppError,
  AppErrorKind,
  Either,
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
  RequestQueryParseFailure,
  RequestQueryParseFailureKind,
  RequestService,
  requestContextProperty,
} from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

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

  readonly #requestService: RequestService;

  constructor(@Inject(RequestService) requestService: RequestService) {
    this.#requestService = requestService;
  }

  public async handle(
    request: Request & AuthRequestContextHolder,
  ): Promise<[GameFindQuery]> {
    const parsedPage: Either<RequestQueryParseFailure, number> =
      this.#getParsedPage(request);
    const parsedPageSize: Either<RequestQueryParseFailure, number> =
      this.#getParsedPageSize(request);
    const parsedStatus: Either<
      RequestQueryParseFailure,
      GameStatus | undefined
    > = this.#getParsedStatus(request);

    if (parsedPage.isRight && parsedPageSize.isRight && parsedStatus.isRight) {
      const gameFindQuery: Writable<GameFindQuery> = {
        limit: parsedPageSize.value,
        offset: parsedPageSize.value * (parsedPage.value - 1),
      };

      if (parsedStatus.value !== undefined) {
        gameFindQuery.status = parsedStatus.value;
      }

      const userId: string = this.#parseUserId(request);

      gameFindQuery.gameSlotFindQuery = {
        userId,
      };

      return [gameFindQuery];
    }

    const resultsAndParams: [
      Either<RequestQueryParseFailure, unknown>,
      string,
    ][] = [
      [parsedPage, GetGameV1MineRequestParamHandler.pageQueryParam],
      [parsedPageSize, GetGameV1MineRequestParamHandler.pageSizeQueryParam],
      [parsedStatus, GetGameV1MineRequestParamHandler.statusQueryParam],
    ];

    const errors: string[] =
      this.#requestService.composeErrorMessages(resultsAndParams);

    throw new AppError(
      AppErrorKind.contractViolation,
      `Invalid query params:\n\n${errors.join('\n')}`,
    );
  }

  #buildStatus(gameStatusStringified: string): GameStatus {
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

  #getParsedPage(request: Request): Either<RequestQueryParseFailure, number> {
    return this.#requestService.tryParseIntegerQuery(request, {
      default: DEFAULT_PAGE_VALUE,
      isMultiple: false,
      min: MIN_PAGE_VALUE,
      name: GetGameV1MineRequestParamHandler.pageQueryParam,
    });
  }

  #getParsedPageSize(
    request: Request,
  ): Either<RequestQueryParseFailure, number> {
    return this.#requestService.tryParseIntegerQuery(request, {
      default: DEFAULT_PAGE_SIZE_VALUE,
      isMultiple: false,
      max: MAX_PAGE_SIZE_VALUE,
      min: MIN_PAGE_SIZE_VALUE,
      name: GetGameV1MineRequestParamHandler.pageQueryParam,
    });
  }

  #getParsedStatus(
    request: Request,
  ): Either<RequestQueryParseFailure, GameStatus | undefined> {
    const parsedStatus: Either<RequestQueryParseFailure, string> =
      this.#requestService.tryParseStringQuery(request, {
        isMultiple: false,
        name: GetGameV1MineRequestParamHandler.statusQueryParam,
      });

    if (parsedStatus.isRight) {
      return {
        isRight: true,
        value: this.#buildStatus(parsedStatus.value),
      };
    }

    if (parsedStatus.value.kind === RequestQueryParseFailureKind.notFound) {
      return {
        isRight: true,
        value: undefined,
      };
    }

    return parsedStatus;
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
}
