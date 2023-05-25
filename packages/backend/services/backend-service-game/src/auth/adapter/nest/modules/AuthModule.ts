import { AppModule } from '@cornie-js/backend-app-game';
import { EnvModule } from '@cornie-js/backend-app-game-env';
import { JwtModule } from '@cornie-js/backend-app-jwt';
import { Module } from '@nestjs/common';

import { buildJwtModuleOptions } from '../../../../foundation/jwt/adapter/nest/calculations/buildJwtModuleOptions';
import { AuthMiddleware } from '../../../application/middlewares/AuthMiddleware';

@Module({
  exports: [AuthMiddleware],
  imports: [
    AppModule,
    EnvModule,
    JwtModule.forRootAsync(buildJwtModuleOptions()),
  ],
  providers: [AuthMiddleware],
})
export class AuthModule {}
