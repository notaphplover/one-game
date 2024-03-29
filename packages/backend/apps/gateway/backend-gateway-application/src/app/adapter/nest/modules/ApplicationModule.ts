import { Module } from '@nestjs/common';

import { AuthModule } from '../../../../auth/adapter/nest/modules/AuthModule';
import { GamesModule } from '../../../../games/adapter/nest/modules/GamesModule';
import { UsersModule } from '../../../../users/adapter/nest/modules/UsersModule';
import { ApplicationResolver } from '../../../application/resolvers/ApplicationResolver';
import { RootMutationResolver } from '../../../application/resolvers/RootMutationResolver';
import { RootQueryResolver } from '../../../application/resolvers/RootQueryResolver';

@Module({
  exports: [ApplicationResolver],
  imports: [AuthModule, GamesModule, UsersModule],
  providers: [ApplicationResolver, RootMutationResolver, RootQueryResolver],
})
export class ApplicationModule {}
