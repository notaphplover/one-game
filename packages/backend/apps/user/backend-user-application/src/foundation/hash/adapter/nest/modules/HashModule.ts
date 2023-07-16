import { Module } from '@nestjs/common';

import { bcryptHashProviderOutputPortSymbol } from '../../../application/ports/output/BcryptHashProviderOutputPort';
import { BcryptHashProviderBcryptAdapter } from '../../bcrypt/adapters/BcryptHashProviderBcryptAdapter';

@Module({
  exports: [bcryptHashProviderOutputPortSymbol],
  providers: [
    {
      provide: bcryptHashProviderOutputPortSymbol,
      useClass: BcryptHashProviderBcryptAdapter,
    },
  ],
})
export class HashModule {}
