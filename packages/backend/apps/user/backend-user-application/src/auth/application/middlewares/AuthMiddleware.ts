import { UserV1 } from '@cornie-js/api-models/lib/models/types';
import { JwtService } from '@cornie-js/backend-app-jwt';
import { EnvironmentService } from '@cornie-js/backend-app-user-env';
import * as backendHttp from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { UserJwtPayload } from '../../../users/application/models/UserJwtPayload';
import { UserManagementInputPort } from '../../../users/application/ports/input/UserManagementInputPort';

@Injectable()
export class AuthMiddleware extends backendHttp.AuthMiddleware<UserJwtPayload> {
  readonly #userManagementInputPort: UserManagementInputPort;

  constructor(
    @Inject(EnvironmentService)
    environmentService: EnvironmentService,
    @Inject(JwtService)
    jwtService: JwtService<UserJwtPayload>,
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

  protected override _getUserId(jwtPayload: UserJwtPayload): string {
    return jwtPayload.sub;
  }
}
