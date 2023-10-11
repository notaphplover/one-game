import { Module } from '@nestjs/common';

import { HttpApiModule } from '../../../../foundation/api/adapter/nest/modules/HttpApiModule';
import { CreateUserMutationResolver } from '../../../application/resolvers/CreateUserMutationResolver';

@Module({
  exports: [CreateUserMutationResolver],
  imports: [HttpApiModule],
  providers: [CreateUserMutationResolver],
})
export class UsersModule {}
