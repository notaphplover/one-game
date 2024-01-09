import { SchemaId, models as apiModels } from '@cornie-js/api-models';
import {
  ApiJsonSchemasValidationProvider,
  Validator,
} from '@cornie-js/backend-api-validators';
import {
  AppError,
  AppErrorKind,
  Builder,
  Either,
  Handler,
  Writable,
} from '@cornie-js/backend-common';
import {
  GameSpecFindQuery,
  GameSpecFindQuerySortOption,
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

import { GameSpecFindQuerySortOptionFromGameSpecSortOptionV1Builder } from '../builders/GameSpecFindQuerySortOptionFromGameSpecSortOptionV1Builder';

const DEFAULT_PAGE_VALUE: number = 1;
const DEFAULT_PAGE_SIZE_VALUE: number = 10;
const MAX_PAGE_SIZE_VALUE: number = 50;
const MIN_PAGE_VALUE: number = 1;
const MIN_PAGE_SIZE_VALUE: number = 1;

@Injectable()
export class GetGamesV1SpecsRequestParamHandler
  implements Handler<[Request & AuthRequestContextHolder], [GameSpecFindQuery]>
{
  public static gameIdQuery: string = 'gameId';
  public static pageQueryParam: string = 'page';
  public static pageSizeQueryParam: string = 'pageSize';
  public static sortQueryParam: string = 'sort';

  readonly #gameSpecFindQuerySortOptionFromGameSpecSortOptionV1Builder: Builder<
    GameSpecFindQuerySortOption,
    [apiModels.GameSpecSortOptionV1]
  >;
  readonly #gameSpecSortOptionValidator: Validator<apiModels.GameSpecSortOptionV1>;
  readonly #requestService: RequestService;

  constructor(
    @Inject(ApiJsonSchemasValidationProvider)
    apiJsonSchemasValidationProvider: ApiJsonSchemasValidationProvider,
    @Inject(GameSpecFindQuerySortOptionFromGameSpecSortOptionV1Builder)
    gameSpecFindQuerySortOptionFromGameSpecSortOptionV1Builder: Builder<
      GameSpecFindQuerySortOption,
      [apiModels.GameSpecSortOptionV1]
    >,
    @Inject(RequestService) requestService: RequestService,
  ) {
    this.#gameSpecFindQuerySortOptionFromGameSpecSortOptionV1Builder =
      gameSpecFindQuerySortOptionFromGameSpecSortOptionV1Builder;
    this.#gameSpecSortOptionValidator =
      apiJsonSchemasValidationProvider.provide(SchemaId.GameSpecSortOptionV1);
    this.#requestService = requestService;
  }

  public async handle(
    request: Request & AuthRequestContextHolder,
  ): Promise<[GameSpecFindQuery]> {
    const parsedGameIds: Either<RequestQueryParseFailure, string[]> =
      this.#getParsedGameIds(request);
    const parsedPage: Either<RequestQueryParseFailure, number> =
      this.#getParsedPage(request);
    const parsedPageSize: Either<RequestQueryParseFailure, number> =
      this.#getParsedPageSize(request);
    const parsedSortOption: Either<
      RequestQueryParseFailure,
      apiModels.GameSpecSortOptionV1 | undefined
    > = this.#getParsedSortOption(request);

    if (
      parsedPage.isRight &&
      parsedPageSize.isRight &&
      parsedGameIds.isRight &&
      parsedSortOption.isRight
    ) {
      this.#assertValidGameIds(request, parsedGameIds.value);

      return this.#buildGameSpecFindQuery(
        parsedGameIds.value,
        parsedPage.value,
        parsedPageSize.value,
        parsedSortOption.value,
      );
    }

    const errors: string[] = this.#requestService.composeErrorMessages([
      [parsedGameIds, GetGamesV1SpecsRequestParamHandler.gameIdQuery],
      [parsedPage, GetGamesV1SpecsRequestParamHandler.pageQueryParam],
      [parsedPageSize, GetGamesV1SpecsRequestParamHandler.pageSizeQueryParam],
      [parsedSortOption, GetGamesV1SpecsRequestParamHandler.sortQueryParam],
    ]);

    throw new AppError(
      AppErrorKind.contractViolation,
      `Invalid query params:\n\n${errors.join('\n')}`,
    );
  }

  #assertValidGameIds(
    request: Request & AuthRequestContextHolder,
    gameIds: string[],
  ): void {
    if (gameIds.length === 0) {
      const auth: Auth = request[requestContextProperty].auth;

      if (auth.kind === AuthKind.user) {
        throw new AppError(
          AppErrorKind.invalidCredentials,
          'Unable to fetch games specs. User credential based requests require at least a game id as query parameters',
        );
      }
    }
  }

  #buildGameSpecFindQuery(
    gameIds: string[],
    page: number,
    pageSize: number,
    sort: apiModels.GameSpecSortOptionV1 | undefined,
  ): [GameSpecFindQuery] {
    const gameSpecFindQuery: Writable<GameSpecFindQuery> = {
      limit: pageSize,
      offset: pageSize * (page - 1),
    };

    if (sort !== undefined) {
      gameSpecFindQuery.sort =
        this.#gameSpecFindQuerySortOptionFromGameSpecSortOptionV1Builder.build(
          sort,
        );
    }

    gameSpecFindQuery.gameIds = gameIds;

    return [gameSpecFindQuery];
  }

  #getParsedGameIds(
    request: Request,
  ): Either<RequestQueryParseFailure, string[]> {
    return this.#requestService.tryParseStringQuery(request, {
      default: [],
      isMultiple: true,
      name: GetGamesV1SpecsRequestParamHandler.gameIdQuery,
    });
  }

  #getParsedPage(request: Request): Either<RequestQueryParseFailure, number> {
    return this.#requestService.tryParseIntegerQuery(request, {
      default: DEFAULT_PAGE_VALUE,
      isMultiple: false,
      min: MIN_PAGE_VALUE,
      name: GetGamesV1SpecsRequestParamHandler.pageQueryParam,
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
      name: GetGamesV1SpecsRequestParamHandler.pageSizeQueryParam,
    });
  }

  #getParsedSortOption(
    request: Request,
  ): Either<
    RequestQueryParseFailure,
    apiModels.GameSpecSortOptionV1 | undefined
  > {
    const parsedGameSpecSortOptions: Either<RequestQueryParseFailure, string> =
      this.#requestService.tryParseStringQuery(request, {
        isMultiple: false,
        name: GetGamesV1SpecsRequestParamHandler.sortQueryParam,
      });

    if (
      !parsedGameSpecSortOptions.isRight &&
      parsedGameSpecSortOptions.value.kind ===
        RequestQueryParseFailureKind.notFound
    ) {
      return {
        isRight: true,
        value: undefined,
      };
    }

    if (
      parsedGameSpecSortOptions.isRight &&
      !this.#gameSpecSortOptionValidator.validate(
        parsedGameSpecSortOptions.value,
      )
    ) {
      return {
        isRight: false,
        value: {
          errors: [this.#gameSpecSortOptionValidator.errors ?? 'Invalid value'],
          kind: RequestQueryParseFailureKind.invalidValue,
        },
      };
    }

    return parsedGameSpecSortOptions as Either<
      RequestQueryParseFailure,
      apiModels.GameSpecSortOptionV1
    >;
  }
}
