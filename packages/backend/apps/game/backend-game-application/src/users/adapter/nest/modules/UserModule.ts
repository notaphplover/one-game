import { EnvModule } from '@cornie-js/backend-app-game-env';
import { Module } from '@nestjs/common';

import { HttpApiModule } from '../../../../foundation/api/adapter/nest/modules/HttpApiModule';
import { UserManagementInputPort } from '../../../application/ports/input/UserManagementInputPort';

@Module({
  exports: [UserManagementInputPort],
  imports: [EnvModule, HttpApiModule.forRootAsync()],
  providers: [UserManagementInputPort],
})
export class UserModule {}
