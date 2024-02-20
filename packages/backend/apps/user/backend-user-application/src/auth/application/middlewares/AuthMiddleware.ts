import { models as apiModels } from '@cornie-js/api-models';
import { JwtService } from '@cornie-js/backend-app-jwt';
import { EnvironmentService } from '@cornie-js/backend-app-user-env';
import * as backendHttp from '@cornie-js/backend-http';

import { AccessTokenJwtPayload } from '../../../tokens/application/models/AccessTokenJwtPayload';
import { RefreshTokenJwtPayload } from '../../../tokens/application/models/RefreshTokenJwtPayload';
import { UserManagementInputPort } from '../../../users/application/ports/input/UserManagementInputPort';

export abstract class AuthMiddleware<
  TPayload extends AccessTokenJwtPayload | RefreshTokenJwtPayload,
> extends backendHttp.AuthMiddleware<TPayload> {
  readonly #userManagementInputPort: UserManagementInputPort;

  constructor(
    environmentService: EnvironmentService,
    jwtService: JwtService,
    userManagementInputPort: UserManagementInputPort,
  ) {
    super(
      environmentService.getEnvironment().apiBackendServiceSecret,
      jwtService,
    );

    this.#userManagementInputPort = userManagementInputPort;
  }

  protected override async _findUser(
    id: string,
  ): Promise<apiModels.UserV1 | undefined> {
    return this.#userManagementInputPort.findOne(id);
  }

  protected override _getUserId(jwtPayload: TPayload): string {
    return jwtPayload.sub;
  }
}
