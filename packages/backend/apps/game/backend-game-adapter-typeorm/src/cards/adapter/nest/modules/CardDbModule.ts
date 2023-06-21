import { Module } from '@nestjs/common';

import { CardBuilder } from '../../typeorm/builders/CardBuilder';
import { CardColorBuilder } from '../../typeorm/builders/CardColorBuilder';
import { CardColorDbBuilder } from '../../typeorm/builders/CardColorDbBuilder';
import { CardDbBuilder } from '../../typeorm/builders/CardDbBuilder';

@Module({
  exports: [CardBuilder, CardColorBuilder, CardColorDbBuilder, CardDbBuilder],
  providers: [CardBuilder, CardColorBuilder, CardColorDbBuilder, CardDbBuilder],
})
export class CardDbModule {}
