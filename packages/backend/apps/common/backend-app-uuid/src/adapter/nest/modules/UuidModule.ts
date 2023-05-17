import { Module } from '@nestjs/common';

import { uuidProviderOutputPortSymbol } from '../../../application/ports/output/UuidProviderOutputPort';
import { UuidProviderNodeJsAdapter } from '../../nodejs/adapters/UuidProviderNodeJsAdapter';

@Module({
  exports: [uuidProviderOutputPortSymbol],
  providers: [
    {
      provide: uuidProviderOutputPortSymbol,
      useClass: UuidProviderNodeJsAdapter,
    },
  ],
})
export class UuidModule {}
