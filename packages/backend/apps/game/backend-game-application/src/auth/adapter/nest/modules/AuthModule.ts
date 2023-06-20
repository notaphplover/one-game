import { EnvModule } from '@cornie-js/backend-app-game-env';
import { JwtModule } from '@cornie-js/backend-app-jwt';
import { Module } from '@nestjs/common';

import { buildJwtModuleOptions } from '../../../../foundation/jwt/adapter/nest/calculations/buildJwtModuleOptions';
import { UserModule } from '../../../../users/adapter/nest/modules/UserModule';
import { AuthMiddleware } from '../../../application/middlewares/AuthMiddleware';

@Module({
  exports: [AuthMiddleware],
  imports: [
    EnvModule,
    JwtModule.forRootAsync(buildJwtModuleOptions()),
    UserModule,
  ],
  providers: [AuthMiddleware],
})
export class AuthModule {}
