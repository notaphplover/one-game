import { Module } from '@nestjs/common';

import { EnvModule } from '../../../../foundation/env/adapter/nest/modules/EnvModule';
import { JwtModule } from '../../../../foundation/jwt/adapter/nest/modules/JwtModule';
import { UserModule } from '../../../../user/adapter/nest/modules/UserModule';
import { AuthMiddleware } from '../../../application/middlewares/AuthMiddleware';

@Module({
  exports: [AuthMiddleware],
  imports: [EnvModule, JwtModule, UserModule],
  providers: [AuthMiddleware],
})
export class AuthModule {}
