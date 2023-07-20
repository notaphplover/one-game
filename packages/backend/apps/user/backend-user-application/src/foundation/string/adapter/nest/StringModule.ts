import { Module } from '@nestjs/common';

import { RandomHexStringBuilder } from '../../application/builders/RandomHexStringBuilder';

@Module({
  exports: [RandomHexStringBuilder],
  providers: [RandomHexStringBuilder],
})
export class StringModule {}
