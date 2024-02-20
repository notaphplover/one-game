import { JwtService } from '@cornie-js/backend-app-jwt';
import { EnvironmentService } from '@cornie-js/backend-app-user-env';
import { Inject, Injectable } from '@nestjs/common';

import { AccessTokenJwtPayload } from '../../../tokens/application/models/AccessTokenJwtPayload';
import { UserManagementInputPort } from '../../../users/application/ports/input/UserManagementInputPort';
import { AuthMiddleware } from './AuthMiddleware';

@Injectable()
export class AccessTokenAuthMiddleware extends AuthMiddleware<AccessTokenJwtPayload> {
  constructor(
    @Inject(EnvironmentService)
    environmentService: EnvironmentService,
    @Inject(JwtService)
    jwtService: JwtService,
    @Inject(UserManagementInputPort)
    userManagementInputPort: UserManagementInputPort,
  ) {
    super(environmentService, jwtService, userManagementInputPort);
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
