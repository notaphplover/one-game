import { Module } from '@nestjs/common';

import { RootMutationResolver } from '../../../../app/application/resolvers/RootMutationResolver';
import { HttpApiModule } from '../../../../foundation/api/adapter/nest/modules/HttpApiModule';
import { CreateAuthMutationResolver } from '../../../application/resolvers/CreateAuthMutationResolver';

@Module({
  exports: [RootMutationResolver],
  imports: [HttpApiModule],
  providers: [CreateAuthMutationResolver, RootMutationResolver],
})
export class AuthModule {}
