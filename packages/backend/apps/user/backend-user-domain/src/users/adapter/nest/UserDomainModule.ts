import { Module } from '@nestjs/common';

import { IsValidUserCreateQuerySpec } from '../../domain/specs/IsValidUserCreateQuerySpec';
import { UserCanCreateAuthSpec } from '../../domain/specs/UserCanCreateAuthSpec';
import { UserCanCreateCodeSpec } from '../../domain/specs/UserCanCreateCodeSpec';

@Module({
  exports: [
    IsValidUserCreateQuerySpec,
    UserCanCreateAuthSpec,
    UserCanCreateCodeSpec,
  ],
  providers: [
    IsValidUserCreateQuerySpec,
    UserCanCreateAuthSpec,
    UserCanCreateCodeSpec,
  ],
})
export class UserDomainModule {}
