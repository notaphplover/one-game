import { Module } from '@nestjs/common';

import { HttpApiModule } from '../../../../foundation/api/adapter/nest/modules/HttpApiModule';
import { UserMutationResolver } from '../../../application/resolvers/UserMutationResolver';
import { UserQueryResolver } from '../../../application/resolvers/UserQueryResolver';

@Module({
  exports: [UserQueryResolver, UserMutationResolver],
  imports: [HttpApiModule],
  providers: [UserQueryResolver, UserMutationResolver],
})
export class UsersModule {}
