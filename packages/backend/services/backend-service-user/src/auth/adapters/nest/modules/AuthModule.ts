import { Module } from '@nestjs/common';

import { HashModule } from '../../../../foundation/hash/adapter/nest/modules/HashModule';
import { JwtModule } from '../../../../foundation/jwt/adapter/nest/modules/JwtModule';
import { UserModule } from '../../../../user/adapter/nest/modules/UserModule';
import { AuthMiddleware } from '../../../application/middlewares/AuthMiddleware';
import { AuthManagementInputPort } from '../../../application/ports/input/AuthManagementInputPort';

@Module({
  exports: [AuthManagementInputPort, AuthMiddleware],
  imports: [HashModule, JwtModule, UserModule],
  providers: [AuthManagementInputPort, AuthMiddleware],
})
export class AuthModule {}
