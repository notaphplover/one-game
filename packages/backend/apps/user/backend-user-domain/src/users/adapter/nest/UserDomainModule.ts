import { Module } from '@nestjs/common';

import { IsValidUserCreateQuerySpec } from '../../domain/specs/IsValidUserCreateQuerySpec';
import { IsValidUserUpdateQuerySpec } from '../../domain/specs/IsValidUserUpdateQuerySpec';
import { UserCanCreateAuthSpec } from '../../domain/specs/UserCanCreateAuthSpec';

@Module({
  exports: [
    IsValidUserCreateQuerySpec,
    IsValidUserUpdateQuerySpec,
    UserCanCreateAuthSpec,
  ],
  providers: [
    IsValidUserCreateQuerySpec,
    IsValidUserUpdateQuerySpec,
    UserCanCreateAuthSpec,
  ],
})
export class UserDomainModule {}
