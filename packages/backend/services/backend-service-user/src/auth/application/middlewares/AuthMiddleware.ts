import { Inject, Injectable } from '@nestjs/common';
import * as backendHttp from '@one-game-js/backend-http';
import { JwtService } from '@one-game-js/backend-jwt';

import { UserJwtPayload } from '../../../user/application/models/UserJwtPayload';
import { UserManagementInputPort } from '../../../user/application/ports/input/UserManagementInputPort';

@Injectable()
export class AuthMiddleware extends backendHttp.AuthMiddleware<UserJwtPayload> {
  constructor(
    @Inject(JwtService)
    jwtService: JwtService<UserJwtPayload>,
    @Inject(UserManagementInputPort)
    userManagementInputPort: UserManagementInputPort,
  ) {
    super(jwtService, userManagementInputPort);
  }

  protected _getUserId(jwtPayload: UserJwtPayload): string {
    return jwtPayload.sub;
  }
}
