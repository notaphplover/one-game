import { Module } from '@nestjs/common';

import { EnvModule } from '../../../../foundation/env/adapter/nest/modules/EnvModule';
import { HttpModule } from '../../../../foundation/http/adapter/nest/modules/HttpModule';
import { UserManagementInputPort } from '../../../application/ports/input/UserManagementInputPort';

@Module({
  exports: [UserManagementInputPort],
  imports: [EnvModule, HttpModule],
  providers: [UserManagementInputPort],
})
export class UserModule {}
