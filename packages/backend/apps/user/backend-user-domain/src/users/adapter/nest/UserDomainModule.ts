import { Module } from '@nestjs/common';

import { IsValidUserCreateQuerySpec } from '../../domain/specs/IsValidUserCreateQuerySpec';
import { IsValidUserUpdateQuerySpec } from '../../domain/specs/IsValidUserUpdateQuerySpec';
import { UserCanCreateAuthSpec } from '../../domain/specs/UserCanCreateAuthSpec';
import { UserCanCreateCodeSpec } from '../../domain/specs/UserCanCreateCodeSpec';

@Module({
  exports: [
    IsValidUserCreateQuerySpec,
    IsValidUserUpdateQuerySpec,
    UserCanCreateAuthSpec,
    UserCanCreateCodeSpec,
  ],
  providers: [
    IsValidUserCreateQuerySpec,
    IsValidUserUpdateQuerySpec,
    UserCanCreateAuthSpec,
    UserCanCreateCodeSpec,
  ],
})
export class UserDomainModule {}
