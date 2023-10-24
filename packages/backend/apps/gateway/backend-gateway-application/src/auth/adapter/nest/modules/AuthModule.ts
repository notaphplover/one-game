import { Module } from '@nestjs/common';

import { HttpApiModule } from '../../../../foundation/api/adapter/nest/modules/HttpApiModule';
import { AuthMutationResolver } from '../../../application/resolvers/AuthMutationResolver';

@Module({
  exports: [AuthMutationResolver],
  imports: [HttpApiModule],
  providers: [AuthMutationResolver],
})
export class AuthModule {}
