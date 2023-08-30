import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { JwtService } from '@cornie-js/backend-jwt';

import { AuthKind } from '../../../auth/application/models/AuthKind';
import { AuthRequestContextHolder } from '../../../auth/application/models/AuthRequestContextHolder';
import { Request } from '../../../http/application/models/Request';
import { RequestContextHolder } from '../../../http/application/models/RequestContextHolder';
import { requestContextProperty } from '../../../http/application/models/requestContextProperty';
import { RequestWithBody } from '../../../http/application/models/RequestWithBody';
import { Response } from '../../../http/application/models/Response';
import { ResponseWithBody } from '../../../http/application/models/ResponseWithBody';
import { Middleware } from '../../../http/application/modules/Middleware';

// Auth headers are not case sensitive. Consider https://github.com/fastify/help/issues/71
const AUTH_HEADER_NAME: string = 'authorization';
const AUTH_HEADER_BEARER_PREFIX: string = 'Bearer ';

export abstract class AuthMiddleware<
  TPayload extends Record<string | symbol, unknown>,
> implements Middleware<Request | RequestWithBody>
{
  readonly #backendServicesSecret: string;
  readonly #jwtService: JwtService<TPayload>;

  constructor(backendServicesSecret: string, jwtService: JwtService<TPayload>) {
    this.#backendServicesSecret = backendServicesSecret;
    this.#jwtService = jwtService;
  }

  public async handle(
    request: Request | RequestWithBody,
    _halt: (response: Response | ResponseWithBody<unknown>) => void,
  ): Promise<void> {
    const authBearerToken: string = this.#extractAuthBearerToken(request);

    if (authBearerToken === this.#backendServicesSecret) {
      this.#provideBackendServiceAuth(request);
    } else {
      await this.#provideUserAuth(authBearerToken, request);
    }
  }

  #extractAuthBearerToken(request: Request | RequestWithBody): string {
    if (typeof request.headers[AUTH_HEADER_NAME] !== 'string') {
      throw new AppError(
        AppErrorKind.missingCredentials,
        `No authorization header was found`,
      );
    }

    const authHeaderValue: string = request.headers[AUTH_HEADER_NAME];

    if (!authHeaderValue.startsWith(AUTH_HEADER_BEARER_PREFIX)) {
      throw new AppError(
        AppErrorKind.missingCredentials,
        `No Bearer authorization header was found`,
      );
    }

    return authHeaderValue.slice(AUTH_HEADER_BEARER_PREFIX.length);
  }

  #provideContext(
    request: Request | RequestWithBody,
  ): asserts request is Request & RequestContextHolder {
    if (
      (request as Request & RequestContextHolder)[requestContextProperty] ===
      undefined
    ) {
      (request as Request & RequestContextHolder)[requestContextProperty] = {};
    }
  }

  #provideBackendServiceAuth(request: Request | RequestWithBody): void {
    this.#provideContext(request);

    (request as Request & AuthRequestContextHolder)[
      requestContextProperty
    ].auth = {
      kind: AuthKind.backendService,
    };
  }

  async #provideUserAuth(
    authBearerToken: string,
    request: Request | RequestWithBody,
  ): Promise<void> {
    const jwtPayload: TPayload = await this.#jwtService.parse(authBearerToken);

    const userId: string = this._getUserId(jwtPayload);

    const userV1OrUndefined: apiModels.UserV1 | undefined =
      await this._findUser(userId);

    if (userV1OrUndefined === undefined) {
      throw new AppError(
        AppErrorKind.invalidCredentials,
        'No user was found matching current credentials',
      );
    }

    this.#provideContext(request);

    (request as Request & AuthRequestContextHolder)[
      requestContextProperty
    ].auth = {
      kind: AuthKind.user,
      user: userV1OrUndefined,
    };
  }

  protected abstract _findUser(
    id: string,
  ): Promise<apiModels.UserV1 | undefined>;

  protected abstract _getUserId(jwtPayload: TPayload): string;
}
