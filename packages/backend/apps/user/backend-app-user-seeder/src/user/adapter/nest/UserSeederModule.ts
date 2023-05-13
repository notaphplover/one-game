import { Module } from '@nestjs/common';

import { UserSeeder } from '../../application/UserSeeder';

@Module({
  exports: [UserSeeder],
  providers: [UserSeeder],
})
export class UserSeederModule {}
