import { Module } from '@nestjs/common';

import { UserCanCreateAuthSpec } from '../../domain/specs/UserCanCreateAuthSpec';

@Module({
  exports: [UserCanCreateAuthSpec],
  providers: [UserCanCreateAuthSpec],
})
export class UserDomainModule {}
