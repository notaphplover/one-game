import { JwtService } from '@cornie-js/backend-app-jwt';
import { UserManagementInputPort } from '@cornie-js/backend-app-user';
import { EnvironmentService } from '@cornie-js/backend-app-user-env';
import * as backendHttp from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { UserJwtPayload } from '../../../user/application/models/UserJwtPayload';

@Injectable()
export class AuthMiddleware extends backendHttp.AuthMiddleware<UserJwtPayload> {
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
      userManagementInputPort,
    );
  }

  protected _getUserId(jwtPayload: UserJwtPayload): string {
    return jwtPayload.sub;
  }
}
