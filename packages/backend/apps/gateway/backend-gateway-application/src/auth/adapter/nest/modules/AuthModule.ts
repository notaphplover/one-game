import { Module } from '@nestjs/common';

import { HttpApiModule } from '../../../../foundation/api/adapter/nest/modules/HttpApiModule';
import { CreateAuthMutationResolver } from '../../../application/resolvers/CreateAuthMutationResolver';

@Module({
  exports: [CreateAuthMutationResolver],
  imports: [HttpApiModule],
  providers: [CreateAuthMutationResolver],
})
export class AuthModule {}
