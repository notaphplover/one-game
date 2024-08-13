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
  GamesCanBeFoundByUserSpec,
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
export class GetGamesV1RequestParamHandler
  implements Handler<[Request & AuthRequestContextHolder], [GameFindQuery]>
{
  public static isPublicQueryParam: string = 'isPublic';
  public static pageQueryParam: string = 'page';
  public static pageSizeQueryParam: string = 'pageSize';
  public static statusQueryParam: string = 'status';

  readonly #gamesCanBeFoundByUserSpec: GamesCanBeFoundByUserSpec;
  readonly #gameStatusFromGameV1StatusBuilder: Builder<GameStatus, [string]>;
  readonly #requestService: RequestService;

  constructor(
    @Inject(GamesCanBeFoundByUserSpec)
    gamesCanBeFoundByUserSpec: GamesCanBeFoundByUserSpec,
    @Inject(GameStatusFromGameV1StatusBuilder)
    gameStatusFromGameV1StatusBuilder: Builder<GameStatus, [string]>,
    @Inject(RequestService)
    requestService: RequestService,
  ) {
    this.#gamesCanBeFoundByUserSpec = gamesCanBeFoundByUserSpec;
    this.#gameStatusFromGameV1StatusBuilder = gameStatusFromGameV1StatusBuilder;
    this.#requestService = requestService;
  }

  public async handle(
    request: Request & AuthRequestContextHolder,
  ): Promise<[GameFindQuery]> {
    const parsedIsPublic: Either<
      RequestQueryParseFailure,
      boolean | undefined
    > = this.#getParsedIsPublic(request);
    const parsedPage: Either<RequestQueryParseFailure, number> =
      this.#getParsedPage(request);
    const parsedPageSize: Either<RequestQueryParseFailure, number> =
      this.#getParsedPageSize(request);
    const parsedStatus: Either<
      RequestQueryParseFailure,
      GameStatus | undefined
    > = this.#getParsedStatus(request);

    if (
      parsedIsPublic.isRight &&
      parsedPage.isRight &&
      parsedPageSize.isRight &&
      parsedStatus.isRight
    ) {
      const gameFindQuery: Writable<GameFindQuery> = {
        limit: parsedPageSize.value,
        offset: parsedPageSize.value * (parsedPage.value - 1),
      };

      if (parsedIsPublic.value !== undefined) {
        gameFindQuery.isPublic = parsedIsPublic.value;
      }

      if (parsedStatus.value !== undefined) {
        gameFindQuery.status = parsedStatus.value;
      }

      this.#assertIsValidGameFindQuery(gameFindQuery, request);

      return [gameFindQuery];
    }

    const resultsAndParams: [
      Either<RequestQueryParseFailure, unknown>,
      string,
    ][] = [
      [parsedIsPublic, GetGamesV1RequestParamHandler.isPublicQueryParam],
      [parsedPage, GetGamesV1RequestParamHandler.pageQueryParam],
      [parsedPageSize, GetGamesV1RequestParamHandler.pageSizeQueryParam],
      [parsedStatus, GetGamesV1RequestParamHandler.statusQueryParam],
    ];

    const errors: string[] =
      this.#requestService.composeErrorMessages(resultsAndParams);

    throw new AppError(
      AppErrorKind.contractViolation,
      `Invalid query params:\n\n${errors.join('\n')}`,
    );
  }

  #getParsedIsPublic(
    request: Request,
  ): Either<RequestQueryParseFailure, boolean | undefined> {
    const parsedIsPublic: Either<RequestQueryParseFailure, boolean> =
      this.#requestService.tryParseBooleanQuery(request, {
        isMultiple: false,
        name: GetGamesV1RequestParamHandler.isPublicQueryParam,
      });

    if (parsedIsPublic.isRight) {
      return parsedIsPublic;
    }

    if (parsedIsPublic.value.kind === RequestQueryParseFailureKind.notFound) {
      return {
        isRight: true,
        value: undefined,
      };
    }

    return parsedIsPublic;
  }

  #getParsedPage(request: Request): Either<RequestQueryParseFailure, number> {
    return this.#requestService.tryParseIntegerQuery(request, {
      default: DEFAULT_PAGE_VALUE,
      isMultiple: false,
      min: MIN_PAGE_VALUE,
      name: GetGamesV1RequestParamHandler.pageQueryParam,
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
      name: GetGamesV1RequestParamHandler.pageSizeQueryParam,
    });
  }

  #getParsedStatus(
    request: Request,
  ): Either<RequestQueryParseFailure, GameStatus | undefined> {
    const parsedStatus: Either<RequestQueryParseFailure, string> =
      this.#requestService.tryParseStringQuery(request, {
        isMultiple: false,
        name: GetGamesV1RequestParamHandler.statusQueryParam,
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

  #assertIsValidGameFindQuery(
    gameFindQuery: GameFindQuery,
    request: AuthRequestContextHolder,
  ): void {
    const auth: Auth = request[requestContextProperty].auth;

    if (
      auth.kind === AuthKind.user &&
      !this.#gamesCanBeFoundByUserSpec.isSatisfiedBy(gameFindQuery)
    ) {
      throw new AppError(
        AppErrorKind.invalidCredentials,
        'Access denied. Reason: requested games cannot be found with the current credentials',
      );
    }
  }
}
