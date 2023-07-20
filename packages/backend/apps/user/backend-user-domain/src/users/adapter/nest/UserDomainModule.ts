import { Module } from '@nestjs/common';

import { UserCanCreateAuthSpec } from '../../domain/specs/UserCanCreateAuthSpec';
import { UserCanCreateCodeSpec } from '../../domain/specs/UserCanCreateCodeSpec';

@Module({
  exports: [UserCanCreateAuthSpec, UserCanCreateCodeSpec],
  providers: [UserCanCreateAuthSpec, UserCanCreateCodeSpec],
})
export class UserDomainModule {}
