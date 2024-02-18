import { JwtService } from '@cornie-js/backend-app-jwt';
import { EnvironmentService } from '@cornie-js/backend-app-user-env';
import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import {
  Request,
  RequestWithBody,
  Response,
  ResponseWithBody,
} from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { UserManagementInputPort } from '../../../users/application/ports/input/UserManagementInputPort';
import { AuthMiddleware } from './AuthMiddleware';

@Injectable()
export class RefreshTokenAuthMiddleware extends AuthMiddleware {
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

  public override async handle(
    request: Request | RequestWithBody,
    halt: (response: Response | ResponseWithBody<unknown>) => void,
  ): Promise<void> {
    try {
      await super.handle(request, halt);
    } catch (error: unknown) {
      if (!AppError.isAppErrorOfKind(error, AppErrorKind.missingCredentials)) {
        throw error;
      }
    }
  }
}
