import {
  AppError,
  AppErrorKind,
  Either,
  Handler,
  Writable,
} from '@cornie-js/backend-common';
import { GameSpecFindQuery } from '@cornie-js/backend-game-domain/games';
import {
  Auth,
  AuthKind,
  AuthRequestContextHolder,
  Request,
  RequestQueryParseFailure,
  RequestService,
  requestContextProperty,
} from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

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

  readonly #requestService: RequestService;

  constructor(@Inject(RequestService) requestService: RequestService) {
    this.#requestService = requestService;
  }

  public async handle(
    request: Request & AuthRequestContextHolder,
  ): Promise<[GameSpecFindQuery]> {
    const parsedGameIds: Either<RequestQueryParseFailure, string[]> =
      this.#requestService.tryParseStringQuery(request, {
        default: [],
        isMultiple: true,
        name: GetGamesV1SpecsRequestParamHandler.gameIdQuery,
      });
    const parsedPage: Either<RequestQueryParseFailure, number> =
      this.#requestService.tryParseIntegerQuery(request, {
        default: DEFAULT_PAGE_VALUE,
        isMultiple: false,
        min: MIN_PAGE_VALUE,
        name: GetGamesV1SpecsRequestParamHandler.pageQueryParam,
      });
    const parsedPageSize: Either<RequestQueryParseFailure, number> =
      this.#requestService.tryParseIntegerQuery(request, {
        default: DEFAULT_PAGE_SIZE_VALUE,
        isMultiple: false,
        max: MAX_PAGE_SIZE_VALUE,
        min: MIN_PAGE_SIZE_VALUE,
        name: GetGamesV1SpecsRequestParamHandler.pageQueryParam,
      });

    if (parsedPage.isRight && parsedPageSize.isRight && parsedGameIds.isRight) {
      const gameSpecFindQuery: Writable<GameSpecFindQuery> = {
        limit: parsedPageSize.value,
        offset: parsedPageSize.value * (parsedPage.value - 1),
      };

      if (parsedGameIds.value.length === 0) {
        const auth: Auth = request[requestContextProperty].auth;

        if (auth.kind === AuthKind.user) {
          throw new AppError(
            AppErrorKind.invalidCredentials,
            'Unable to fetch games specs. User credential based requests require at least a game id as query parameters',
          );
        }
      } else {
        gameSpecFindQuery.gameIds = parsedGameIds.value;
      }

      return [gameSpecFindQuery];
    }

    throw new AppError(AppErrorKind.contractViolation, 'Invalid query params');
  }
}
