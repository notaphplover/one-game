import { Module } from '@nestjs/common';

import { HttpApiModule } from '../../../../foundation/api/adapter/nest/modules/HttpApiModule';
import { FindUsersQueryResolver } from '../../../application/resolvers/FindUsersQueryResolver';
import { UserMutationResolver } from '../../../application/resolvers/UserMutationResolver';

@Module({
  exports: [FindUsersQueryResolver, UserMutationResolver],
  imports: [HttpApiModule],
  providers: [FindUsersQueryResolver, UserMutationResolver],
})
export class UsersModule {}
