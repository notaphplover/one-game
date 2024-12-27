import { models as apiModels, SchemaId } from '@cornie-js/api-models';
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
  Auth,
  AuthKind,
  AuthRequestContextHolder,
  Request,
  requestContextProperty,
  RequestQueryParseFailure,
  RequestQueryParseFailureKind,
  RequestService,
} from '@cornie-js/backend-http';
import {
  UserFindQuery,
  UserFindQuerySortOption,
} from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';

import { UserFindQuerySortOptionFromUserSortOptionV1Builder } from '../builders/UserFindQuerySortOptionFromUserSortOptionV1Builder';

const DEFAULT_PAGE_VALUE: number = 1;
const DEFAULT_PAGE_SIZE_VALUE: number = 10;
const MAX_PAGE_SIZE_VALUE: number = 50;
const MIN_PAGE_VALUE: number = 1;
const MIN_PAGE_SIZE_VALUE: number = 1;

@Injectable()
export class GetV1UsersRequestParamHandler
  implements Handler<[Request & AuthRequestContextHolder], [UserFindQuery]>
{
  public static idQuery: string = 'id';
  public static pageQueryParam: string = 'page';
  public static pageSizeQueryParam: string = 'pageSize';
  public static sortQueryParam: string = 'sort';

  readonly #userFindQuerySortOptionFromUserSortOptionV1Builder: Builder<
    UserFindQuerySortOption,
    [apiModels.UserSortOptionV1]
  >;
  readonly #userSortOptionValidator: Validator<apiModels.UserSortOptionV1>;
  readonly #requestService: RequestService;

  constructor(
    @Inject(ApiJsonSchemasValidationProvider)
    apiJsonSchemasValidationProvider: ApiJsonSchemasValidationProvider,
    @Inject(UserFindQuerySortOptionFromUserSortOptionV1Builder)
    userFindQuerySortOptionFromUserSortOptionV1Builder: Builder<
      UserFindQuerySortOption,
      [apiModels.UserSortOptionV1]
    >,
    @Inject(RequestService) requestService: RequestService,
  ) {
    this.#userFindQuerySortOptionFromUserSortOptionV1Builder =
      userFindQuerySortOptionFromUserSortOptionV1Builder;
    this.#userSortOptionValidator = apiJsonSchemasValidationProvider.provide(
      SchemaId.UserSortOptionV1,
    );
    this.#requestService = requestService;
  }

  public async handle(
    request: Request & AuthRequestContextHolder,
  ): Promise<[UserFindQuery]> {
    const parsedUserIds: Either<RequestQueryParseFailure, string[]> =
      this.#getParsedUserIds(request);
    const parsedPage: Either<RequestQueryParseFailure, number> =
      this.#getParsedPage(request);
    const parsedPageSize: Either<RequestQueryParseFailure, number> =
      this.#getParsedPageSize(request);
    const parsedSortOption: Either<
      RequestQueryParseFailure,
      apiModels.UserSortOptionV1 | undefined
    > = this.#getParsedSortOption(request);

    if (
      parsedPage.isRight &&
      parsedPageSize.isRight &&
      parsedUserIds.isRight &&
      parsedSortOption.isRight
    ) {
      this.#assertValidIds(request, parsedUserIds.value);

      return this.#buildUserFindQuery(
        parsedUserIds.value,
        parsedPage.value,
        parsedPageSize.value,
        parsedSortOption.value,
      );
    }

    const errors: string[] = this.#requestService.composeErrorMessages([
      [parsedUserIds, GetV1UsersRequestParamHandler.idQuery],
      [parsedPage, GetV1UsersRequestParamHandler.pageQueryParam],
      [parsedPageSize, GetV1UsersRequestParamHandler.pageSizeQueryParam],
      [parsedSortOption, GetV1UsersRequestParamHandler.sortQueryParam],
    ]);

    throw new AppError(
      AppErrorKind.contractViolation,
      `Invalid query params:\n\n${errors.join('\n')}`,
    );
  }

  #assertValidIds(
    request: Request & AuthRequestContextHolder,
    ids: string[],
  ): void {
    if (ids.length === 0) {
      const auth: Auth = request[requestContextProperty].auth;

      if (auth.kind === AuthKind.user) {
        throw new AppError(
          AppErrorKind.invalidCredentials,
          'Unable to fetch users. User credential based requests require at least an id as query parameters',
        );
      }
    }
  }

  #buildUserFindQuery(
    ids: string[],
    page: number,
    pageSize: number,
    sort: apiModels.UserSortOptionV1 | undefined,
  ): [UserFindQuery] {
    const userFindQuery: Writable<UserFindQuery> = {
      limit: pageSize,
      offset: pageSize * (page - 1),
    };

    if (sort !== undefined) {
      userFindQuery.sort =
        this.#userFindQuerySortOptionFromUserSortOptionV1Builder.build(sort);
    }

    userFindQuery.ids = ids;

    return [userFindQuery];
  }

  #getParsedUserIds(
    request: Request,
  ): Either<RequestQueryParseFailure, string[]> {
    return this.#requestService.tryParseStringQuery(request, {
      default: [],
      isMultiple: true,
      name: GetV1UsersRequestParamHandler.idQuery,
    });
  }

  #getParsedPage(request: Request): Either<RequestQueryParseFailure, number> {
    return this.#requestService.tryParseIntegerQuery(request, {
      default: DEFAULT_PAGE_VALUE,
      isMultiple: false,
      min: MIN_PAGE_VALUE,
      name: GetV1UsersRequestParamHandler.pageQueryParam,
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
      name: GetV1UsersRequestParamHandler.pageSizeQueryParam,
    });
  }

  #getParsedSortOption(
    request: Request,
  ): Either<RequestQueryParseFailure, apiModels.UserSortOptionV1 | undefined> {
    const parsedUserSortOptions: Either<RequestQueryParseFailure, string> =
      this.#requestService.tryParseStringQuery(request, {
        isMultiple: false,
        name: GetV1UsersRequestParamHandler.sortQueryParam,
      });

    if (
      !parsedUserSortOptions.isRight &&
      parsedUserSortOptions.value.kind === RequestQueryParseFailureKind.notFound
    ) {
      return {
        isRight: true,
        value: undefined,
      };
    }

    if (
      parsedUserSortOptions.isRight &&
      !this.#userSortOptionValidator.validate(parsedUserSortOptions.value)
    ) {
      return {
        isRight: false,
        value: {
          errors: [this.#userSortOptionValidator.errors ?? 'Invalid value'],
          kind: RequestQueryParseFailureKind.invalidValue,
        },
      };
    }

    return parsedUserSortOptions as Either<
      RequestQueryParseFailure,
      apiModels.UserSortOptionV1
    >;
  }
}
