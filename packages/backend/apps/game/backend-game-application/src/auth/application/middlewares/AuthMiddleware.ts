import { UserV1 } from '@cornie-js/api-models/lib/models/types';
import { EnvironmentService } from '@cornie-js/backend-app-game-env';
import { JwtService } from '@cornie-js/backend-app-jwt';
import * as backendHttp from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { AccessTokenJwtPayload } from '../../../users/application/models/AccessTokenJwtPayload';
import { UserManagementInputPort } from '../../../users/application/ports/input/UserManagementInputPort';

@Injectable()
export class AuthMiddleware extends backendHttp.AuthMiddleware<AccessTokenJwtPayload> {
  readonly #userManagementInputPort: UserManagementInputPort;

  constructor(
    @Inject(EnvironmentService)
    environmentService: EnvironmentService,
    @Inject(JwtService)
    jwtService: JwtService,
    @Inject(UserManagementInputPort)
    userManagementInputPort: UserManagementInputPort,
  ) {
    super(
      environmentService.getEnvironment().apiBackendServiceSecret,
      jwtService,
    );

    this.#userManagementInputPort = userManagementInputPort;
  }

  protected override async _findUser(id: string): Promise<UserV1 | undefined> {
    return this.#userManagementInputPort.findOne(id);
  }

  protected override _getUserId(jwtPayload: AccessTokenJwtPayload): string {
    return jwtPayload.sub;
  }

  protected override _verifyJwtPayload(
    jwtPayload: unknown,
  ): jwtPayload is AccessTokenJwtPayload {
    return (
      jwtPayload !== null &&
      typeof jwtPayload === 'object' &&
      typeof (jwtPayload as Partial<AccessTokenJwtPayload>).aud === 'string' &&
      typeof (jwtPayload as Partial<AccessTokenJwtPayload>).iat === 'number' &&
      typeof (jwtPayload as Partial<AccessTokenJwtPayload>).iss === 'string' &&
      typeof (jwtPayload as Partial<AccessTokenJwtPayload>).sub === 'string'
    );
  }
}
