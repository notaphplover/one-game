import {
  AppError,
  AppErrorKind,
  Builder,
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
  requestContextProperty,
  RequestQueryParseFailure,
  RequestQueryParseFailureKind,
  RequestService,
} from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { GameStatusFromGameV1StatusBuilder } from '../builders/GameStatusFromGameV1StatusBuilder';

const DEFAULT_PAGE_VALUE: number = 1;
const DEFAULT_PAGE_SIZE_VALUE: number = 10;
const MAX_PAGE_SIZE_VALUE: number = 50;
const MIN_PAGE_VALUE: number = 1;
const MIN_PAGE_SIZE_VALUE: number = 1;

@Injectable()
export class GetV1GamesMineRequestParamHandler
  implements Handler<[Request & AuthRequestContextHolder], [GameFindQuery]>
{
  public static pageQueryParam: string = 'page';
  public static pageSizeQueryParam: string = 'pageSize';
  public static statusQueryParam: string = 'status';

  readonly #gameStatusFromGameV1StatusBuilder: Builder<GameStatus, [string]>;

  readonly #requestService: RequestService;

  constructor(
    @Inject(GameStatusFromGameV1StatusBuilder)
    gameStatusFromGameV1StatusBuilder: Builder<GameStatus, [string]>,
    @Inject(RequestService)
    requestService: RequestService,
  ) {
    this.#gameStatusFromGameV1StatusBuilder = gameStatusFromGameV1StatusBuilder;
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
      [parsedPage, GetV1GamesMineRequestParamHandler.pageQueryParam],
      [parsedPageSize, GetV1GamesMineRequestParamHandler.pageSizeQueryParam],
      [parsedStatus, GetV1GamesMineRequestParamHandler.statusQueryParam],
    ];

    const errors: string[] =
      this.#requestService.composeErrorMessages(resultsAndParams);

    throw new AppError(
      AppErrorKind.contractViolation,
      `Invalid query params:\n\n${errors.join('\n')}`,
    );
  }

  #getParsedPage(request: Request): Either<RequestQueryParseFailure, number> {
    return this.#requestService.tryParseIntegerQuery(request, {
      default: DEFAULT_PAGE_VALUE,
      isMultiple: false,
      min: MIN_PAGE_VALUE,
      name: GetV1GamesMineRequestParamHandler.pageQueryParam,
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
      name: GetV1GamesMineRequestParamHandler.pageSizeQueryParam,
    });
  }

  #getParsedStatus(
    request: Request,
  ): Either<RequestQueryParseFailure, GameStatus | undefined> {
    const parsedStatus: Either<RequestQueryParseFailure, string> =
      this.#requestService.tryParseStringQuery(request, {
        isMultiple: false,
        name: GetV1GamesMineRequestParamHandler.statusQueryParam,
      });

    if (parsedStatus.isRight) {
      return this.#getParsedStatusFromStringGameStatusV1(parsedStatus.value);
    }

    if (parsedStatus.value.kind === RequestQueryParseFailureKind.notFound) {
      return {
        isRight: true,
        value: undefined,
      };
    }

    return parsedStatus;
  }

  #getParsedStatusFromStringGameStatusV1(
    stringGameStatus: string,
  ): Either<RequestQueryParseFailure, GameStatus | undefined> {
    try {
      const gameStatus: GameStatus =
        this.#gameStatusFromGameV1StatusBuilder.build(stringGameStatus);

      return {
        isRight: true,
        value: gameStatus,
      };
    } catch (error: unknown) {
      if (AppError.isAppErrorOfKind(error, AppErrorKind.contractViolation)) {
        return {
          isRight: false,
          value: {
            errors: [error.message],
            kind: RequestQueryParseFailureKind.invalidValue,
          },
        };
      } else {
        throw new AppError(
          AppErrorKind.unknown,
          'Unexpected error found while parsing game status',
          { cause: error },
        );
      }
    }
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
