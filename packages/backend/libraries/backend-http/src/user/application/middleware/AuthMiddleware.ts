import { models as apiModels } from '@one-game-js/api-models';
import { AppError, AppErrorKind } from '@one-game-js/backend-common';
import { JwtService } from '@one-game-js/backend-jwt';

import { Request } from '../../../http/application/models/Request';
import { RequestContextHolder } from '../../../http/application/models/RequestContextHolder';
import { requestContextProperty } from '../../../http/application/models/requestContextProperty';
import { RequestWithBody } from '../../../http/application/models/RequestWithBody';
import { Response } from '../../../http/application/models/Response';
import { ResponseWithBody } from '../../../http/application/models/ResponseWithBody';
import { Middleware } from '../../../http/application/modules/Middleware';
import { RequestUserContextHolder } from '../models/RequestUserContextHolder';
import { UserManagementInputPort } from '../ports/input/UserManagementInputPort';

const AUTH_HEADER_NAME: string = 'Authorization';
const AUTH_HEADER_BEARER_PREFIX: string = 'Bearer ';

export abstract class AuthMiddleware<
  TPayload extends Record<string | symbol, unknown>,
> implements Middleware<Request | RequestWithBody>
{
  readonly #jwtService: JwtService<TPayload>;
  readonly #userManagementInputPort: UserManagementInputPort;

  constructor(
    jwtService: JwtService<TPayload>,
    userManagementInputPort: UserManagementInputPort,
  ) {
    this.#jwtService = jwtService;
    this.#userManagementInputPort = userManagementInputPort;
  }

  public async handle(
    request: Request | RequestWithBody,
    _halt: (response: Response | ResponseWithBody<unknown>) => void,
  ): Promise<void> {
    const jwtStringified: string = this.#extractJwtStringified(request);
    const jwtPayload: TPayload = await this.#jwtService.parse(jwtStringified);
    const userId: string = this._getUserId(jwtPayload);

    const userV1OrUndefined: apiModels.UserV1 | undefined =
      await this.#userManagementInputPort.findOne(userId);

    if (userV1OrUndefined === undefined) {
      throw new AppError(
        AppErrorKind.invalidCredentials,
        'No user was found matching current credentials',
      );
    }

    if (
      (request as Request & RequestContextHolder)[requestContextProperty] ===
      undefined
    ) {
      (request as Request & RequestContextHolder)[requestContextProperty] = {};
    }

    (request as Request & RequestUserContextHolder)[
      requestContextProperty
    ].user = userV1OrUndefined;
  }

  #extractJwtStringified(request: Request | RequestWithBody): string {
    if (typeof request.headers[AUTH_HEADER_NAME] !== 'string') {
      throw new AppError(
        AppErrorKind.missingCredentials,
        `No "${AUTH_HEADER_NAME}" header was found`,
      );
    }

    const authHeaderValue: string = request.headers[AUTH_HEADER_NAME];

    if (!authHeaderValue.startsWith(AUTH_HEADER_BEARER_PREFIX)) {
      throw new AppError(
        AppErrorKind.missingCredentials,
        `No Bearer "${AUTH_HEADER_NAME}" header was found`,
      );
    }

    return authHeaderValue.slice(AUTH_HEADER_BEARER_PREFIX.length);
  }

  protected abstract _getUserId(jwtPayload: TPayload): string;
}
